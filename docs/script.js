/* -----------------------------------------------------------------------
   Anniversary Proposal Site — script.js
   Personalization: Potti + Gannu | 2023-05-31 → 2026-05-31
----------------------------------------------------------------------- */

// ── CONFIG ──────────────────────────────────────────────────────────────
const CONFIG = {
  herName: "Potti",
  yourName: "Gannu",
  anniversaryLabel: "Last college days anniversary.",
  startDate: "2023-05-31",              // relationship start (days-together calc)
  countdownTarget: "2026-05-31T00:00:00", // local-time countdown target

  timeline: [
    {
      title: "31 May 2023",
      text: "The day everything started. A moment I'll never forget — because it made all the others possible."
    },
    {
      title: "The first inside joke",
      text: "Proof that we speak a language that only we understand."
    },
    {
      title: "The moment I knew",
      text: "I didn't want a 'someday'. I wanted our days."
    },
    {
      title: "The last college chapter",
      text: "A chapter ending — but the best story is just beginning."
    }
  ],

  polaroids: [
    { caption: "That smile I keep choosing.", rot: -2.2 },
    { caption: "Our kind of chaos.", rot: 1.8 },
    { caption: "The calm after every day.", rot: -1.2 }
  ],

  compliments: [
    "You make the world feel less loud.",
    "Your laugh is my favourite sound.",
    "I'm proud of you — always."
  ],

  finalQuestion:
    "Will you laugh with me, be my best friend, hold my hand, kiss me, and be with me forever?",

  yesText: "Yes!",
  noText: "Not yet",
  signature: "— with love, always"
};
// ────────────────────────────────────────────────────────────────────────

const $ = (s) => document.querySelector(s);

// ── App state ──────────────────────────────────────────────────────────
const state = {
  step: 0,
  sound: false,
  noDodges: 0,
  revealedPolaroids: new Set(),
  countdownTimer: null
};

const STEPS = [
  renderIntro,
  renderTimeline,
  renderMemories,
  renderQuestion,
  renderYes
];

