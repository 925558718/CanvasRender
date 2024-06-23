import {Vector} from "./Vector";

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

export function barycentric(p0x, p0y, p1x, p1y, p2x, p2y, x, y, mode = 'pause') {
    const f01 = pointSide(p0x, p0y, p1x, p1y, p2x, p2y);
    const f01xy = pointSide(p0x, p0y, p1x, p1y, x, y);
    let c = f01xy / f01;
    if (mode === 'pause' && c < 0) return [-1]
    const f12 = pointSide(p1x, p1y, p2x, p2y, p0x, p0y);
    const f12xy = pointSide(p1x, p1y, p2x, p2y, x, y);

    let a = f12xy / f12;
    if (mode === 'pause' && a < 0) return [-1]
    const f20 = pointSide(p2x, p2y, p0x, p0y, p1x, p1y);
    const f20xy = pointSide(p2x, p2y, p0x, p0y, x, y);

    let b = f20xy / f20;
    if (mode === 'pause' && b < 0) return [-1]
    return [a, b, c];
}

function pointSide(p0x, p0y, p1x, p1y, x, y) {
    return (p0y - p1y) * x + (p1x - p0x) * y + p0x * p1y - p1x * p0y;
}

export function calcLinearInterpolation(a, b, x) {
    if (b - a === 0) return 1;
    return (x - a) / (b - a)
}

export function Interpolation(a, b, x) {
    return a + ((b - a) * x)
}

export function getP(a, b, t) {
    return a + t * (b - a)
}


export function Convolve(a, b) {
    let res = 0;
    let radius = 10;
    for (let i = 0; i < a.length + b.length; i++) {
        let sum = 0;
        for (let j = i - radius; i <= i + radius; i++) {
            sum += a[j] * b[i - j]
        }
        res.push(sum)
    }
    return res;
}

export function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function normalize(a) {
    let len = Math.sqrt(Math.abs(dot(a, a)))
    for (let i = 0; i < a.length; i++) {
        a[i] /= len;
    }
    return a;
}

export function convolution(arr, filter) {
    let len = arr.length
    for (let i = 0; i < len; i++) {
        let sum = 0;
        for (let j = 0; j < filter.length; j++) {
            const pixel = 1
            const weight = filter[1]
            sum += pixel * weight
        }


    }
}