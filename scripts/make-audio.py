"""
Generates the Listening recordings: a narrator plus a different voice for each speaker.

    npx -y tsx@4.19.2 --tsconfig tsconfig.json scripts/export-listening.ts > /tmp/listening.json
    AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=eastus python3 scripts/make-audio.py /tmp/listening.json

The Speaking examiner is recorded the same way:

    npx -y tsx@4.19.2 --tsconfig tsconfig.json scripts/export-speaking.ts > /tmp/speaking.json
    AZURE_SPEECH_KEY=... python3 scripts/make-audio.py --speaking /tmp/speaking.json

Voices come from Microsoft Azure neural text-to-speech when AZURE_SPEECH_KEY is set (natural British,
Australian and American voices; the free F0 tier is enough), otherwise from the open-source Kokoro model
(pip install kokoro-onnx; downloads from huggingface.co on first use). Needs ffmpeg and soundfile.

Writes public/audio/listening/<test>/<clip>.mp3 and content/listening-audio.ts (which tests have audio,
and when each script line starts, for the review screen). Every synthesised line is cached in
~/.cache/ielts-tts, so re-running only pays for lines that changed. --force rebuilds every clip.
"""

import hashlib
import io
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from xml.sax.saxutils import escape

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio" / "listening"
CACHE = Path.home() / ".cache" / "ielts-tts"
RATE = 24000
LINE_GAP = 0.5  # seconds of silence between script lines

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


class Azure:
    """Microsoft Azure neural voices over the REST API (one request per line; F0 allows 20 a minute)."""

    name = "azure"
    NARRATOR = "en-GB-RyanNeural"
    FEMALE = {
        "en-GB": ["en-GB-SoniaNeural", "en-GB-LibbyNeural", "en-GB-OliviaNeural", "en-GB-HollieNeural", "en-GB-AbbiNeural", "en-GB-BellaNeural"],
        "en-AU": ["en-AU-NatashaNeural", "en-AU-AnnetteNeural", "en-AU-CarlyNeural", "en-AU-FreyaNeural", "en-AU-JoanneNeural", "en-AU-TinaNeural"],
        "en-US": ["en-US-JennyNeural", "en-US-AvaNeural", "en-US-EmmaNeural", "en-US-AriaNeural", "en-US-SaraNeural", "en-US-MichelleNeural"],
    }
    MALE = {
        "en-GB": ["en-GB-ThomasNeural", "en-GB-AlfieNeural", "en-GB-ElliotNeural", "en-GB-NoahNeural", "en-GB-OliverNeural", "en-GB-EthanNeural"],
        "en-AU": ["en-AU-WilliamNeural", "en-AU-DarrenNeural", "en-AU-DuncanNeural", "en-AU-KenNeural", "en-AU-NeilNeural", "en-AU-TimNeural"],
        "en-US": ["en-US-AndrewNeural", "en-US-BrianNeural", "en-US-GuyNeural", "en-US-DavisNeural", "en-US-ChristopherNeural", "en-US-EricNeural"],
    }

    def __init__(self, key: str, region: str):
        self.key, self.base = key, f"https://{region}.tts.speech.microsoft.com"
        req = urllib.request.Request(f"{self.base}/cognitiveservices/voices/list", headers={"Ocp-Apim-Subscription-Key": key})
        available = {v["ShortName"] for v in json.load(urllib.request.urlopen(req))}
        # Keep only voices this region offers.
        for table in (self.FEMALE, self.MALE):
            for lang in table:
                table[lang] = [v for v in table[lang] if v in available]
        self.last = 0.0

    def synth(self, text: str, voice: str, rate: float) -> np.ndarray:
        lang = voice[:5]
        ssml = (
            f'<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="{lang}">'
            f'<voice name="{voice}"><prosody rate="{round((rate - 1) * 100):+d}%">{escape(text)}</prosody></voice></speak>'
        )
        for attempt in range(6):
            time.sleep(max(0, self.last + 3.2 - time.time()))  # stay under 20 requests a minute
            self.last = time.time()
            req = urllib.request.Request(
                f"{self.base}/cognitiveservices/v1",
                data=ssml.encode(),
                headers={
                    "Ocp-Apim-Subscription-Key": self.key,
                    "Content-Type": "application/ssml+xml",
                    "X-Microsoft-OutputFormat": "riff-24khz-16bit-mono-pcm",
                    "User-Agent": "ielts-coach",
                },
            )
            try:
                data, _ = sf.read(io.BytesIO(urllib.request.urlopen(req, timeout=60).read()), dtype="float32")
                return data
            except urllib.error.HTTPError as e:
                if e.code not in (429, 500, 502, 503) or attempt == 5:
                    raise
                time.sleep(10 * (attempt + 1))
        raise RuntimeError("unreachable")