// ── Helpers ─────────────────────────────────────────────────────────────
function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function daysTogetherSince(dateStr) {
  const start = new Date(dateStr + "T00:00:00");
  const diff = Date.now() - start.getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

function setHint(text) {
  $("#hint").textContent = text || "";
}

function setDots() {
  const host = $("#dots");
  host.innerHTML = "";
  for (let i = 0; i < STEPS.length; i++) {
    const d = document.createElement("div");
    d.className = "dot" + (i === state.step ? " on" : "");
    d.setAttribute("aria-label", i === state.step ? "current step" : `step ${i + 1}`);
    host.appendChild(d);
  }
}

function toast(msg, duration = 1400) {
  const stage = $("#stage");
  // Remove any existing toast to avoid stacking
  const old = stage.querySelector(".toast");
  if (old) old.remove();

  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  stage.appendChild(t);
  setTimeout(() => t.remove(), duration);
}

function go(step) {
  // Clear any running countdown timer when leaving intro
  if (state.countdownTimer) {
    clearTimeout(state.countdownTimer);
    state.countdownTimer = null;
  }

  state.step = Math.max(0, Math.min(STEPS.length - 1, step));
  setDots();
  STEPS[state.step]();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function next() { go(state.step + 1); }
function back() { go(state.step - 1); }

// ── Base frame builder ───────────────────────────────────────────────────
function baseFrame({ pill, headline, lead, left, right, actions }) {
  const stage = $("#stage");
  stage.innerHTML = `
    <div class="row">
      <div class="col">
        ${pill ? `<div class="pill">${pill}</div>` : ""}
        ${headline ? `<div class="big">${headline}</div>` : ""}
        ${lead ? `<p class="lead">${lead}</p>` : ""}
        ${left ?? ""}
        ${actions ?? ""}
      </div>
      <div class="col">
        ${right ?? ""}
      </div>
    </div>
  `;
  // Re-trigger fade animation
  stage.style.animation = "none";
  // Force reflow
  void stage.offsetWidth;
  stage.style.animation = "";
}

// ── Countdown ────────────────────────────────────────────────────────────
function startCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;

  const target = new Date(CONFIG.countdownTarget);

  function tick() {
    const now = new Date();
    const ms = target - now;

    if (ms <= 0) {
      el.textContent = "It's today! 🎉";
      return;
    }

    const totalSec = Math.floor(ms / 1000);
    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;

    el.textContent =
      `${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;

    state.countdownTimer = setTimeout(tick, 1000);
  }

  tick();
}

// ── Typewriter for title ──────────────────────────────────────────────────
let typingToken = 0;
async function typeTitle(text) {
  const el = $("#title");
  const token = ++typingToken;
  el.textContent = "";
  for (let i = 0; i < text.length; i++) {
    if (token !== typingToken) return;
    el.textContent += text[i];
    await wait(20 + Math.random() * 18);
  }
}

// ── Step 0: Intro ─────────────────────────────────────────────────────────
function renderIntro() {
  setHint("Press Space to continue · Backspace to go back");
  const days = daysTogetherSince(CONFIG.startDate);

  baseFrame({
    pill: `Countdown: <span id="countdown">—</span>`,
    headline: `Hi ${CONFIG.herName}.`,
    lead: `I wanted to make something small, minimal, and alive — like the quiet ways you make my world better.`,
    left: `
      <div class="hr"></div>
      <div class="grid">
        <div class="tile">
          <h3>Day ${days} of us</h3>
          <p>Every single one has been worth it. Every messy, beautiful one.</p>
        </div>
        <div class="tile">
          <h3>A detail</h3>
          <p>Move slowly through this. It's here because of you.</p>
        </div>
      </div>
    `,
    right: `
      <div class="tile" style="min-height: 240px;">
        <h3>To begin</h3>
        <p class="lead">Put your hand on your heart for a second… and breathe.</p>
        <div class="hr"></div>
        <p class="lead">When you're ready, I'll show you something I've been meaning to say for a while.</p>
      </div>
    `,
    actions: `
      <div class="actions">
        <button class="btn primary" id="nextBtn" type="button">Let's go →</button>
      </div>
    `
  });

  $("#nextBtn").onclick = next;
  startCountdown();
}

// ── Step 1: Timeline ──────────────────────────────────────────────────────
function renderTimeline() {
  setHint("Tap a tile to reveal a little spark.");

  baseFrame({
    pill: "Our timeline",
    headline: "A few moments I keep replaying.",
    lead: "Minimal, but meaningful. Like us.",
    left: `
      <div class="grid" id="tl"></div>
      <div class="actions">
        <button class="btn" id="backBtn" type="button">← Back</button>
        <button class="btn primary" id="nextBtn" type="button">Next →</button>
      </div>
    `,
    right: `
      <div class="tile" style="min-height: 260px;">
        <h3>One truth</h3>
        <p class="lead">Every version of my future gets better when you're in it.</p>
        <div class="hr"></div>
        <p class="lead">And today, on our last college anniversary, I want to ask you something — but not yet.</p>
      </div>
    `
  });

  const tl = $("#tl");
  CONFIG.timeline.forEach((t, idx) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "tile";
    tile.innerHTML = `<h3>${t.title}</h3><p>${t.text}</p>`;
    tile.addEventListener("click", () => sparkle(idx));
    tl.appendChild(tile);
  });

  $("#backBtn").onclick = back;
  $("#nextBtn").onclick = next;
}

const SPARKS = [
  "You're my favourite notification.",
  "I like my life with you in it.",
  "You feel like home.",
  "This is me, choosing you — again.",
  "I'd do it all over.",
  "You're irreplaceable.",
  "Still my favourite person."
];

function sparkle(seed) {
  const msg = SPARKS[(seed + Math.floor(Math.random() * SPARKS.length)) % SPARKS.length];
  toast(msg);
  if (state.sound) beep(440 + seed * 45, 0.05);
}

// ── Step 2: Memories ──────────────────────────────────────────────────────
function renderMemories() {
  setHint("Click each frame to reveal a compliment.");
  state.revealedPolaroids.clear();

  baseFrame({
    pill: "Memories",
    headline: "Three little frames.",
    lead: "Not to prove anything. Just to remember.",
    left: `
      <div class="polaroids" id="polaroids"></div>
      <div class="actions">
        <button class="btn" id="backBtn" type="button">← Back</button>
        <button class="btn primary" id="nextBtn" type="button">Next →</button>
      </div>
    `,
    right: `
      <div class="tile" style="min-height: 260px;">
        <h3>Mini challenge</h3>
        <p class="lead">Click each frame once.</p>
        <div class="hr"></div>
        <p class="lead">I hid three tiny compliments. Because you deserve to hear them.</p>
      </div>
    `
  });

  const host = $("#polaroids");
  CONFIG.polaroids.forEach((p, i) => {
    const el = document.createElement("div");
    el.className = "polaroid";
    el.style.setProperty("--rot", `${p.rot ?? (i - 1)}deg`);
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", `Memory ${i + 1}`);
    el.innerHTML = `
      <div class="photo" aria-hidden="true">MEMORY ${i + 1}</div>
      <div class="caption" id="cap-${i}">${p.caption}</div>
    `;

    const reveal = () => {
      if (state.revealedPolaroids.has(i)) return;
      state.revealedPolaroids.add(i);
      const cap = $(`#cap-${i}`);
      cap.textContent = CONFIG.compliments[i % CONFIG.compliments.length];
      el.classList.add("revealed");
      toast("✨ " + CONFIG.compliments[i % CONFIG.compliments.length], 1800);
      if (state.sound) beep(520 + i * 35, 0.07);
    };

    el.addEventListener("click", reveal);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); reveal(); }
    });
    host.appendChild(el);
  });

  $("#backBtn").onclick = back;
  $("#nextBtn").onclick = next;
}

