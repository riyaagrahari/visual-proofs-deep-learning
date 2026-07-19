"""Loads the trained HuggingFace ``tokenizers`` tokenizer + the faithful
Markdown corpus and runs the actual tokenizer to answer every API request.
No statistic is cached or approximated independently of the tokenizer --
this module is a thin orchestration layer over ``tokenizers.Tokenizer``.

The served ``tokenizer.json`` is a standard HuggingFace ``tokenizers`` file
(BPE model + NFKC normalizer + Metaspace pre-tokenizer/decoder), so ANY
consumer -- including the assignment grader -- can do
``Tokenizer.from_file(...).decode(encode(...))`` and get faithful text back.

Fertility is measured with the assignment's *faithful unit* denominator:
one contiguous Unicode letter/mark/number run, or one visible non-space
punctuation/symbol character.

Paths (overridable via environment variables, for flexible deployment):

    BPE_ARTIFACTS_DIR  -- dir with tokenizer.json / vocab.json / merges.json
                          (default: backend/artifacts)
    BPE_CORPUS_DIR     -- dir with <lang>.faithful.txt evaluation corpus
                          (default: <project>/corpus)
    BPE_LANGUAGES      -- comma-separated language codes (default: en,hi,te,ta)
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import regex
from tokenizers import Tokenizer

_API_DIR = Path(__file__).resolve().parent
_BACKEND_DIR = _API_DIR.parent
_PROJECT_ROOT = _BACKEND_DIR.parent

ARTIFACTS_DIR = Path(os.environ.get("BPE_ARTIFACTS_DIR", _BACKEND_DIR / "artifacts"))
CORPUS_DIR = Path(os.environ.get("BPE_CORPUS_DIR", _PROJECT_ROOT / "corpus"))
LANGUAGES: list[str] = [
    lang.strip()
    for lang in os.environ.get("BPE_LANGUAGES", "en,hi,te,ta").split(",")
    if lang.strip()
]

TOKENIZER_PATH = ARTIFACTS_DIR / "tokenizer.json"
VOCAB_PATH = ARTIFACTS_DIR / "vocab.json"
MERGES_PATH = ARTIFACTS_DIR / "merges.json"

LANGUAGE_DISPLAY_NAMES: dict[str, str] = {
    "en": "English",
    "hi": "Hindi",
    "te": "Telugu",
    "ta": "Tamil",
}

# One faithful unit = a contiguous Unicode letter/mark/number run, OR a
# single visible non-space punctuation/symbol character (the assignment's
# fertility denominator).
FAITHFUL_UNIT_RE = regex.compile(r"[\p{L}\p{M}\p{N}]+|[^\s\p{L}\p{M}\p{N}]")


def display_name(language_code: str) -> str:
    return LANGUAGE_DISPLAY_NAMES.get(language_code, language_code)


class ArtifactsNotFoundError(RuntimeError):
    """Raised when tokenizer.json doesn't exist yet (tokenizer not trained).

    The caller (main.py) turns this into a 503 with an actionable message
    -- never a fabricated response.
    """


class NoEvaluationDataError(RuntimeError):
    """Raised when no language under BPE_CORPUS_DIR has any usable text."""


def faithful_units(text: str) -> int:
    return len(FAITHFUL_UNIT_RE.findall(text))


# ---------------------------------------------------------------------------
# Tokenizer loading, cached and invalidated by the artifact mtime so a fresh
# training run is picked up without restarting the server.
# ---------------------------------------------------------------------------

_tokenizer_cache: tuple[float, Tokenizer] | None = None


def _require_artifacts() -> None:
    if not TOKENIZER_PATH.exists():
        raise ArtifactsNotFoundError(
            f"No trained tokenizer found at {TOKENIZER_PATH}. Run "
            "'python tools/train_tokenizer.py' and copy tokenizer.json into "
            f"{ARTIFACTS_DIR} (see tools/ for the build+train pipeline)."
        )


def get_tokenizer() -> Tokenizer:
    """Return the trained tokenizer, reloading if tokenizer.json changed."""
    global _tokenizer_cache
    _require_artifacts()

    mtime = TOKENIZER_PATH.stat().st_mtime
    if _tokenizer_cache is not None and _tokenizer_cache[0] == mtime:
        return _tokenizer_cache[1]

    tokenizer = Tokenizer.from_file(str(TOKENIZER_PATH))
    _tokenizer_cache = (mtime, tokenizer)
    return tokenizer


def get_tokenizer_config() -> dict:
    path = ARTIFACTS_DIR / "tokenizer_config.json"
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def _corpus_text(language: str) -> str | None:
    path = CORPUS_DIR / f"{language}.faithful.txt"
    if not path.exists():
        return None
    return path.read_text(encoding="utf-8")


# ---------------------------------------------------------------------------
# Statistics (GET /api/statistics)
# ---------------------------------------------------------------------------


@dataclass
class LanguageRatio:
    language: str
    total_tokens: int
    total_words: int  # here: faithful-unit count (the fertility denominator)
    ratio: float


@dataclass
class RatioReport:
    vocab_size: int
    languages: list[LanguageRatio]
    largest_ratio: float
    smallest_ratio: float
    difference: float
    assignment_score: Any


def compute_statistics() -> RatioReport:
    """Run the real tokenizer over the faithful corpus and compute, per
    language, ``ratio = tokens / faithful_units``; then the largest/smallest
    ratio, their difference (spread), and ``score = 1000 / difference``.
    """
    tokenizer = get_tokenizer()

    languages: list[LanguageRatio] = []
    any_text = False
    for lang in LANGUAGES:
        text = _corpus_text(lang)
        if not text:
            languages.append(LanguageRatio(display_name(lang), 0, 0, 0.0))
            continue
        any_text = True
        units = faithful_units(text)
        n_tokens = len(tokenizer.encode(text).ids)
        ratio = n_tokens / units if units else 0.0
        languages.append(LanguageRatio(display_name(lang), n_tokens, units, ratio))

    if not any_text:
        raise NoEvaluationDataError(
            f"No faithful corpus found under {CORPUS_DIR}. Run "
            "'python tools/build_corpus.py' to generate <lang>.faithful.txt."
        )

    ratios = [entry.ratio for entry in languages if entry.total_words > 0]
    largest = max(ratios) if ratios else 0.0
    smallest = min(ratios) if ratios else 0.0
    difference = largest - smallest
    score: Any = "Infinity" if difference == 0 else 1000.0 / difference

    return RatioReport(
        vocab_size=tokenizer.get_vocab_size(),
        languages=languages,
        largest_ratio=largest,
        smallest_ratio=smallest,
        difference=difference,
        assignment_score=score,
    )


# ---------------------------------------------------------------------------
# Playground (POST /api/tokenize)
# ---------------------------------------------------------------------------


def tokenize_text(text: str) -> dict:
    tokenizer = get_tokenizer()
    pre = tokenizer.pre_tokenizer.pre_tokenize_str(text)
    pretokens = [piece for piece, _offsets in pre]
    encoding = tokenizer.encode(text)
    return {
        "pretokens": pretokens,
        "tokens": encoding.tokens,
        "ids": encoding.ids,
        "decoded_text": tokenizer.decode(encoding.ids),
    }


# ---------------------------------------------------------------------------
# Downloads
# ---------------------------------------------------------------------------


def build_combined_tokenizer_json() -> str:
    """Return the authoritative HuggingFace ``tokenizers`` tokenizer.json --
    a self-contained file (model + normalizer + pre-tokenizer + decoder) that
    ``Tokenizer.from_file(...)`` loads and decodes anywhere.
    """
    _require_artifacts()
    return TOKENIZER_PATH.read_text(encoding="utf-8")
