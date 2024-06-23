import Color from "../Color.js";
import {Vector} from "../Math/Vector.js";
import {normalize} from "../Math/MathUtils.js";

export function LambertDiffuse(ks, n, l, lc, intensity, d) {
    const dot = Math.max(n[0] * l[0] + n[1] * l[1] + n[2] * l[2], 0) * d * intensity
    return [ks[0] * lc[0] * dot, ks[1] * lc[1] * dot, ks[2] * lc[2] * dot]
}

export function ambient(ks, k, intensity) {
    return [ks[0] * k[0] * intensity, ks[1] * k[1] * intensity, ks[2] * k[2] * intensity]
}

export function Blinn_Phong(ks, n, l, lc, intensity, d, v, p) {
    const half = normalize([(l[0] + v[0]) / 2, (l[1] + v[1]) / 2, (l[2] + v[2]) / 2])
    const dot = half[0] * n[0] + half[1] * n[1] + half[2] * n[2]
    const o = intensity*d * Math.pow(Math.max(dot, 0), p)
    return [ks[0] * lc[0] * o, ks[1] * lc[1] * o, ks[2] * lc[2] * o]
}