// ── Step 3: The Question ──────────────────────────────────────────────────
function renderQuestion() {
  setHint("One of these buttons is dramatic. Sorry in advance.");
  state.noDodges = 0;

  baseFrame({
    pill: "The question",
    headline: CONFIG.finalQuestion,
    lead: `${CONFIG.signature} — ${CONFIG.yourName}`,
    left: `
      <div class="tile" style="min-height: 200px;">
        <h3>Choose carefully</h3>
        <p class="lead">I made this interactive because you make my life interactive.</p>
        <div class="hr"></div>
        <div class="question-wrap" id="btnWrap">
          <button class="btn good" id="yesBtn" type="button">${CONFIG.yesText}</button>
          <button class="btn" id="noBtn" type="button"
            style="position:absolute; left:110px; top:0;">${CONFIG.noText}</button>
        </div>
      </div>
      <div class="actions">
        <button class="btn" id="backBtn" type="button">← Back</button>
      </div>
    `,
    right: `
      <div class="tile" style="min-height: 260px;">
        <h3>A note</h3>
        <p class="lead">This is minimal, but I'm not.</p>
        <div class="hr"></div>
        <p class="lead">I love you in big ways and small ways and "I brought you water" ways. In all the quiet, ordinary, beautiful ways.</p>
      </div>
    `
  });

  const noBtn = $("#noBtn");
  const yesBtn = $("#yesBtn");

  yesBtn.onclick = () => {
    if (state.sound) chord();
    celebrate();
    go(4);
  };

  const NO_LINES = [
    "hey—",
    "nice try 😄",
    "almost!",
    "not today",
    "pick the other one :)"
  ];

  const dodge = () => {
    state.noDodges++;
    const wrap = document.getElementById("btnWrap");
    if (!wrap) return;

    const pad = 8;
    const maxX = Math.max(pad, wrap.clientWidth - noBtn.offsetWidth - pad);
    const maxY = Math.max(pad, wrap.clientHeight - noBtn.offsetHeight - pad);
    const x = pad + Math.random() * maxX;
    const y = pad + Math.random() * maxY;

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;

    const line = NO_LINES[Math.min(NO_LINES.length - 1, Math.floor(state.noDodges / 2))];
    toast(line);
    if (state.sound) beep(200 + Math.random() * 120, 0.04);
  };

  noBtn.addEventListener("mouseenter", dodge);
  noBtn.addEventListener("touchend", (e) => { e.preventDefault(); dodge(); }, { passive: false });

  $("#backBtn").onclick = back;
}

