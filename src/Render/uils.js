import {Vector} from "../Math/Vector.js";

export function barycentricInterpolation(p1, p2, p3, w1, w2, w3, z) {
    return [((p1[0] ?? p1.x) * w1 + (p2[0] ?? p2.x) * w2 + (p3[0] ?? p3.x) * w3) * z, ((p1[1] ?? p1.y) * w1 + (p2[1] ?? p2.y) * w2 + (p3[1] ?? p3.y) * w3) * z, ((p1[2] ?? p1.z) * w1 + (p2[2] ?? p2.z) * w2 + (p3[2] ?? p3.z) * w3) * z]
}


export function alphaBlender(r, g, b, a) {
    return [r - (a * 0.5 * r), g - (a * 0.5 * g), b - (a * 0.5 * b)]
}