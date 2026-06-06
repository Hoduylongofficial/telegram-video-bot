import { GoogleGenerativeAI } from "@google/generative-ai";
import { execSync, spawn } from "child_process";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Error: GEMINI_API_KEY is not defined in .env");
  process.exit(1);
}
const ai = new GoogleGenerativeAI(apiKey);

/**
 * Clean transcript by filtering out music tokens and empty words
 */
function cleanTranscript(words) {
  return words.filter(w => {
    if (!w.text || w.text.trim().length === 0) return false;
    // Remove music tokens
    if (/^[♪\u266a\u266b\u266c\u266d\u266e\u266f]+$/.test(w.text)) return false;
    // Remove short filler words
    if (/^(huh|uh|um|ah|oh)$/i.test(w.text) && (w.end - w.start) < 0.1) return false;
    return true;
  });
}

/**
 * Fuzzy search a word in the transcript starting from a certain index
 */
function findWordIndex(words, searchWord, startIndex) {
  const cleanSearch = searchWord.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!cleanSearch) return -1;
  
  for (let i = startIndex; i < words.length; i++) {
    const cleanWord = words[i].text.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (cleanWord === cleanSearch || cleanWord.includes(cleanSearch) || cleanSearch.includes(cleanWord)) {
      return i;
    }
  }
  return -1;
}

/**
 * Main orchestration function
 */