// ── Step 4: Yes! Celebration ──────────────────────────────────────────────
function renderYes() {
  setHint("");

  baseFrame({
    pill: "✨ Unlocked",
    headline: "",
    lead: "",
    left: `
      <div class="celebrate-text">You said yes.</div>
      <p class="lead">I'm going to remember this moment forever.</p>
      <div class="hr"></div>
      <div class="tile">
        <h3>One last line</h3>
        <p class="lead">Happy last college days anniversary, ${CONFIG.herName}. Today, tomorrow, and every version of "always".</p>
      </div>
      <div class="actions">
        <button class="btn primary" id="againBtn" type="button">↺ Replay from start</button>
      </div>
    `,
    right: `
      <div class="tile" style="min-height: 260px;">
        <h3>Now do the real part</h3>
        <p class="lead">Put the phone down… look at her… and say it out loud. 💜</p>
        <div class="hr"></div>
        <p class="lead">(${CONFIG.signature} — ${CONFIG.yourName})</p>
      </div>
    `
  });

  $("#againBtn").onclick = () => {
    stopConfetti();
    go(0);
  };
}

// ── Keyboard nav ─────────────────────────────────────────────────────────
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && e.target.tagName !== "BUTTON") {
    e.preventDefault();
    next();
  }
  if (e.code === "Backspace" && e.target.tagName !== "INPUT") {
    e.preventDefault();
    back();
  }
});

// ── Sound toggle ──────────────────────────────────────────────────────────
function initSound() {
  const btn = $("#soundBtn");
  const stateEl = $("#soundState");
  btn.addEventListener("click", () => {
    state.sound = !state.sound;
    stateEl.textContent = state.sound ? "on" : "off";
    toast(state.sound ? "Sound on 🔔" : "Sound off 🔕");
    if (state.sound) beep(660, 0.06);
  });
}

// ── Tiny Web Audio synth (no external assets) ─────────────────────────────
let audioCtx = null;

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function beep(freq = 440, dur = 0.06) {
  try {
    ensureAudio();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    o.connect(g).connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + dur + 0.02);
  } catch (_) {
    // Silently ignore if audio isn't available
  }
}

function chord() {
  beep(523.25, 0.12);       // C5
  setTimeout(() => beep(659.25, 0.14), 50);   // E5
  setTimeout(() => beep(783.99, 0.18), 100);  // G5
  setTimeout(() => beep(1046.5, 0.22), 160);  // C6
}

// ── Confetti ──────────────────────────────────────────────────────────────
const confettiState = {
  on: false,
  pieces: [],
  raf: 0,
  resizeHandler: null
};

function celebrate() {
  startConfetti();
  setTimeout(stopConfetti, 5000);
}

function startConfetti() {
  const canvas = $("#confetti");
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.classList.add("on");
  confettiState.on = true;
  confettiState.pieces = Array.from({ length: 160 }, () => newPiece(canvas, dpr));

  confettiState.resizeHandler = () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
  };
  window.addEventListener("resize", confettiState.resizeHandler);

  const tick = () => {
    if (!confettiState.on) return;
    confettiState.raf = requestAnimationFrame(tick);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of confettiState.pieces) {
      p.vy += 0.025 * dpr;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;

      if (p.y > canvas.height + 40) {
        p.y = -40;
        p.x = Math.random() * canvas.width;
        p.vy = (1 + Math.random() * 2) * dpr;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
  };

  tick();
}

function stopConfetti() {
  confettiState.on = false;
  cancelAnimationFrame(confettiState.raf);
  if (confettiState.resizeHandler) {
    window.removeEventListener("resize", confettiState.resizeHandler);
    confettiState.resizeHandler = null;
  }
  const canvas = $("#confetti");
  canvas.classList.remove("on");
}

function newPiece(canvas, dpr) {
  const colors = ["#7c5cff", "#ff4fd8", "#35e4a1", "#ffffff", "#ffd700"];
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    vx: (-1.5 + Math.random() * 3) * dpr,
    vy: (1 + Math.random() * 2.5) * dpr,
    w: (5 + Math.random() * 7) * dpr,
    h: (9 + Math.random() * 11) * dpr,
    rot: Math.random() * Math.PI * 2,
    vr: (-0.08 + Math.random() * 0.16),
    color: colors[Math.floor(Math.random() * colors.length)]
  };
}

// ── Header init ───────────────────────────────────────────────────────────
function initHeader() {
  $("#kicker").textContent = CONFIG.anniversaryLabel;
  typeTitle(`For ${CONFIG.herName} 💜`);
}

// ── Boot ──────────────────────────────────────────────────────────────────
initHeader();
initSound();
go(0);