class KokoroTTS:
    """The open-source Kokoro model (Apache 2.0), run locally."""

    name = "kokoro"
    NARRATOR = "bm_george"
    # Only Kokoro's best-rated voices; never af_nicole (it whispers).
    FEMALE = {"en-GB": ["bf_emma", "bf_isabella"], "en-US": ["af_heart", "af_bella", "af_aoede", "af_kore"], "en-AU": ["bf_isabella", "af_sarah", "af_bella"]}
    MALE = {"en-GB": ["bm_fable", "bm_george"], "en-US": ["am_michael", "am_fenrir", "am_puck"], "en-AU": ["bm_fable", "am_fenrir", "am_michael"]}
    HF = "https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main"

    def __init__(self):
        from kokoro_onnx import Kokoro

        home = CACHE / "kokoro-model"
        voices = sorted({self.NARRATOR, *(v for t in (self.FEMALE, self.MALE) for vs in t.values() for v in vs)})
        self._fetch(f"{self.HF}/onnx/model.onnx", home / "model.onnx")
        for v in voices:
            self._fetch(f"{self.HF}/voices/{v}.bin", home / "voices" / f"{v}.bin")
        pack = home / "voices.npz"
        np.savez(pack, **{v: np.fromfile(home / "voices" / f"{v}.bin", dtype=np.float32).reshape(-1, 1, 256) for v in voices})
        self.tts = Kokoro(str(home / "model.onnx"), str(pack))

    @staticmethod
    def _fetch(url: str, dest: Path):
        if dest.exists():
            return
        dest.parent.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(url, dest.with_suffix(".part"))
        dest.with_suffix(".part").rename(dest)

    def synth(self, text: str, voice: str, rate: float) -> np.ndarray:
        samples, _ = self.tts.create(text, voice=voice, speed=rate, lang="en-gb" if voice[0] == "b" else "en-us")
        return samples


def cached(tts, text: str, voice: str, rate: float) -> np.ndarray:
    key = hashlib.sha1(f"{tts.name}|{voice}|{rate}|{text}".encode()).hexdigest()
    path = CACHE / tts.name / f"{key}.wav"
    if path.exists():
        return sf.read(path, dtype="float32")[0]
    samples = tts.synth(text, voice, rate)
    path.parent.mkdir(parents=True, exist_ok=True)
    sf.write(path, samples, RATE)
    return samples


def cast(tts, test_id: str, test_index: int, parts: list) -> list:
    """A voice for every speaker in every part of a test: distinct within a part, never the narrator's,
    and spread across the test so one voice doesn't play several people."""
    used_in_test, out = {tts.NARRATOR}, []
    for i, part in enumerate(parts):
        used, chosen = {tts.NARRATOR}, {}
        for name, style in part["voices"].items():
            sex = SEX.get((test_id, name)) or ("f" if style["pitch"] >= 1.05 else "m")
            table = tts.FEMALE if sex == "f" else tts.MALE
            pool = table[style["lang"]]
            shift = (test_index * 2 + i) % max(1, len(pool))
            pool = pool[shift:] + pool[:shift]
            spare = [v for vs in table.values() for v in vs]
            voice = next((v for v in pool if v not in used_in_test), None) or next(v for v in pool + spare if v not in used)
            used.add(voice)
            used_in_test.add(voice)
            chosen[name] = (voice, style.get("rate") or 1.0)
        out.append(chosen)
    return out


def write_mp3(samples: np.ndarray, dest: Path):
    """Encodes to MP3 with every clip normalised to the same loudness (-16 LUFS, like podcasts)."""
    dest.parent.mkdir(parents=True, exist_ok=True)
    wav = dest.with_suffix(".wav")
    sf.write(wav, samples, RATE)
    subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-y", "-i", str(wav), "-ac", "1", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "24000",
         "-codec:a", "libmp3lame", "-b:a", "64k", str(dest)],
        check=True,
    )
    wav.unlink()


