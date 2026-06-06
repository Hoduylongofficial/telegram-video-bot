# Storyboard: Cyber-Exposure Shield Promo

## Concept
- **Message:** Check if your email/password is leaked on the dark web privately and securely without your data leaving your machine (zero logs).
- **Arc:** Problem → Solution.
  - *Problem:* Email credentials are leaked daily; is yours safe?
  - *Solution:* Check instantly via client-side local SHA-256 hashing.
  - *CTA:* Scan for free at `scan.promosaver.net`.
- **Audience:** Tech-security conscious users, developers, SaaS users on TikTok, YouTube Shorts, and Instagram Reels.
- **Brand voice:** Clinical, urgent, professional, secure.
- **Why this matters now:** Promoting the Cyber-Exposure Shield mini SaaS tool.

**Pacing: Fast** — 4 beats, stacked divs, hard cuts and blur transitions, total duration 15 seconds.

---

## Global Direction
- **Format:** 1080×1920 (Portrait / Vertical Shorts)
- **Audio:** Kokoro TTS Voiceover (`af_nova`) + underscore + SFX
- **VO direction:** Calm, authoritative female voice (`af_nova`). Quick, punchy delivery. Urgency without panic.
- **Style basis:** DESIGN.md (Obsidian backgrounds, Surface panels, Threat Red and Shield Green accents)
- **Underscore:** Low, tense sub-bass pulse with a digital synthesizer drone underneath. Resolves on a clean, solid bass drop at the end.
- **Narration start:** 0.3s (slightly offset from visual open)

---

## Asset Audit
We have audited the captured SVG folder. All 10 Lucide icons have been evaluated for relevance:

