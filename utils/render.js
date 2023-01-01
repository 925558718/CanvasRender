import {
  beInTriangle,
  calcLineK,
  calcLineValue,
  symmetryMinusXY,
  symmetryX,
  symmetryXY,
  Vector4,
} from "./math.js";

export default class Render {
  constructor(ctx, buffer, options) {
    const { height, width, antialias, Z_Buffer } = options;
    this.ctx = ctx;
    this.buffer = buffer;
    this.height = height;
    this.width = width;
    this.antialias = antialias;
    this.Z_Buffer = Z_Buffer;
  }

  drawCircle(o, r) {}

  drawTriangle(p1, p2, p3) {
    this.drawLine(p1, p2);
    this.drawLine(p2, p3);
    this.drawLine(p3, p1);
  }

  drawPoint(point = [0, 0, 0], color = [0, 0, 0, 1], size = 1) {
    const [x, y, z = 0] = point;
    const [r, g, b, a] = color;
    this.buffer.push(x, y, z, r, g, b, a);
  }

  renderBuffer() {
    for (let i = 0; i < this.buffer.length; i += 7) {
      const [x, y, z, r, g, b, a] = this.buffer.slice(i, i + 7);
      this.ctx.fillStyle = `rgba(${r * 255},${g * 255},${b * 255},${a})`;
      this.ctx.fillRect(x, y, 1, 1);
      this.ctx.globalAlpha = a;
    }
  }
  drawLine(p0, p1, color = [0, 0, 0, 1]) {
    if (p0[0] === p1[0]) {
      let start = Math.min(p0[1], p1[1]);
      let end = Math.max(p0[1], p1[1]);
      for (let i = start; i <= end; i++) {
        this.drawPoint([p0[0], i, 0], color);
      }
      return;
    } else if (p0[0] > p1[0]) {
      [p0, p1] = [p1, p0];
    }
    const offsetX = -p0[0];
    const offsetY = -p0[1];
    const k = calcLineK(p0, p1);
    let vp0 = [0, 0, 0];
    let vp1 = [p1[0] + offsetX, p1[1] + offsetY, 0];

    let y = 0;
    let d = calcLineValue(vp0, vp1, [vp0[0] + 1, vp0[1] + 0.5]);

    if (k > 1) {
      vp1 = symmetryXY(vp1);
    } else if (k <= 0 && k >= -1) {
      vp1 = symmetryX(vp1);
    } else if (k < -1) {
      vp1 = symmetryX(symmetryMinusXY(vp1));
    }
    const d1 = vp0[1] - vp1[1];
    const d2 = vp0[0] - vp1[1] + vp1[0] - vp0[0];

    for (let i = vp0[0]; i <= vp1[0]; i++) {
      if (d < 0) {
        y++;
        d += d2;
      } else {
        d += d1;
      }
      let targetPoint = [i, y, 0];
      //处理对称
      if (k > 1) {
        targetPoint = symmetryXY(targetPoint);
      } else if (k <= 0 && k >= -1) {
        targetPoint = symmetryX(targetPoint);
      } else if (k < -1) {
        targetPoint = symmetryX(symmetryMinusXY(targetPoint));
      }
      this.drawPoint(
        [targetPoint[0] - offsetX, targetPoint[1] - offsetY, 0],
        color
      );
    }
  }
  SSAAAntialias(p1, p2, p3, c1, c2, c3, j, i, z, x) {
    const finalColor = [0, 0, 0, 0];
    const mapX = {
      0: -0.5,
      1: -0.5,
      2: 0.5,
      3: 0.5,
    };
    const mapY = {
      0: 0.5,
      1: -0.5,
      2: 0.5,
      3: -0.5,
    };
    for (let index = 0; index < x; index++) {
      const w = beInTriangle(p1, p2, p3, [
        j + mapX[index],
        i + mapY[index],
        0,
      ]) || [0, 0, 0, 1];

      const w1lt = w[0] / w[3];
      const w2lt = w[1] / w[3];
      const w3lt = w[2] / w[3];
      const color = [
        w1lt * c1[0] + w2lt * c2[0] + w3lt * c3[0],
        w1lt * c1[1] + w2lt * c2[1] + w3lt * c3[1],
        w1lt * c1[2] + w2lt * c2[2] + w3lt * c3[2],
        w1lt * c1[3] + w2lt * c2[3] + w3lt * c3[3],
      ];
      for (let i = 0; i < 4; i++) {
        finalColor[i] += color[i] / 4;
      }
    }

    this.drawPoint([j, i, z], finalColor);
  }
  fillTriangle(p1, p2, p3, c1 = [1, 1, 1, 1], c2, c3) {
    if (!c2) {
      c2 = c1;
      c3 = c1;
    }
    let left = Math.min(p1[0], p2[0], p3[0]);
    let right = Math.max(p1[0], p2[0], p3[0]);
    let top = Math.max(p1[1], p2[1], p3[1]);
    let bottom = Math.min(p1[1], p2[1], p3[1]);
    for (let i = top; i >= bottom; i--) {
      for (let j = left; j <= right; j++) {
        switch (this.antialias) {
          case "None":
            const res = beInTriangle(p1, p2, p3, [j, i, 0]);
            if (res) {
              const [w1, w2, w3, sum] = res;
              this.drawPoint(
                [j, i, 0],
                [
                  (w1 / sum) * c1[0] + (w2 / sum) * c2[0] + (w3 / sum) * c3[0],
                  (w1 / sum) * c1[1] + (w2 / sum) * c2[1] + (w3 / sum) * c3[1],
                  (w1 / sum) * c1[2] + (w2 / sum) * c2[2] + (w3 / sum) * c3[2],
                  (w1 / sum) * c1[3] + (w2 / sum) * c2[3] + (w3 / sum) * c3[3],
                ]
              );
            }
            break;
          case "SSAA_4":
            this.SSAAAntialias(p1, p2, p3, c1, c2, c3, j, i, 0, 4);
            break;
        }
      }
    }
  }
  drawCube(l, w, h, color = [1, 0, 0, 1]) {
    const halfl = l / 2;
    const halfw = h / 2;
    const halfh = h / 2;
    this.drawRect(
      [-halfl, halfh, halfw],
      [halfl, halfh, halfw],
      [halfl, -halfh, halfw],
      [-halfl, -halfh, halfw],
      color
    ); //front
    this.drawRect(
      [-halfl, halfh, -halfw],
      [halfl, halfh, -halfw],
      [halfl, halfh, halfw],
      [-halfl, halfh, halfw],
      color
    ); // top
    this.drawRect(
      [halfl, halfh, halfw],
      [halfl, halfh, -halfw],
      [halfl, -halfh, -halfw],
      [halfl, -halfh, halfw],
      color
    ); //right
    this.drawRect(
      [-halfl, halfh, -halfw],
      [-halfl, halfh, halfw],
      [-halfl, -halfh, halfw],
      [-halfl, -halfh, -halfw],
      color
    ); //left
    this.drawRect(
      [-halfl, -halfh, -halfw],
      [halfl, -halfh, -halfw],
      [halfl, -halfh, halfw],
      [-halfl, -halfh, halfw],
      color
    ); //bottom
    this.drawRect(
      [-halfl, halfh, -halfw],
      [halfl, halfh, -halfw],
      [halfl, -halfh, -halfw],
      [-halfl, -halfh, -halfw],
      color
    ); //backend
  }
  drawRect(p1, p2, p3, p4, color) {
    this.fillTriangle(p1, p2, p3, color);
    this.fillTriangle(p1, p3, p4, color);
  }
}
