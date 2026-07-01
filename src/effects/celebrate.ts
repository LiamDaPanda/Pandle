import type { ParticleShape } from '../data/cosmetics';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rot: number;
  vr: number;
  life: number;
  spin: number;
}

function drawShape(
  ctx: CanvasRenderingContext2D,
  shape: ParticleShape,
  s: number,
  color: string,
) {
  ctx.fillStyle = color;
  switch (shape) {
    case 'confetti':
      ctx.fillRect(-s, -s * 0.5, s * 2, s);
      break;
    case 'leaf':
      ctx.beginPath();
      ctx.ellipse(0, 0, s, s * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'snow':
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.8, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'petal':
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(s, -s * 0.2, 0, s);
      ctx.quadraticCurveTo(-s, -s * 0.2, 0, -s);
      ctx.fill();
      break;
    case 'heart': {
      const h = s * 1.1;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.35);
      ctx.bezierCurveTo(h, -h * 0.6, h * 0.5, -h, 0, -h * 0.3);
      ctx.bezierCurveTo(-h * 0.5, -h, -h, -h * 0.6, 0, h * 0.35);
      ctx.fill();
      break;
    }
    case 'star': {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const p = i === 0 ? 'moveTo' : 'lineTo';
        ctx[p](Math.cos(a) * s, Math.sin(a) * s);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
  }
}

/**
 * Fire a celebratory burst of shaped particles on a full-screen canvas. Shape
 * and colors come from the equipped effect pack. No-op under reduced motion —
 * the celebration never sits on the gameplay input path.
 */
export function celebrate(
  colors: string[],
  shape: ParticleShape = 'leaf',
  reducedMotion = false,
): void {
  if (reducedMotion || typeof document === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;';
  const dpr = window.devicePixelRatio || 1;
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }
  ctx.scale(dpr, dpr);

  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const pick = () => colors[Math.floor(Math.random() * colors.length)];

  // Two launch points for a fuller burst.
  const spouts = [W * 0.32, W * 0.68];
  const count = 130;
  const particles: Particle[] = Array.from({ length: count }, (_, i) => {
    const cx = spouts[i % spouts.length];
    return {
      x: cx + rand(-30, 30),
      y: H * 0.35 + rand(-20, 20),
      vx: rand(-8, 8),
      vy: rand(-15, -5),
      size: rand(5, 11),
      color: pick(),
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.3, 0.3),
      life: 1,
      spin: rand(0.02, 0.08),
    };
  });

  const gravity = shape === 'snow' ? 0.12 : 0.34;
  const drag = shape === 'snow' || shape === 'petal' || shape === 'leaf' ? 0.99 : 1;
  const sway = shape === 'snow' || shape === 'petal' ? 1.2 : 0;
  let frame = 0;

  const tick = () => {
    ctx.clearRect(0, 0, W, H);
    let alive = false;
    for (const p of particles) {
      p.vy = (p.vy + gravity) * drag;
      p.vx = p.vx * drag + (sway ? Math.sin((frame + p.x) * 0.05) * sway * 0.3 : 0);
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 0.006;
      if (p.y < H + 40 && p.life > 0) alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.4));
      drawShape(ctx, shape, p.size, p.color);
      ctx.restore();
    }
    frame++;
    if (alive && frame < 300) {
      requestAnimationFrame(tick);
    } else {
      canvas.remove();
    }
  };
  requestAnimationFrame(tick);
}