def silence(seconds: float) -> np.ndarray:
    return np.zeros(int(seconds * RATE), dtype=np.float32)


def make_speaking(tts, data: list, force: bool):
    """One clip per examiner sentence, named by a hash of its text; the manifest maps text -> file."""
    manifest = {}
    for s in data:
        voice = s["voice"]
        if tts.name == "kokoro":  # no Canadian voices in Kokoro: a British voice of the same sex instead
            voice = "bm_fable" if any(m in voice for m in ("Liam", "Thomas", "Ryan")) else "bf_emma"
        folder = OUT.parent / "speaking" / s["id"]
        files = {}
        for text in s["lines"]:
            name = hashlib.sha1(f"{voice}|{text}".encode()).hexdigest()[:12] + ".mp3"
            if force or not (folder / name).exists():
                write_mp3(np.concatenate([cached(tts, text, voice, 1.0), silence(0.2)]), folder / name)
            files[text] = name
        for old in folder.glob("*.mp3"):  # clips for sentences that changed or were removed
            if old.name not in files.values():
                old.unlink()
        manifest[s["id"]] = files
        print(s["id"], voice, len(files), "clips", flush=True)
    (ROOT / "content" / "speaking-audio.ts").write_text(
        "// Generated by scripts/make-audio.py — do not edit by hand.\n"
        "// For each Speaking set with a recorded examiner: what the examiner says -> its file in public/audio/speaking/<set>/.\n"
        f"export const SPEAKING_AUDIO: Record<string, Record<string, string>> = {json.dumps(manifest, indent=1, ensure_ascii=False)};\n"
    )


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    data = json.loads(Path(args[0]).read_text())
    force = "--force" in sys.argv
    key = os.environ.get("AZURE_SPEECH_KEY")
    tts = Azure(key, os.environ.get("AZURE_SPEECH_REGION", "eastus")) if key else KokoroTTS()
    print("voices:", tts.name)
    if "--speaking" in sys.argv:
        make_speaking(tts, data, force)
        return
    timings_file = OUT / "timings.json"
    timings = json.loads(timings_file.read_text()) if timings_file.exists() and not force else {}
    manifest = {}

    for ti, test in enumerate(data):
        folder = OUT / test["id"]
        for clip in test["narration"]:
            dest = folder / f"{clip['id']}.mp3"
            if force or not dest.exists():
                write_mp3(np.concatenate([cached(tts, clip["text"], tts.NARRATOR, 0.95), silence(0.3)]), dest)
        casting = cast(tts, test["id"], ti, test["parts"])
        parts = []
        for part, voices in zip(test["parts"], casting):
            print(test["id"], {k: v[0] for k, v in voices.items()}, flush=True)
            segments = []
            for seg in part["segments"]:
                key_ = f"{test['id']}/{seg['id']}"
                dest = folder / f"{seg['id']}.mp3"
                if not force and dest.exists() and key_ in timings:
                    segments.append(timings[key_])
                    continue
                chunks, starts, t = [], [], 0.0
                for line in seg["script"]:
                    voice, rate = voices[line["speaker"]]
                    samples = cached(tts, line["text"], voice, rate)
                    starts.append(round(t, 2))
                    chunks += [samples, silence(LINE_GAP)]
                    t += len(samples) / RATE + LINE_GAP
                write_mp3(np.concatenate(chunks), dest)
                timings[key_] = starts
                segments.append(starts)
            parts.append(segments)
        manifest[test["id"]] = parts
        timings_file.parent.mkdir(parents=True, exist_ok=True)
        timings_file.write_text(json.dumps(timings))

    ts = ROOT / "content" / "listening-audio.ts"
    ts.write_text(
        "// Generated by scripts/make-audio.py — do not edit by hand.\n"
        "// For each Listening test with recorded audio, per part and per recording segment (two when the part has a\n"
        "// mid-part break): the start time in seconds of every script line in that segment's file.\n"
        f"export const LISTENING_AUDIO: Record<string, number[][][]> = {json.dumps(manifest)};\n"
    )
    print("done:", ", ".join(manifest))


if __name__ == "__main__":
    main()
