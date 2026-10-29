"""
Generates natural-sounding Listening audio with the open-source Kokoro voice model (Apache 2.0).

    npx -y tsx@4.19.2 --tsconfig tsconfig.json scripts/export-listening.ts > /tmp/listening.json
    python3 scripts/make-audio.py /tmp/listening.json

Needs: pip install kokoro-onnx soundfile, ffmpeg, and network access to huggingface.co (first run only;
the model is cached in ~/.cache/ielts-kokoro). Writes public/audio/listening/<test>/<clip>.mp3 and
content/listening-audio.ts (which clips exist, and when each script line starts, for the review screen).
Already-generated clips are skipped unless --force is given.
"""

import json
import subprocess
import sys
import urllib.request
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio" / "listening"
CACHE = Path.home() / ".cache" / "ielts-kokoro"
HF = "https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main"

NARRATOR = "bm_george"
LINE_GAP = 0.45  # seconds of silence between script lines
RATE = 24000

# Who sounds like whom. Kokoro has British (b) and American (a) voices; Australian speakers get a voice
# from the other accent of the pair so every conversation has clearly different speakers.
FEMALE = {"en-GB": ["bf_emma", "bf_isabella", "bf_alice"], "en-US": ["af_heart", "af_bella", "af_nicole"], "en-AU": ["bf_isabella", "af_sarah", "bf_lily"]}
MALE = {"en-GB": ["bm_lewis", "bm_fable", "bm_daniel"], "en-US": ["am_michael", "am_adam", "am_puck"], "en-AU": ["bm_daniel", "am_fenrir", "bm_fable"]}

# Speakers whose sex isn't obvious from the voice pitch in the content files.
SEX = {
    ("test-1", "Receptionist"): "f",
    ("test-1", "Organiser"): "f",  # Jo Patel
    ("test-1", "Lecturer"): "m",
    ("test-2", "Agent"): "m",  # Mark
    ("test-2", "Josh"): "m",
    ("test-2", "Lecturer"): "f",
    ("test-3", "Lecturer"): "m",
    ("test-4", "Manager"): "f",  # Grace
    ("test-4", "Sam"): "m",
    ("test-4", "Lecturer"): "m",
}

VOICES = ["bm_george", *{v for d in (FEMALE, MALE) for vs in d.values() for v in vs}]


def fetch(url: str, dest: Path):
    if dest.exists():
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    print("downloading", url)
    tmp = dest.with_suffix(".part")
    urllib.request.urlretrieve(url, tmp)
    tmp.rename(dest)


def load_model() -> Kokoro:
    fetch(f"{HF}/onnx/model.onnx", CACHE / "model.onnx")
    pack = CACHE / "voices.npz"
    if not pack.exists():
        arrays = {}
        for v in VOICES:
            fetch(f"{HF}/voices/{v}.bin", CACHE / "voices" / f"{v}.bin")
            arrays[v] = np.fromfile(CACHE / "voices" / f"{v}.bin", dtype=np.float32).reshape(-1, 1, 256)
        np.savez(pack, **arrays)
    return Kokoro(str(CACHE / "model.onnx"), str(pack))


def lang_of(voice: str) -> str:
    return "en-gb" if voice[0] == "b" else "en-us"


def cast(test_id: str, voices: dict) -> dict:
    """Gives each speaker in a part a distinct voice that is never the narrator's."""
    used, out = {NARRATOR}, {}
    for name, style in voices.items():
        sex = SEX.get((test_id, name)) or ("f" if style["pitch"] >= 1.05 else "m")
        pool = (FEMALE if sex == "f" else MALE)[style["lang"]]
        voice = next(v for v in pool if v not in used)
        used.add(voice)
        out[name] = (voice, style.get("rate") or 1.0)
    return out


def write_mp3(samples: np.ndarray, dest: Path):
    dest.parent.mkdir(parents=True, exist_ok=True)
    wav = dest.with_suffix(".wav")
    sf.write(wav, samples, RATE)
    subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-y", "-i", str(wav), "-ac", "1", "-codec:a", "libmp3lame", "-b:a", "64k", str(dest)],
        check=True,
    )
    wav.unlink()


def silence(seconds: float) -> np.ndarray:
    return np.zeros(int(seconds * RATE), dtype=np.float32)


def main():
    data = json.loads(Path(sys.argv[1]).read_text())
    force = "--force" in sys.argv
    tts = load_model()
    manifest = {}
    timings_file = OUT / "timings.json"
    old_timings = json.loads(timings_file.read_text()) if timings_file.exists() else {}

    for test in data:
        folder = OUT / test["id"]
        for clip in test["narration"]:
            dest = folder / f"{clip['id']}.mp3"
            if force or not dest.exists():
                samples, _ = tts.create(clip["text"], voice=NARRATOR, speed=0.95, lang="en-gb")
                write_mp3(np.concatenate([samples, silence(0.3)]), dest)
        parts = []
        for i, part in enumerate(test["parts"]):
            dest = folder / f"{part['id']}.mp3"
            key = f"{test['id']}/{part['id']}"
            if not force and dest.exists() and key in old_timings:
                parts.append(old_timings[key])
                continue
            cast_list = cast(test["id"], part["voices"])
            print(test["id"], part["id"], {k: v[0] for k, v in cast_list.items()})
            chunks, starts, t = [], [], 0.0
            for line in part["script"]:
                voice, rate = cast_list[line["speaker"]]
                samples, _ = tts.create(line["text"], voice=voice, speed=rate, lang=lang_of(voice))
                starts.append(round(t, 2))
                chunks += [samples, silence(LINE_GAP)]
                t += (len(samples) / RATE) + LINE_GAP
            write_mp3(np.concatenate(chunks), dest)
            parts.append(starts)
        manifest[test["id"]] = parts
        for i, starts in enumerate(parts):
            old_timings[f"{test['id']}/p{i + 1}-script"] = starts

    timings_file.write_text(json.dumps(old_timings))
    ts = ROOT / "content" / "listening-audio.ts"
    ts.write_text(
        "// Generated by scripts/make-audio.py — do not edit by hand.\n"
        "// For each Listening test with recorded audio: the start time (seconds) of every script line, per part.\n"
        f"export const LISTENING_AUDIO: Record<string, number[][]> = {json.dumps(manifest, indent=2)};\n"
    )
    print("done:", ", ".join(manifest))


if __name__ == "__main__":
    main()
