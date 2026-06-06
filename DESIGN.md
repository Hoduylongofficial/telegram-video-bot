# Brand Identity: Cyber-Exposure Shield

Visual design rules derived from the capture of `https://scan.promosaver.net/`.

## 1. Visual Theme
Cyber-Exposure Shield uses a dark-premium, high-security visual language. The interface is dominated by deep obsidian slate backgrounds (`#030712` and `#020617`) paired with crisp white text (`#F1F5F9`). The primary accent is a vibrant, alert-style pink-red (`#FF1D58` / `#EF4444`) representing security threat levels, counterbalanced by a digital forest green (`#00BC7D`) representing safe status. The mood is clinical, authoritative, and secure—recalling advanced cybersecurity dashboards.

## 2. Quick Reference

### Colors
- **Obsidian Dark** (`#030712`): Main page and scene background
- **Surface Dark** (`#0F172B`): Panels, cards, and modal backdrops
- **Highlight White** (`#F1F5F9`): Main headers and high-emphasis typography
  - On Obsidian/Surface: 18.5:1 ✅
- **Cool Slate** (`#90A1B9`): Body copy and secondary labels
  - On Obsidian: 7.2:1 ✅ — On Surface Dark: 5.6:1 ✅
- **Threat Red** (`#FF1D58` / `#EF4444`): Threat indicators, alert text, and primary glow shadow
  - On Obsidian: 4.8:1 ✅ — On Surface Dark: 3.8:1 ⚠ Use only for large text (24px+) or decorative highlights
- **Shield Green** (`#00BC7D`): Safe status indicators, verification highlights
  - On Obsidian: 6.4:1 ✅ — On Surface Dark: 5.1:1 ✅

### Fonts
- **Display/Headlines:** `sans-serif` (emulating *Space Grotesk*)
- **Body/Paragraphs:** `sans-serif` (emulating *Inter*)
- **Code/Data Readouts:** `monospace` (emulating *JetBrains Mono*)
- **Fallback Stack:** `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

---

## 3. Component Stylings

### Primary Button (Scanner CTA)
- **Background:** `#000000`
- **Text Color:** `#EF4444`
- **Font:** `sans-serif` 12px / 900 / Uppercase
- **Padding:** `16px 24px`
- **Border Radius:** `16px`
- **Border:** `none`
- **Height:** `50px`
- **Box Shadow:** `rgba(239, 68, 68, 0.25) 0px 0px 15px 0px` (Red Threat Glow)

### Status Badge / Test Scenario Button
- **Background:** `#0F172B`
- **Text Color:** `#90A1B9`
- **Border:** `1px solid #1D293D`
- **Border Radius:** `6px`
- **Padding:** `0px 10px`
- **Font:** `monospace` 10px / 400
- **Height:** `17px`

---

## 4. Spacing & Layout
- **Base Unit:** `8px`
- **Border Radius:** `6px` (badges), `16px` (buttons/cards)
- **Whitespace Philosophy:** Sparse, structured, aligned to a central grid. Elements are separated by generous gaps (`24px` to `48px`) to maintain readability.

---

## 5. Iteration Guide
1. **Always use threat-glow shadows for CTAs**: The scan CTA must use the red-pink shadow (`rgba(239,68,68,0.25) 0px 0px 15px`) to command immediate attention.
2. **Technical data in monospace**: Hashing algorithms, record counts (e.g. `14.8B`), and status indicators must use `monospace` to evoke cybersecurity terminal aesthetics.
3. **Contrast constraint**: Red accent text on dark panels must remain above 24px (large text) to satisfy WCAG AA readability. For smaller labels, use Cool Slate or Shield Green instead.
4. **Minimal color usage**: The scene backgrounds must remain a solid `#030712` (no complex visual gradients) to allow the neon red and green accents to pop clearly.
5. **No rounded corners on structural divs**: Layout panels should use sharp or minimal (`6px`) corners to maintain a rigid, technical structure.
