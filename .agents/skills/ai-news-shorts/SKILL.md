---
name: ai-news-shorts
description: Create fast-paced English AI news Shorts with dynamic captions, zooming B-roll, and synchronized tech audio using HyperFrames.
---

# Creating Fast-Paced English AI News Shorts

This skill defines the blueprint, structural rules, animation parameters, and workflow for producing high-engagement, fast-paced English AI news Shorts (similar to the "AI NEWS - AI Daily News" channel style) using HyperFrames.

---

## 1. Pacing & Timing Rules

For English fast-paced Shorts, speech and cuts must be tightly synchronized.

### Script & Speech Rate
* **Duration:** 50 to 58 seconds max (to fit under the 60-second Shorts limit).
* **Word Count:** 140 to 165 English words.
* **Speech Rate:** 150 - 170 words per minute (WPM). This is achieved by generating English Text-to-Speech (TTS) and applying a speed factor of `1.1x` or `1.15x`.
* **Cuts Frequency:** Every **1.5 to 2.5 seconds**. Static visuals must never stay longer than 3 seconds without a zoom, pan, or cut.

### Narrative Arc
1. **Hook (0.0s - 4.5s):** Start with an active, high-impact English hook. No introductions like "Hey guys" or "Welcome back". Go straight to the point.
   * *Example:* "OpenAI just upgraded Codex, allowing AI to take full control of your Mac screen, keyboard, and mouse!"
2. **Problem/Context (4.5s - 15.0s):** Establish the background.
3. **Core Features (15.0s - 50.0s):** Showcase 2 to 3 main points with screenshots, terminal captures, or demo clips.
4. **Call to Action (50.0s - 58.0s):** End with a conversational question to boost comments.
   * *Example:* "Would you trust an AI with your screen? Let me know in the comments and subscribe for daily AI news!"

---

## 2. Layout & Typography Rules (9:16)

Compositions must use a strictly vertical, high-contrast, tech-themed design system.

### Color Palette
* **Background:** Deep dark grey (`#0F0F12`) or dark navy blue (`#0A0A0F`).
* **Secondary Elements / Cards:** Glassmorphic translucent cards (`rgba(255, 255, 255, 0.05)`) with a subtle blur (`backdrop-filter: blur(16px)`).
* **Standard Text:** Crisp white (`#FFFFFF`) or off-white (`#E5E5E5`).
* **Active Highlight Text:** Cyber Yellow (`#FFE500`) or Cyber Cyan (`#00F3FF`).
* **Warning Highlight Text:** Vivid Red-Orange (`#FF4D00`).

### Typography Spec
* **Font-Family:** Modern, high-weight sans-serif (e.g., `Outfit`, `Montserrat`, `Lexend Deca`, or `Inter`). Use Google Fonts.
* **Size:** Title hook text: `60px` to `72px` (bold/black). Body captions: `48px` to `56px` (bold).
* **Placement:** Captions must be placed vertically at `top: 70%` to `top: 75%` to prevent overlaps with YouTube UI (likes, comments, description box).

---

## 3. Dynamic Caption Animation Spec

To replicate the word-by-word pop-up caption highlight, follow this structure:

### HTML Structure
Group captions into short phrases (3-5 words). Use `span` tags with sub-second timestamps.
```html
<div class="captions-container">
  <!-- Slide 1: 0.0s - 2.5s -->
  <div class="caption-phrase clip" data-start="0.0" data-duration="2.5">
    <span class="word" data-wstart="0.0" data-wdur="0.4">OpenAI</span>
    <span class="word" data-wstart="0.4" data-wdur="0.3">just</span>
    <span class="word highlight" data-wstart="0.7" data-wdur="0.5">upgraded</span>
    <span class="word" data-wstart="1.2" data-wdur="0.4">their</span>
    <span class="word highlight" data-wstart="1.6" data-wdur="0.9">Codex!</span>
  </div>
</div>
```

### CSS Styling & Highlight Logic
Use a GSAP script or CSS custom properties to transition the active word.
```css
.captions-container {
  position: absolute;
  top: 72%;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  text-align: center;
  font-family: 'Outfit', sans-serif;
  font-size: 52px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -1px;
}

.caption-phrase {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.word {
  color: rgba(255, 255, 255, 0.4); /* Dim inactive words */
  transition: color 0.15s ease, transform 0.15s ease;
  transform: scale(0.95);
  display: inline-block;
}

/* Active Highlight state managed via GSAP */
.word.active {
  color: #FFE500; /* Yellow highlight */
  transform: scale(1.1);
  text-shadow: 0 0 15px rgba(255, 229, 0, 0.4);
}
```

