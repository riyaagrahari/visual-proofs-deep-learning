#!/usr/bin/env python3
"""Train the shared 10k BPE tokenizer for the faithful Markdown corpus.

Produces a standard HuggingFace ``tokenizers`` ``tokenizer.json`` (BPE model +
NFKC normalizer + Metaspace pre-tokenizer/decoder) so that ANY consumer can do
``Tokenizer.from_file(...).decode(encode(...))`` and get faithful text back.

Run:
    python tools/build_corpus.py
    python tools/train_tokenizer.py
"""
from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path

import regex
from tokenizers import Tokenizer
from tokenizers.decoders import Metaspace as MetaspaceDecoder
from tokenizers.models import BPE
from tokenizers.normalizers import NFKC
from tokenizers.pre_tokenizers import Metaspace
from tokenizers.trainers import BpeTrainer

ROOT = Path(__file__).resolve().parent.parent
CORPUS = ROOT / "corpus"
OUT_DIR = ROOT / "tools" / "out"
OUT_TOKENIZER = OUT_DIR / "tokenizer.json"
OUT_METRICS = OUT_DIR / "metrics.json"
# Where the FastAPI backend reads its artifacts from (what the site serves).
ARTIFACTS_DIR = ROOT / "backend" / "artifacts"

LANG_NAMES = {"en": "English", "hi": "Hindi", "te": "Telugu", "ta": "Tamil"}
LANGS = list(LANG_NAMES)

# Per-language duplication weights during training. Tuned so that every
# language's fertility stays under the 1.2 barrier and the spread (max-min)
# is small. Override with e.g. WEIGHTS="en=3,hi=4,te=4,ta=3".
DEFAULT_WEIGHTS = {"en": 2, "hi": 3, "te": 5, "ta": 3}
FAITHFUL_UNIT_RE = regex.compile(r"[\p{L}\p{M}\p{N}]+|[^\s\p{L}\p{M}\p{N}]")


def parse_weights() -> dict[str, int]:
    raw = os.environ.get("WEIGHTS")
    if not raw:
        return dict(DEFAULT_WEIGHTS)
    weights = {}
    for part in raw.split(","):
        code, _, val = part.partition("=")
        weights[code.strip()] = int(val)
    return weights


def faithful_units(text: str) -> int:
    return len(FAITHFUL_UNIT_RE.findall(text))


def make_tokenizer() -> Tokenizer:
    tokenizer = Tokenizer(BPE(unk_token="[UNK]"))
    tokenizer.normalizer = NFKC()
    tokenizer.pre_tokenizer = Metaspace(replacement="▁", prepend_scheme="never")
    tokenizer.decoder = MetaspaceDecoder(replacement="▁", prepend_scheme="never")
    return tokenizer


def train(weights: dict[str, int]) -> tuple[Tokenizer, dict]:
    texts = {
        code: (CORPUS / f"{code}.faithful.txt").read_text(encoding="utf-8")
        for code in LANGS
    }
    units = {code: faithful_units(text) for code, text in texts.items()}

    with tempfile.TemporaryDirectory() as tmp:
        files: list[str] = []
        tmpdir = Path(tmp)
        for code, text in texts.items():
            path = tmpdir / f"{code}.txt"
            path.write_text(text, encoding="utf-8")
            files.extend([str(path)] * weights[code])

        tokenizer = make_tokenizer()
        trainer = BpeTrainer(
            vocab_size=10000,
            min_frequency=1,
            special_tokens=["[UNK]"],
        )
        tokenizer.train(files, trainer)

    token_counts = {code: len(tokenizer.encode(text).ids) for code, text in texts.items()}
    ratios = {code: token_counts[code] / units[code] for code in LANGS}
    spread = max(ratios.values()) - min(ratios.values())
    score = 1000 / spread

    metrics = {
        "variant": "wiki_faithful_markdown",
        "languages": LANG_NAMES,
        "weights": weights,
        "vocab_size": tokenizer.get_vocab_size(),
        "faithful_units": units,
        "unit_policy": "Counts each contiguous Unicode letter/mark/number run as one unit and each visible non-space punctuation/symbol character as one unit.",
        "token_counts": token_counts,
        "ratios": ratios,
        "spread": spread,
        "score": score,
    }
    return tokenizer, metrics


def export_vocab_and_merges(tokenizer_json_path: Path) -> tuple[str, str]:
    """Derive vocab.json (token -> id) and merges.json (ranked pairs) from
    the saved HuggingFace tokenizer.json, so the site's secondary download
    links stay consistent with the authoritative tokenizer.json.
    """
    model = json.loads(tokenizer_json_path.read_text(encoding="utf-8"))["model"]
    vocab = model.get("vocab", {})
    merges = model.get("merges", [])
    # tokenizers >=0.20 stores merges as ["a", "b"] pairs; older as "a b".
    merges_str = [m if isinstance(m, str) else " ".join(m) for m in merges]
    return (
        json.dumps(vocab, ensure_ascii=False, indent=2),
        json.dumps(merges_str, ensure_ascii=False, indent=2),
    )


def deploy_to_artifacts(metrics: dict) -> None:
    """Copy the trained tokenizer + derived vocab/merges into
    backend/artifacts so the FastAPI backend serves them directly.
    """
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    (ARTIFACTS_DIR / "tokenizer.json").write_text(
        OUT_TOKENIZER.read_text(encoding="utf-8"), encoding="utf-8"
    )
    vocab_json, merges_json = export_vocab_and_merges(OUT_TOKENIZER)
    (ARTIFACTS_DIR / "vocab.json").write_text(vocab_json, encoding="utf-8")
    (ARTIFACTS_DIR / "merges.json").write_text(merges_json, encoding="utf-8")

    config = {
        "model": "HuggingFace BPE",
        "vocab_size": metrics["vocab_size"],
        "languages": metrics["languages"],
        "weights": metrics["weights"],
        "normalizer": "NFKC",
        "pre_tokenizer": "Metaspace(▁)",
        "decoder": "Metaspace(▁)",
        "variant": metrics["variant"],
        "ratios": metrics["ratios"],
        "spread": metrics["spread"],
        "score": metrics["score"],
        "unit_policy": metrics["unit_policy"],
    }
    (ARTIFACTS_DIR / "tokenizer_config.json").write_text(
        json.dumps(config, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (ARTIFACTS_DIR / "eval_report.json").write_text(
        json.dumps(metrics, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    tokenizer, metrics = train(parse_weights())
    tokenizer.save(str(OUT_TOKENIZER))
    OUT_METRICS.write_text(json.dumps(metrics, ensure_ascii=False, indent=2), encoding="utf-8")
    deploy_to_artifacts(metrics)
    print(json.dumps(metrics, ensure_ascii=False, indent=2))
    print(f"\nDeployed tokenizer.json, vocab.json, merges.json to {ARTIFACTS_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
