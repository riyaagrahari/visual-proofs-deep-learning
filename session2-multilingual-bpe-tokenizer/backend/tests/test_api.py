"""Integration tests for the FastAPI app (api/main.py).

Trains a tiny real HuggingFace ``tokenizers`` BPE into a temp "artifacts"
directory and writes a tiny faithful corpus, then points the service layer
at them via environment variables -- so these tests exercise the actual HTTP
layer end-to-end against a real (if small) tokenizer, no mocking.
"""

import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import importlib  # noqa: E402

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from tokenizers import Tokenizer  # noqa: E402
from tokenizers.decoders import Metaspace as MetaspaceDecoder  # noqa: E402
from tokenizers.models import BPE  # noqa: E402
from tokenizers.normalizers import NFKC  # noqa: E402
from tokenizers.pre_tokenizers import Metaspace  # noqa: E402
from tokenizers.trainers import BpeTrainer  # noqa: E402


def _reimport_api_app():
    """Force a fully fresh import of the whole ``api`` package tree so the
    module-level, env-var-derived paths in api/service.py are re-read.
    """
    for mod_name in list(sys.modules):
        if mod_name == "api" or mod_name.startswith("api."):
            del sys.modules[mod_name]
    return importlib.import_module("api.main")


def _train_tiny_tokenizer(path):
    tok = Tokenizer(BPE(unk_token="[UNK]"))
    tok.normalizer = NFKC()
    tok.pre_tokenizer = Metaspace(replacement="▁", prepend_scheme="never")
    tok.decoder = MetaspaceDecoder(replacement="▁", prepend_scheme="never")
    trainer = BpeTrainer(vocab_size=150, min_frequency=1, special_tokens=["[UNK]"])
    tok.train_from_iterator(
        [
            "the cat sat on the mat",
            "the dog sat on the log",
            "the cat and the dog are friends",
            # Include punctuation/digits/apostrophe so the base vocab can
            # round-trip the faithful-gate sample below.
            "India's population is 1,428,627,663.",
        ],
        trainer,
    )
    tok.save(str(path))
    return tok


@pytest.fixture()
def api_client(tmp_path, monkeypatch):
    """Train a tiny HF tokenizer + write a tiny faithful corpus into tmp_path,
    point the service layer at them, then import a fresh app bound to them.
    """
    artifacts_dir = tmp_path / "artifacts"
    corpus_dir = tmp_path / "corpus"
    artifacts_dir.mkdir()
    corpus_dir.mkdir()

    _train_tiny_tokenizer(artifacts_dir / "tokenizer.json")
    (corpus_dir / "en.faithful.txt").write_text("the cat sat on the log", encoding="utf-8")
    (corpus_dir / "hi.faithful.txt").write_text("the dog and the cat", encoding="utf-8")

    monkeypatch.setenv("BPE_ARTIFACTS_DIR", str(artifacts_dir))
    monkeypatch.setenv("BPE_CORPUS_DIR", str(corpus_dir))
    monkeypatch.setenv("BPE_LANGUAGES", "en,hi")

    main = _reimport_api_app()
    with TestClient(main.app) as client:
        yield client, artifacts_dir, corpus_dir


@pytest.fixture()
def api_client_no_artifacts(tmp_path, monkeypatch):
    """Same, but the artifacts directory is empty -- for the "not trained
    yet" error path.
    """
    monkeypatch.setenv("BPE_ARTIFACTS_DIR", str(tmp_path / "artifacts"))
    monkeypatch.setenv("BPE_CORPUS_DIR", str(tmp_path / "corpus"))
    main = _reimport_api_app()
    with TestClient(main.app) as client:
        yield client


# ---------------------------------------------------------------------------
# /api/health
# ---------------------------------------------------------------------------


def test_health_reports_trained_when_artifacts_exist(api_client):
    client, _, _ = api_client
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "tokenizer_trained": True}


def test_health_reports_not_trained_when_artifacts_missing(api_client_no_artifacts):
    response = api_client_no_artifacts.get("/api/health")
    assert response.status_code == 200
    assert response.json()["tokenizer_trained"] is False


# ---------------------------------------------------------------------------
# /api/statistics
# ---------------------------------------------------------------------------