| Asset | Type | Where (beat #) | Role / Status |
| --- | --- | --- | --- |
| `svgs/lucide-octagon-alert.svg` | SVG | Beat 1 | **USE:** Visual representation of threat/alert at visual hook. |
| `svgs/lucide-fingerprint.svg` | SVG | Beat 2 | **USE:** Placed as visual background anchor for database scan. |
| `svgs/lucide-key-round.svg` | SVG | Beat 3 | **USE:** Placed as visual anchor for cryptographic hash generation. |
| `svgs/lucide-lock.svg` | SVG | Beat 3 | **USE:** Safety lock showing client-side data vault. |
| `svgs/lucide-shield-check.svg` | SVG | Beat 4 | **USE:** Secure shield showing safe status. |
| `svgs/lucide-arrow-right.svg` | SVG | Beat 4 | **USE:** Placed inside the CTA button text. |
| `svgs/lucide-search.svg` | SVG | SKIP | We will compose a real search box/input UI using HTML/CSS. |
| `svgs/lucide-eye-off.svg` | SVG | SKIP | Decorative icon, not needed for this brief flow. |
| `svgs/lucide-activity.svg` | SVG | SKIP | Decorative icon, not needed for this brief flow. |

---

## Per-Beat Specification

### BEAT 1 — THE HOOK (0.0s – 3.5s)
- **Concept:** Open with an alarming question to hook scrollers immediately.
- **VO cue:** "Is your email password already in hacker hands?"
- **Visual description:**
  - *Shot type:* Extreme Close-up.
  - *Camera move:* Slow dolly-in (scale 1.0 -> 1.08).
  - *Depth strategy:* Foreground text, midground alert icon, background obsidian dark canvas with a soft threat-red ambient glow.
  - *Motion magnitudes:* Large y-axis entrances (+40px), opacity sweeps.
  - *Shot purpose:* Hook the viewer's attention within the first 1.5 seconds.
- **Composition + Accents:**
  - *Composed:* Composed main title "IS YOUR PASSWORD EXPOSED?" split into three rows. Background obsidian `#030712` with threat-red glow (`#FF1D58`).
  - *Accents:* `capture/assets/svgs/lucide-octagon-alert.svg` (positioned top center, 120x120px, colored `#FF1D58`, pulsing scale 1.0 <-> 1.1 every 1.5s).
- **Text Animations:**
  - Headline text: Staggered words pop with `back.out(1.5)` overshoot, colored `#F1F5F9`. The word "EXPOSED?" highlighted in Threat Red (`#FF1D58`).
- **Beat Timing:**
  - Transition in: 0.0s
  - GSAP duration: 3.5s
- **Animation Sequence:**
  - `0.0s`: Soft ambient track starts playing.
  - `0.2s`: Alert icon slides down (y: -50 -> 0, opacity 0 -> 1, duration 0.6s, `power3.out`).
  - `0.5s`: Word 1 "IS" enters (y: 30 -> 0, opacity 0 -> 1, 0.4s).
  - `0.7s`: Word 2 "YOUR" enters (y: 30 -> 0, opacity 0 -> 1, 0.4s).
  - `0.9s`: Word 3 "PASSWORD" enters (y: 30 -> 0, opacity 0 -> 1, 0.4s).
  - `1.1s`: Word 4 "EXPOSED?" enters (scale: 0.8 -> 1.0, opacity 0 -> 1, 0.6s, `back.out(2.0)`).
  - `1.5s - 3.5s`: Slow dolly-in scale on container, alert icon continues breathing.
  - `3.3s`: Quick fade out of Beat 1 elements.
- **SFX:** `glitch-1.mp3` at `0.0s`, volume `0.5` (alarm/glitch hook).

---

### BEAT 2 — THE PROBLEM (3.5s – 6.8s)
- **Concept:** Establish the scale of the threat using the massive database number (14.8 Billion).
- **VO cue:** "Millions of credentials are sold daily on the dark web."
- **Visual description:**
  - *Shot type:* Close-up.
  - *Camera move:* Steady vertical scroll/pan mimicking a terminal readout.
  - *Depth strategy:* Monospace credentials scroll in background, large stat counter "14.8B" in foreground.
  - *Motion magnitudes:* Fast scrolling, numeric count-up.
  - *Shot purpose:* Show the massive volume of data leaks.
- **Composition + Accents:**
  - *Composed:* Composed terminal UI panel (`#0F172B`) with rounded corners (`6px`). A list of mock obfuscated emails (e.g. `s.jenk***@outlook.com`) scrolling upwards. Large counter reading `14.8B` at the bottom.
  - *Accents:* `capture/assets/svgs/lucide-fingerprint.svg` in background (opacity 0.05, 300x300px, colored `#90A1B9`, slowly rotating).
- **Text Animations:**
  - Stat "14.8B": Numerical count-up from 0.0 to 14.8 in large bold monospace letters, colored `#F1F5F9`.
- **Beat Timing:**
  - Transition in: 3.5s (Hard Cut)
  - GSAP duration: 3.3s
- **Animation Sequence:**
  - `3.5s`: Terminal container slides in from right (x: 200 -> 0, opacity 0 -> 1, 0.5s, `power2.out`).
  - `3.8s`: Mock emails begin auto-scrolling upwards.
  - `3.9s`: Stat "14.8B" and label "Compromised Indexes Loaded" scale up (0.6s, `back.out(1.2)`).
  - `4.0s - 5.5s`: Numeric count-up from `0.0B` to `14.8B` (using `gsap.to` with snap to decimals).
  - `5.5s - 6.8s`: Scroll slows down, background fingerprint rotates.
- **SFX:** `typing.mp3` at `3.8s` (duration 1.5s, volume `0.3`) as terminal scrolls.

---

### BEAT 3 — THE SOLUTION (6.8s – 11.5s)
- **Concept:** Explain how client-side hashing solves the leak check problem without risking privacy.
- **VO cue:** "Scan privately. Client-side hashing ensures your email never leaves your device."
- **Visual description:**
  - *Shot type:* Medium Shot.
  - *Camera move:* Dolly out (scale 1.1 -> 1.0).
  - *Depth strategy:* Central search box in midground, secure lock/key graphics in foreground, green safe glow in background.
  - *Motion magnitudes:* Zoom out, element sliding.
  - *Shot purpose:* Illustrate security, cryptography, and safety.
- **Composition + Accents:**
  - *Composed:* Composed cryptographic search dashboard. A search field typing a mock email, then generating a SHA-256 hash overlay (e.g., `5e883f...`). Panel changes status to a green verified state.
  - *Accents:* `capture/assets/svgs/lucide-lock.svg` (center, colored `#00BC7D`, slides in). `capture/assets/svgs/lucide-key-round.svg` (colored `#90A1B9`, fades).
- **Text Animations:**
  - Tech badges: "SHA-256 Client-Side" and "Zero-Logs Policy" fade in.
- **Beat Timing:**
  - Transition in: 6.8s (Blur Crossfade, duration 0.5s)
  - GSAP duration: 4.7s
- **Animation Sequence:**
  - `6.8s`: Blur transition reveals Beat 3. Secure lock slides up (y: 60 -> 0, 0.6s, `power3.out`).
  - `7.3s`: Search box input field typed character by character: `demo@corporatelink.net`.
  - `8.2s`: Key icon appears. Email string fades into a hex hash string (`5e883f98...`) to show local encryption.
  - `8.8s`: Status text "ZERO LOGS POLICY" snaps in (scale: 0.8 -> 1.0, opacity 0 -> 1, 0.5s, `back.out(1.5)`).
  - `9.2s - 11.5s`: Camera dollies out slowly. Green ambient glow pulses.
- **SFX:** `key-press.mp3` at `7.3s` (typing simulation, volume `0.4`). `pop.mp3` at `8.2s` (hash lock activation, volume `0.3`).

---

### BEAT 4 — THE CTA (11.5s – 15.0s)
- **Concept:** Draw the brand shield and prompt users to scan their own email for free.
- **VO cue:** "Protect your privacy now. Scan for free at scan dot promosaver dot net."
- **Visual description:**
  - *Shot type:* Medium/Wide Shot.
  - *Camera move:* Dolly-in (scale 1.0 -> 1.05).
  - *Depth strategy:* Massive secure shield icon in center, CTA button below it, typography at the top.
  - *Motion magnitudes:* Scale bounce, button drop.
  - *Shot purpose:* Drive immediate action to the SaaS URL.
- **Composition + Accents:**
  - *Composed:* Logo header "CYBER-EXPOSURE SHIELD". Glowing CTA button: "SCAN MY EMAIL FOR LEAKS (FREE)" with a threat-red glow. URL: "scan.promosaver.net" in large monospace text.
  - *Accents:* `capture/assets/svgs/lucide-shield-check.svg` (large center, 180x180px, colored `#00BC7D`, with green drop shadow). `capture/assets/svgs/lucide-arrow-right.svg` (embedded in button text).
- **Text Animations:**
  - Button & URL slide in from bottom.
- **Beat Timing:**
  - Transition in: 11.5s (Slight zoom and green glow transition)
  - GSAP duration: 3.5s
- **Animation Sequence:**
  - `11.5s`: Shield Check icon scales up with heavy bounce (scale: 0 -> 1, 0.7s, `back.out(2.2)`).
  - `12.0s`: Header text "CYBER-EXPOSURE SHIELD" fades in (y: -20 -> 0, 0.5s).
  - `12.3s`: CTA button slides up (y: 50 -> 0, opacity 0 -> 1, 0.6s, `power3.out`). Red-pink glow activates.
  - `12.6s`: URL text "scan.promosaver.net" types out in monospace font (0.5s).
  - `13.0s - 14.3s`: Main elements drift slowly; green and red back-glows pulse.
  - `14.3s`: Entire composition fades to black (opacity -> 0, duration 0.7s) to close the video.
- **SFX:** `chime.mp3` at `11.5s`, volume `0.4` (success/shield chime). `whoosh-short.mp3` at `12.3s`, volume `0.3` (button entry).

---

## Brand Accents Pass

| Asset | Type | Where (beat #) | Role |
| --- | --- | --- | --- |
| `svgs/lucide-octagon-alert.svg` | SVG | Beat 1 | Primary visual warning |
| `svgs/lucide-fingerprint.svg` | SVG | Beat 2 | Background watermark |
| `svgs/lucide-key-round.svg` | SVG | Beat 3 | Encryption animation anchor |
| `svgs/lucide-lock.svg` | SVG | Beat 3 | Core security indicator |
| `svgs/lucide-shield-check.svg` | SVG | Beat 4 | Brand check/safe emblem |
| `svgs/lucide-arrow-right.svg` | SVG | Beat 4 | CTA button accent arrow |

---

## Production Architecture
```
project/
├── index.html
├── DESIGN.md
├── SCRIPT.md
├── STORYBOARD.md
├── transcript.json
├── narration.wav
├── capture/
│   ├── svgs/
│   │   ├── lucide-octagon-alert.svg
│   │   ├── lucide-fingerprint.svg
│   │   ├── lucide-key-round.svg
│   │   ├── lucide-lock.svg
│   │   ├── lucide-shield-check.svg
│   │   └── lucide-arrow-right.svg
│   └── extracted/
│       ├── tokens.json
│       └── design-styles.json
└── compositions/
    ├── beat-1-hook.html
    ├── beat-2-problem.html
    ├── beat-3-solution.html
    ├── beat-4-cta.html
    └── captions.html
```
