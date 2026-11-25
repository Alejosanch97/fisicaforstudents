import { buildBank, fromSheet, shuffle } from "../data/bank";

export function getPool({ grade, terms = [1, 2, 3, 4], mine = [], includeMine = true }) {
  const g = Number(grade);
  const base = buildBank().filter((q) => q.grade === g && terms.includes(q.period));
  const own = includeMine ? mine.map(fromSheet).filter((q) => q.grade === g && (!q.period || terms.includes(q.period))) : [];
  return [...base, ...own];
}

/* 15 questions with growing difficulty for the Millionaire ladder */
export function ladder(pool) {
  const s = shuffle(pool, Date.now());
  const by = (lv) => s.filter((q) => q.level === lv);
  const used = new Set();
  const take = (lvls, n) => {
    const out = [];
    for (const lv of lvls) for (const q of by(lv)) { if (out.length >= n) break; if (!used.has(q.id)) { used.add(q.id); out.push(q); } }
    for (const q of s) { if (out.length >= n) break; if (!used.has(q.id)) { used.add(q.id); out.push(q); } }
    return out;
  };
  return [...take([1], 5), ...take([2, 1], 5), ...take([3, 2], 5)];
}

export function confetti() {
  const cv = document.createElement("canvas");
  Object.assign(cv.style, { position: "fixed", inset: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 9999 });
  document.body.appendChild(cv);
  const ctx = cv.getContext("2d"); cv.width = innerWidth; cv.height = innerHeight;
  const cols = ["#ff5a36", "#ffc12e", "#10a58c", "#3557ff", "#9b7bff", "#ff6fae"];
  const P = Array.from({ length: 160 }, () => ({ x: innerWidth / 2, y: innerHeight * 0.35, vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 16 - 4, r: Math.random() * 6 + 4, c: cols[Math.floor(Math.random() * 6)], a: Math.random() * 6 }));
  let t = 0;
  const loop = () => {
    ctx.clearRect(0, 0, cv.width, cv.height);
    P.forEach((p) => { p.vy += 0.4; p.x += p.vx; p.y += p.vy; p.a += 0.2; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
    if (++t < 160) requestAnimationFrame(loop); else cv.remove();
  };
  loop();
}
