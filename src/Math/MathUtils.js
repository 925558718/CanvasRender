
export function calcLineValue(p0, p1, targetPoint) {
    const [p0x, p0y] = p0;
    const [p1x, p1y] = p1;
    const [tx, ty] = targetPoint;
    return (p0y - p1y) * tx + (p1x - p0x) * ty + p0x * p1y - p1x * p0y;
  }
  
  export function calcLineK(p0, p1) {
    const [p0x, p0y] = p0;
    const [p1x, p1y] = p1;
    return (p1y - p0y) / (p1x - p0x);
  }
  
  export function symmetryXY(p) {
    return [p[1], p[0], p[2]];
  }
  
  export function symmetryMinusXY(p) {
    return [-p[1], -p[0], p[2]];
  }
  
  export function symmetryX(p) {
    return [p[0], -p[1], p[2]];
  }
  
  export function symmetryY(p) {
    return [-p[0], p[1]];
  }
  
  export function beInTriangle(p1, p2, p3, p) {
    const p1p = vectorMinus(p1, p);
    const p2p = vectorMinus(p2, p);
    const p3p = vectorMinus(p3, p);
    const a = vectorMinus(p2, p1);
    const b = vectorMinus(p3, p1);
    const sumArea = Math.abs(b[0] * a[1] - b[1] * a[0]);
    const p1W = Math.abs(dotProduct(p2p, p3p));
    const p2W = Math.abs(dotProduct(p3p, p1p));
    const p3W = Math.abs(dotProduct(p1p, p2p));
    if (sumArea === p1W + p2W + p3W) {
      return [p1W, p2W, p3W, sumArea];
    }
    return null;
  }
  
  export function vectorMinus(p1, p2) {
    return p1.map((item, index) => item - p2[index]);
  }
  
  export function dotProduct(p1, p2) {
    return p1[0] * p2[1] - p1[1] * p2[0];
  }
  