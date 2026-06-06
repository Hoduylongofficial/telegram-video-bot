import asyncio
import edge_tts
import sys
import os

async def amain():
    if len(sys.argv) < 3:
        print("Usage: python tts.py <text_or_file> <output_file> [voice]")
        sys.exit(1)
        
    text_input = sys.argv[1]
    output_file = sys.argv[2]
    voice = sys.argv[3] if len(sys.argv) > 3 else "vi-VN-HoaiMyNeural"
    
    # Read text from file if it is a file path and exists
    if os.path.isfile(text_input):
        with open(text_input, "r", encoding="utf-8") as f:
            text = f.read().strip()
    else:
        text = text_input.strip()
        
    print(f"Synthesizing text using voice: {voice}")
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_file)
    print(f"Speech saved to {output_file}")

if __name__ == "__main__":
    asyncio.run(amain())