### GSAP Synchronization Script
Register a timeline on `window.__timelines` that targets word elements based on their `data-wstart` and `data-wdur`.
```javascript
const tl = gsap.timeline({ paused: true });
window.__timelines = window.__timelines || {};
window.__timelines["news-shorts"] = tl;

// Highlight active words
document.querySelectorAll('.word').forEach(word => {
  const start = parseFloat(word.dataset.wstart);
  const duration = parseFloat(word.dataset.wdur);
  
  tl.to(word, {
    color: word.classList.contains('highlight') ? '#FFE500' : '#FFFFFF',
    scale: 1.1,
    textShadow: word.classList.contains('highlight') ? '0 0 15px rgba(255, 229, 0, 0.4)' : '0 0 10px rgba(255, 255, 255, 0.3)',
    duration: 0.1,
    ease: "power2.out"
  }, start)
  .to(word, {
    color: 'rgba(255, 255, 255, 0.4)',
    scale: 0.95,
    textShadow: 'none',
    duration: 0.1,
    ease: "power2.in"
  }, start + duration);
});
```

---

## 4. Visual B-Roll & Screen Recording Animations

Static screen captures (screenshots of code, charts, GitHub stars) must zoom or slide to simulate camera pans.

### Focal Zoom
When highlighting a detail (e.g. RAG benchmark chart showing `90%`), zoom into that specific region:
```javascript
// Scale and shift B-roll to focus on a particular coordinate
tl.fromTo("#broll-chart", 
  { scale: 1.0, x: 0, y: 0 },
  { scale: 1.6, x: -150, y: 50, duration: 1.5, ease: "power2.inOut" },
  "18.5" // Timeline start time (seconds)
);
```

### Ken Burns Loop
Apply a slow, continuous scale on B-roll backgrounds:
```css
.broll-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: kenBurns 60s linear infinite;
}

@keyframes kenBurns {
  0% { transform: scale(1.0); }
  50% { transform: scale(1.15) translate(-10px, -5px); }
  100% { transform: scale(1.0); }
}
```

---

## 5. Audio Mixing Spec

All assets must balance voiceover clarity with background music energy.

```html
<!-- Audio components configuration -->
<audio id="tts-voiceover" src="assets/vo_en.mp3" data-start="0" data-duration="55" volume="1.0"></audio>
<audio id="tech-beat" src="assets/music_loop.mp3" data-start="0" data-duration="55" volume="0.15" loop></audio>

<!-- SFX Injections -->
<audio id="sfx-whoosh-1" src="assets/sfx/whoosh.mp3" data-start="4.5" data-duration="0.5" volume="0.4"></audio>
<audio id="sfx-click-1" src="assets/sfx/mouse_click.mp3" data-start="12.3" data-duration="0.2" volume="0.5"></audio>
<audio id="sfx-pop-1" src="assets/sfx/pop.mp3" data-start="35.8" data-duration="0.3" volume="0.6"></audio>
```

---

## 6. End-to-End Creation Workflow

Follow these steps to generate a video using this skill:

1. **Write the Script (English):**
   * Keep it between 140 and 160 words.
   * Divide the text into 3-word to 5-word phrases.
2. **Generate and Preprocess Audio:**
   * Run TTS: `npx hyperframes tts --text "..." --voice "en-US-Neural" --speed 1.1`
   * Transcribe to get word-level timestamps: `npx hyperframes transcribe --audio assets/vo_en.mp3 --output transcript.json`
3. **Assemble HTML & CSS:**
   * Create `index.html` referencing the layout rules.
   * Parse `transcript.json` to generate the `.caption-phrase` structure with `data-wstart` and `data-wdur`.
4. **Wire B-Roll:**
   * Place screenshot/video clips inside the center zone card container.
   * Match the GSAP timeline triggers with the timestamps of key topics in the script.
5. **Verify:**
   * Run `npm run check` to validate composition integrity.
   * Run `npm run dev` to preview in browser.
6. **Render:**
   * Run `npm run render` to export `output.mp4`.