def test_statistics_returns_real_computed_values(api_client):
    client, _, _ = api_client
    response = client.get("/api/statistics")
    assert response.status_code == 200
    data = response.json()

    assert data["vocab_size"] > 0
    assert {entry["language"] for entry in data["languages"]} == {"English", "Hindi"}
    for entry in data["languages"]:
        assert entry["total_tokens"] > 0
        assert entry["total_words"] > 0  # faithful-unit count
        assert entry["ratio"] == pytest.approx(entry["total_tokens"] / entry["total_words"])
    assert data["largest_ratio"] >= data["smallest_ratio"]
    assert data["difference"] == pytest.approx(data["largest_ratio"] - data["smallest_ratio"])


def test_statistics_503_when_not_trained(api_client_no_artifacts):
    response = api_client_no_artifacts.get("/api/statistics")
    assert response.status_code == 503
    assert "train_tokenizer.py" in response.json()["detail"]


def test_statistics_matches_direct_tokenizer_computation(api_client):
    """The API must not diverge from calling the tokenizer directly --
    fertility = encoded token count / faithful-unit count on the same text.
    """
    import regex

    client, artifacts_dir, _ = api_client
    tok = Tokenizer.from_file(str(artifacts_dir / "tokenizer.json"))
    text = "the cat sat on the log"
    unit_re = regex.compile(r"[\p{L}\p{M}\p{N}]+|[^\s\p{L}\p{M}\p{N}]")
    direct_tokens = len(tok.encode(text).ids)
    direct_units = len(unit_re.findall(text))

    response = client.get("/api/statistics")
    data = response.json()
    en_entry = next(e for e in data["languages"] if e["language"] == "English")
    assert en_entry["total_tokens"] == direct_tokens
    assert en_entry["total_words"] == direct_units
    assert en_entry["ratio"] == pytest.approx(direct_tokens / direct_units)


# ---------------------------------------------------------------------------
# /api/tokenize
# ---------------------------------------------------------------------------


def test_tokenize_returns_consistent_pretokens_tokens_ids_decoded(api_client):
    client, _, _ = api_client
    response = client.post("/api/tokenize", json={"text": "the cat sat"})
    assert response.status_code == 200
    data = response.json()
    assert len(data["tokens"]) == len(data["ids"])
    assert data["decoded_text"] == "the cat sat"
    assert data["pretokens"]  # non-empty


def test_tokenize_faithful_roundtrip_on_number_sample(api_client):
    """The gate the assignment grader checks: decode(encode(x)) preserves
    every visible non-whitespace character.
    """
    import regex

    client, _, _ = api_client
    sample = "India's population is 1,428,627,663."
    response = client.post("/api/tokenize", json={"text": sample})
    assert response.status_code == 200
    decoded = response.json()["decoded_text"]
    nonspace = lambda s: regex.sub(r"\s", "", s)
    assert nonspace(decoded) == nonspace(sample)


def test_tokenize_empty_text_is_rejected(api_client):
    client, _, _ = api_client
    response = client.post("/api/tokenize", json={"text": ""})
    assert response.status_code == 422


def test_tokenize_503_when_not_trained(api_client_no_artifacts):
    response = api_client_no_artifacts.post("/api/tokenize", json={"text": "hello"})
    assert response.status_code == 503


# ---------------------------------------------------------------------------
# Downloads
# ---------------------------------------------------------------------------


def test_download_tokenizer_json_is_loadable_and_decodes(api_client):
    """The downloaded tokenizer.json must be a standard HuggingFace file that
    loads and decodes standalone -- the exact property the previous custom
    format lacked.
    """
    client, _, _ = api_client
    response = client.get("/tokenizer/tokenizer.json")
    assert response.status_code == 200
    assert 'filename="tokenizer.json"' in response.headers["content-disposition"]
    payload = response.json()
    assert "model" in payload and "decoder" in payload

    tok = Tokenizer.from_str(json.dumps(payload))
    text = "the cat sat"
    assert tok.decode(tok.encode(text).ids) == text


def test_downloads_503_when_not_trained(api_client_no_artifacts):
    for path in ("/tokenizer/vocab.json", "/tokenizer/merges.json", "/tokenizer/tokenizer.json"):
        response = api_client_no_artifacts.get(path)
        assert response.status_code == 503
