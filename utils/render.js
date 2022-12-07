import {
  calcLineK,
  calcLineValue,
  symmetryMinusXY,
  symmetryX,
  symmetryXY,
  Vector4,
} from "./math.js";

export function drawPoint(ctx, point = [0, 0], color = [0, 0, 0, 1], size = 1) {
  const [x, y] = point;
  const [r, g, b, a] = color;
  ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
  ctx.fillRect(x, y, size, size);
  ctx.globalAlpha = a;
}

export function drawLine(ctx, p0, p1, color = [0, 0, 0, 1]) {
  let [p0x, p0y] = p0;
  let [p1x, p1y] = p1;

  let y = p0y;
  let d = calcLineValue(p0, p1, [p0[0] + 1, p0[1] + 0.5]);
  const k = calcLineK(p0, p1);
  if (p0x > p1x) {
    [p0x, p1x] = [p1x, p0x];
    [p0y, p1y] = [p1y, p0y];
  }
  if (p0[0] === p1[0]) {
    let start = Math.min(p0[1], p1[1]);
    let end = Math.max(p0[1], p1[1]);
    for (let i = start; i <= end; i++) {
      drawPoint(ctx, [p0[0], i], color);
    }
    return;
  }
  if (k > 1) {
    p0 = symmetryXY(p0);
    p1 = symmetryXY(p1);
  } else if (k < 0 && k > -1) {
    p0 = symmetryMinusXY(p0);
    p1 = symmetryMinusXY(p1);
  } else if (k < -1) {
  }
  const d1 = p0y - p1y;
  const d2 = p0y - p1y + p1x - p0x;

  for (let i = p0x; i < p1x; i++) {
    if (d < 0) {
      y++;
      d += d2;
    } else {
      d += d1;
    }
    let tx = i,
      ty = y;
    if (k > 1) {
      [tx, ty] = [ty, tx];
    }
    if (k < -1) {
    }
    drawPoint(ctx, [tx, ty], color);
  }
}

export function drawCircle(ctx, o, r) {}

export function drawTriangle(ctx, p1, p2, p3) {}

export function drawCoordinateSystem(ctx, wrap, mode = "2D") {
  if (mode === "2D") {
    drawLine(ctx, [-wrap.width, 0], [wrap.width, 0], [255, 0, 0, 1]);
    drawLine(ctx, [0, wrap.height], [0, -wrap.height], [0, 255, 0, 1]);
  } else {
  }
}

export function renderBuffer(ctx, buffer, height, width) {
  for (let i = 0; i < buffer.length; i++) {
    drawPoint(this.ctx, [Math.floor(i / width), i % height], buffer[i]);
  }
}
