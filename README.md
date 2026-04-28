# Major_Project_CBIT

This repository contains the Major Project materials for CBIT, along with a special interactive anniversary proposal website.

---

## 🎓 Project Files

| File | Description |
|------|-------------|
| `MajorProject.ipynb` | Main Jupyter Notebook for the major project |
| `*.pdf` | Research papers and reference materials |

---

## 💜 Anniversary Proposal Website

An interactive, minimalistic, single-page anniversary proposal website built with plain HTML, CSS, and JavaScript — no frameworks or external dependencies required.

### Features

- **Live countdown** to 31 May 2026 (updates every 250 ms using the visitor's local time)
- **Smooth transitions** and animated card entries
- **Interactive timeline** — tap tiles to reveal sparks
- **Memory polaroids** — click to reveal hidden compliments
- **Playful "Not yet" button** that dodges the cursor/touch
- **Confetti celebration** on "Yes"
- **Optional sound effects** (Web Audio API, no external assets)
- **Mobile-friendly** responsive layout

### Files

```
docs/
├── index.html   — page structure
├── styles.css   — minimalistic dark-theme styles
└── script.js    — all interactivity, countdown, confetti
```

---

## 🖥️ Run Locally

No build step needed. Just open the file in a browser:

```bash
# Option 1 — open directly
open docs/index.html

# Option 2 — serve with Python (avoids any local-file quirks)
cd docs
python3 -m http.server 8080
# then visit http://localhost:8080
```

---

## 🚀 Enable GitHub Pages

1. Go to your repository on GitHub.
2. Click **Settings** → **Pages** (in the left sidebar).
3. Under **"Build and deployment"** → **"Source"**, choose **Deploy from a branch**.
4. Set the branch to `main` (or `master`) and the folder to `/docs`.
5. Click **Save**.

GitHub will build and publish the site within a minute. The URL will be:

```
https://<your-username>.github.io/<repo-name>/
```

For this repo:

```
https://GanneshReddy.github.io/Major_Project_CBIT/
```

> **Note:** GitHub Pages serves the `/docs` folder automatically when you select it as the source. No extra configuration file is needed.

---

## ✏️ Personalisation

All personalisation lives in the `CONFIG` object at the top of `docs/script.js`:

```js
const CONFIG = {
  herName: "Potti",
  yourName: "Gannu",
  anniversaryLabel: "Last college days anniversary.",
  startDate: "2023-05-31",
  countdownTarget: "2026-05-31T00:00:00",
  // ... timeline, polaroids, finalQuestion, etc.
};
```

Edit those values and push — the live site updates automatically.
