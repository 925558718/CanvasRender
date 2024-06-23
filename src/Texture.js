import {Vector} from "./Math/Vector.js";
import {getP, calcLinearInterpolation, Interpolation} from "./Math/MathUtils.js";
import Color from "./Color.js";

export default class Texture {
    constructor(data, width, height, size = 4, uvMode = 'uv', sampleMode = 'near') {
        this.data = data;
        this.width = width;
        this.height = height;
        this.size = size
        this.sampleMode = sampleMode;
        this.uvMode = uvMode
        this.miniMap = [data]
        this.getMiniMap()
        this.upper = this.width - 1
    }

    miniMapSample(u, v, tu, tv, ru, rv) {
        let screenX = this.upper * u;
        let screenY = this.upper * v;
        let screentX = this.upper * tu;
        let screentY = this.upper * tv;
        let screenrX = this.upper * ru;
        let screenrY = this.upper * rv;
        let deltaUpX = screenrX - screenX
        let deltaUpY = screenrY - screenY
        let deltaRightX = screentX - screenX
        let deltaRightY = screentY - screenY
        const area = Math.abs(deltaUpX * deltaRightY - deltaRightX * deltaUpY);
        let index = area <= 4 ? 1 : Math.round(Math.log(4) / Math.log(area)) + 1;
        const [pr, pb, pg, pa] = this.BiLinearInterpolationColor(screenX, screenY, index - 1)
        if (area < 1) {
            return [pr, pb, pg, pa]
        }
        const [nr, nb, ng, na] = this.BiLinearInterpolationColor(screenX, screenY, index)
        let zInterpolation = calcLinearInterpolation(index - 1, index, Math.log2(Math.sqrt(area)))
        const r = Interpolation(pr, nr, zInterpolation)
        const g = Interpolation(pb, nb, zInterpolation)
        const b = Interpolation(pg, ng, zInterpolation)
        const a = Interpolation(pa, na, zInterpolation)
        return [r, g, b, a];
    }

    nearSample(u, v) {
        const upper = this.uvMode !== 'uv' ? 1 : this.width - 1
        let screenX = Math.floor(upper * u);
        let screenY = Math.floor(upper * v);
        switch (this.size) {
            case 1:
                return [this.data[screenY * this.width * this.size + screenX * this.size]]
            case 4 :
                return [this.data[screenY * this.width * this.size + screenX * this.size], this.data[screenY * this.width * this.size + screenX * this.size + 1], this.data[screenY * this.width * this.size + screenX * this.size + 2], this.data[screenY * this.width * this.size + screenX * this.size + 3]]
        }

    }

    linearSample(u, v) {
        const upper = this.uvMode !== 'uv' ? 1 : this.width - 1
        let screenX = this.upper * u;
        let screenY = this.upper * v;
        return this.BiLinearInterpolationColor(screenX, screenY, 0)
    }

    getMiniMap() {
        let previous = this.data
        for (let i = 0; i < Math.log2(this.height); i++) {
            let square = this.width / Math.pow(2, i)
            let res = new Float32Array(square * square)
            for (let j = 0; j < square; j += 2) {
                for (let k = 0; k < square; k += 2) {
                    let p1 = j * square * 4 + k * 4
                    let p2 = p1 + 4
                    let p3 = (j + 1) * square * 4 + k * 4
                    let p4 = p3 + 4
                    let position = j * square + k * 2
                    res[position] = (previous[p1] + previous[p2] + previous[p3] + previous[p4]) / 4
                    res[position + 1] = (previous[p1 + 1] + previous[p2 + 1] + previous[p3 + 1] + previous[p4 + 1]) / 4
                    res[position + 2] = (previous[p1 + 2] + previous[p2 + 2] + previous[p3 + 2] + previous[p4 + 2]) / 4
                    res[position + 3] = (previous[p1 + 3] + previous[p2 + 3] + previous[p3 + 3] + previous[p4 + 3]) / 4
                }
            }
            previous = res;
            this.miniMap.push(res)
        }
    }

    mixColor() {

    }

    get(u, v) {
        switch (this.sampleMode) {
            case "near":
                return this.nearSample(u, v)
            case "linear":
                return this.BiLinearInterpolationColor(u, v, 0)
        }
    }

    BiLinearInterpolationColor(u, v, d) {
        const ratio = Math.pow(2, d)
        const left = Math.floor(u / ratio - 0.5)
        const bottom = Math.floor(v / ratio - 0.5)

        const right = left + 1
        const top = bottom + 1
        let map = this.miniMap[d]

        let xInterpolation = calcLinearInterpolation(left, right, u / ratio - 0.5)
        let yInterpolation = calcLinearInterpolation(bottom, top, v / ratio - 0.5)
        const len = Math.sqrt(map.length / this.size)

        const r1 = Interpolation(map[len * top * this.size + left * this.size], map[len * top * this.size + right * this.size], xInterpolation)
        const r2 = Interpolation(map[len * bottom * this.size + left * this.size], map[len * bottom * this.size + right * this.size], xInterpolation)
        const r = Interpolation(r1, r2, yInterpolation)

        if (this.size === 1) return [r]

        const g1 = Interpolation(map[len * top * 4 + left * 4 + 1], map[len * top * 4 + right * 4 + 1], xInterpolation)
        const b1 = Interpolation(map[len * top * 4 + left * 4 + 2], map[len * top * 4 + right * 4 + 2], xInterpolation)
        const a1 = Interpolation(map[len * top * 4 + left * 4 + 3], map[len * top * 4 + right * 4 + 3], xInterpolation)


        const g2 = Interpolation(map[len * bottom * 4 + left * 4 + 1], map[len * bottom * 4 + right * 4 + 1], xInterpolation)
        const b2 = Interpolation(map[len * bottom * 4 + left * 4 + 2], map[len * bottom * 4 + right * 4 + 2], xInterpolation)
        const a2 = Interpolation(map[len * bottom * 4 + left * 4 + 3], map[len * bottom * 4 + right * 4 + 3], xInterpolation)


        const g = Interpolation(g1, g2, yInterpolation)
        const b = Interpolation(b1, b2, yInterpolation)
        const a = Interpolation(a1, a2, yInterpolation)
        return [r, g, b, a]
    }
}
