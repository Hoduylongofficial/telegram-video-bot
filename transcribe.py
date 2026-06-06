"""
Transcribe audio using openai-whisper Python package.
Outputs word-level timestamps to transcript.json
Usage: python3 transcribe.py <audio_file> [language]
"""
import whisper
import json
import sys
import os

def transcribe(audio_path, language=None):
    print(f"Loading Whisper tiny model...")
    model = whisper.load_model("tiny")
    
    print(f"Transcribing: {audio_path}")
    options = {"word_timestamps": True}
    if language:
        options["language"] = language
    
    result = model.transcribe(audio_path, **options)
    
    words = []
    for segment in result.get("segments", []):
        for word in segment.get("words", []):
            text = word["word"].strip()
            if text:
                words.append({
                    "text": text,
                    "start": round(word["start"], 3),
                    "end": round(word["end"], 3)
                })
    
    # Write to transcript.json in current working directory
    output_path = os.path.join(os.getcwd(), "transcript.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Transcribed {len(words)} words → transcript.json")
    return words

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 transcribe.py <audio_file> [language]")
        sys.exit(1)
    
    audio_file = sys.argv[1]
    lang = sys.argv[2] if len(sys.argv) > 2 else None
    
    transcribe(audio_file, lang)
