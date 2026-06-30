// engine.js — canvas render loop + touch drag for the monitor screen.
// Self-contained: no DOM-building dependency, just draws into a given canvas.

const W = 300;
const H = 200;

export function createEngine(canvas) {
  const ctx = canvas.getContext('2d');
  const state = { x: W / 2, y: H / 2, dx: 0.32, dy: 0.2, spin: 0, drag: false, lastX: 0, lastY: 0 };
  let raf = 0;
  let running = false;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function point(e) {
    const r = canvas.getBoundingClientRect();
    const t = e.touches && e.touches[0] ? e.touches[0] : e;
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  }

  function down(e) {
    state.drag = true;
    const p = point(e);
    state.lastX = p.x;
    state.lastY = p.y;
    e.preventDefault();
  }

  function move(e) {
    if (!state.drag) return;
    const p = point(e);
    state.x += p.x - state.lastX;
    state.y += p.y - state.lastY;
    state.lastX = p.x;
    state.lastY = p.y;
    e.preventDefault();
  }

  function up() {
    state.drag = false;
  }

  function draw() {
    if (!state.drag) {
      state.x += state.dx;
      state.y += state.dy;
      if (state.x < 36 || state.x > W - 36) state.dx *= -1;
      if (state.y < 36 || state.y > H - 36) state.dy *= -1;
    }
    state.spin += 0.012;

    ctx.clearRect(0, 0, W, H);

    const g = ctx.createRadialGradient(W / 2, H / 2, 4, W / 2, H / 2, 170);
    g.addColorStop(0, 'rgba(58,196,138,.16)');
    g.addColorStop(1, 'rgba(6,9,7,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.translate(state.x, state.y);
    ctx.rotate(state.spin * 0.5);

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(138,196,90,.65)';
    ctx.lineWidth = 1.6;
    ctx.arc(0, 0, 34, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(58,196,138,.92)';
    ctx.lineWidth = 1.2;
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = i * ((Math.PI * 2) / 10);
      const r = i % 2 ? 13 : 21;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(58,196,138,.16)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(58,196,138,.85)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();

    ctx.fillStyle = 'rgba(0,0,0,.10)';
    for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);

    raf = requestAnimationFrame(draw);
  }

  function start() {
    if (running) return;
    running = true;
    resize();
    canvas.addEventListener('pointerdown', down, { passive: false });
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up, { passive: true });
    window.addEventListener('pointercancel', up, { passive: true });
    raf = requestAnimationFrame(draw);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
    canvas.removeEventListener('pointerdown', down);
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', up);
  }

  return { start, stop, resize };
}
  }