export async function generateVideo(promptText, logCallback = console.log) {
  logCallback("🤖 Khởi tạo... (Initializing generation)");
  
  // 1. Call Gemini to expand script and generate metadata variables
  logCallback("📝 Đang phân tích kịch bản bằng Gemini AI... (Analyzing script with Gemini AI)");
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  const systemInstruction = `
You are a professional video storyboard scriptwriter. You take a short user script/prompt (in Vietnamese or English) and expand it into a structured storyboard config for a 15-second Cybersecurity Promo Video.
The video has 4 beats:
- Beat 1 (Hook): An alarming hook question (e.g. Is your password exposed?).
- Beat 2 (Problem): The scale of database leaks (specify a stat and mock leaked emails).
- Beat 3 (Solution): Zero-logs client-side cryptographic hashing solution.
- Beat 4 (CTA): The call-to-action button and website link.

Your output must be in the same language as the user's input. If the prompt is in Vietnamese, all text fields must be in Vietnamese. If in English, keep them in English.
For the voiceover fields:
- "voiceover" should be the combined voiceover text.
- "beat1_vo", "beat2_vo", "beat3_vo", "beat4_vo" should contain the exact voiceover text spoken during each beat. The concatenation of these 4 fields must match "voiceover" exactly (with standard spacing).
For the on-screen texts:
- Keep titles short (2-5 words) to avoid wrapping overlaps.
- Map highlight fields to the exact word to highlight in red/green (must be a word inside the title).
- For Beat 2 rows, output 5-7 mock obfuscated emails (e.g. a.ngu***@gmail.com) and matching breach names/sizes (e.g. Shopee 15M, Adobe 153M, Techcombank 8M).
- For Beat 3, provide a mock email, its SHA-256 hash (64 hex characters), and a security badge verification text.
- For Beat 4, provide the header name, the CTA button text, and the URL.
All fields are required and must match the structure.
`;

  const geminiPrompt = `User prompt: "${promptText}"\n\nGenerate the JSON output matching the requested schema.`;
  
  const response = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: geminiPrompt }] }],
    systemInstruction,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          voiceover: { type: "string" },
          beat1: {
            type: "object",
            properties: {
              title: { type: "string" },
              highlight: { type: "string" }
            },
            required: ["title", "highlight"]
          },
          beat2: {
            type: "object",
            properties: {
              header: { type: "string" },
              stat: { type: "string" },
              unit: { type: "string" },
              label: { type: "string" },
              rows: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    email: { type: "string" },
                    leak: { type: "string" }
                  },
                  required: ["email", "leak"]
                }
              }
            },
            required: ["header", "stat", "unit", "label", "rows"]
          },
          beat3: {
            type: "object",
            properties: {
              header: { type: "string" },
              email: { type: "string" },
              hash: { type: "string" },
              badge: { type: "string" }
            },
            required: ["header", "email", "hash", "badge"]
          },
          beat4: {
            type: "object",
            properties: {
              header: { type: "string" },
              buttonText: { type: "string" },
              url: { type: "string" }
            },
            required: ["header", "buttonText", "url"]
          },
          beat1_vo: { type: "string" },
          beat2_vo: { type: "string" },
          beat3_vo: { type: "string" },
          beat4_vo: { type: "string" }
        },
        required: [
          "voiceover",
          "beat1", "beat2", "beat3", "beat4",
          "beat1_vo", "beat2_vo", "beat3_vo", "beat4_vo"
        ]
      }
    }
  });

  const responseText = response.response.text();
  const storyboard = JSON.parse(responseText);
  logCallback("✅ Đã tạo kịch bản phân cảnh! (Storyboard parsed)");
  
  // 2. Determine voice language and synthesize TTS
  const isVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(storyboard.voiceover);
  const lang = isVietnamese ? "vi" : "en";
  const voice = isVietnamese ? "vi-VN-HoaiMyNeural" : "en-US-AriaNeural";
  
  logCallback(`🎙️ Đang tạo giọng đọc (${lang === "vi" ? "Tiếng Việt" : "Tiếng Anh"})... (Generating TTS)`);
  
  const assetsDir = path.join(process.cwd(), "assets");
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);
  
  const tempMp3 = path.join(assetsDir, "temp_narration.mp3");
  const finalWav = path.join(assetsDir, "narration.wav");
  
  // Run python tts.py script
  execSync(`python tts.py "${storyboard.voiceover.replace(/"/g, '\\"')}" "${tempMp3}" "${voice}"`);
  
  // Convert to proper WAV via ffmpeg
  logCallback("🎵 Đang chuyển đổi định dạng âm thanh... (Converting audio format)");
  execSync(`ffmpeg -y -i "${tempMp3}" -acodec pcm_s16le -ac 1 -ar 24000 "${finalWav}"`);
  
  // Delete temp mp3
  if (fs.existsSync(tempMp3)) fs.unlinkSync(tempMp3);
  
  // 3. Transcribe audio to get word-level timestamps using local Whisper
  logCallback("✍️ Đang chuyển giọng nói thành phụ đề (Whisper)... (Transcribing audio with Whisper)");
  execSync(`npx --yes hyperframes@0.6.76 transcribe "${finalWav}" --model base --language ${lang}`);
  
  // Verify transcript.json exists
  const transcriptJsonPath = path.join(process.cwd(), "transcript.json");
  if (!fs.existsSync(transcriptJsonPath)) {
    throw new Error("Whisper transcription failed, transcript.json was not created.");
  }
  
  // 4. Load transcript.json, clean it, and write to transcript.js
  const rawTranscript = JSON.parse(fs.readFileSync(transcriptJsonPath, "utf8"));
  const cleaned = cleanTranscript(rawTranscript);
  fs.writeFileSync(
    path.join(process.cwd(), "transcript.js"),
    `window.__transcript = ${JSON.stringify(cleaned, null, 2)};`
  );
  
  // 5. Calculate timings dynamically by matching the voiceover beats with transcript words
  logCallback("⏱️ Đang đồng bộ thời gian phân cảnh... (Calculating dynamic timing sync)");
  const totalAudioDuration = cleaned.length > 0 ? cleaned[cleaned.length - 1].end : 15.0;
  
  // Split the beat voiceovers into arrays of words
  const beat1Words = storyboard.beat1_vo.split(/\s+/).filter(Boolean);
  const beat2Words = storyboard.beat2_vo.split(/\s+/).filter(Boolean);
  const beat3Words = storyboard.beat3_vo.split(/\s+/).filter(Boolean);
  const beat4Words = storyboard.beat4_vo.split(/\s+/).filter(Boolean);
  
  // Initialize splits
  let t1 = totalAudioDuration * 0.25;
  let t2 = totalAudioDuration * 0.50;
  let t3 = totalAudioDuration * 0.75;
  
  // Try precise word alignment
  if (cleaned.length > 0) {
    // Search for last word of Beat 1
    const lastWordBeat1 = beat1Words[beat1Words.length - 1];
    const idx1 = findWordIndex(cleaned, lastWordBeat1, 0);
    if (idx1 !== -1) {
      t1 = cleaned[idx1].end;
      
      // Search for last word of Beat 2 starting from idx1
      const lastWordBeat2 = beat2Words[beat2Words.length - 1];
      const idx2 = findWordIndex(cleaned, lastWordBeat2, idx1 + 1);
      if (idx2 !== -1) {
        t2 = cleaned[idx2].end;
        
        // Search for last word of Beat 3 starting from idx2
        const lastWordBeat3 = beat3Words[beat3Words.length - 1];
        const idx3 = findWordIndex(cleaned, lastWordBeat3, idx2 + 1);
        if (idx3 !== -1) {
          t3 = cleaned[idx3].end;
        }
      }
    }
  }
  
  // Structure timings (overlap scenes by 0.4s to allow transitions)
  const overlap = 0.4;
  const s1_duration = t1 + overlap;
  const s2_start = t1;
  const s2_duration = (t2 - t1) + overlap;
  const s3_start = t2;
  const s3_duration = (t3 - t2) + overlap;
  const s4_start = t3;
  const s4_duration = (totalAudioDuration - t3) + 0.5; // add buffer for fade to black
  const totalDuration = totalAudioDuration + 0.5;
  
  const timings = {
    totalDuration,
    scene1: { start: 0, duration: s1_duration },
    scene2: { start: s2_start, duration: s2_duration },
    scene3: { start: s3_start, duration: s3_duration },
    scene4: { start: s4_start, duration: s4_duration },
    transitions: {
      t1,
      t2,
      t3
    }
  };
  
  fs.writeFileSync(
    path.join(process.cwd(), "timings.js"),
    `window.__timings = ${JSON.stringify(timings, null, 2)};`
  );
  
  // 6. Write layout variables to variables.js
  const variables = {
    beat1: storyboard.beat1,
    beat2: storyboard.beat2,
    beat3: storyboard.beat3,
    beat4: storyboard.beat4
  };
  
  fs.writeFileSync(
    path.join(process.cwd(), "variables.js"),
    `window.__variables = ${JSON.stringify(variables, null, 2)};`
  );
  
  // 7. Render video to MP4 using npm run render (hyperframes render)
  logCallback("🎬 Đang dựng video MP4 (Rendering)... (This may take a minute)");
  
  const renderDir = path.join(process.cwd(), "renders");
  if (!fs.existsSync(renderDir)) fs.mkdirSync(renderDir);
  
  const outputFileName = `video_${Date.now()}.mp4`;
  const outputPath = path.join(renderDir, outputFileName);
  
  return new Promise((resolve, reject) => {
    // Run hyperframes render
    const child = spawn("npx", [
      "--yes", "hyperframes@0.6.76", "render",
      "--output", outputPath,
      "--quality", "standard"
    ], { shell: true });
    
    child.stdout.on("data", (data) => {
      const line = data.toString().trim();
      if (line.includes("Frame") || line.includes("Render")) {
        // Feed render progress into callback
        logCallback(`🎬 [Render]: ${line}`);
      }
    });
    
    child.stderr.on("data", (data) => {
      console.error(data.toString());
    });
    
    child.on("close", (code) => {
      if (code === 0) {
        logCallback("🎉 Kết xuất video thành công! (Render complete)");
        resolve(outputPath);
      } else {
        reject(new Error(`HyperFrames render exited with code ${code}`));
      }
    });
  });
}

// Standalone execution wrapper
if (process.argv[1] && process.argv[1].endsWith("generate-video.js")) {
  const prompt = process.argv[2] || "Hãy bảo mật email của bạn định kỳ, quét thông tin rò rỉ tại check.security.vn";
  generateVideo(prompt)
    .then(p => console.log(`SUCCESS: Video saved to ${p}`))
    .catch(err => console.error("FAILED:", err));
}
