import {
    barycentric,
    calcLineK,
    calcLineValue, dot, normalize,
    symmetryMinusXY,
    symmetryX,
    symmetryXY,
} from "../Math/MathUtils";
import {Vector} from "../Math/Vector";
import Color from "../Color.js";
import {ambient, Blinn_Phong, LambertDiffuse} from "../Light/reflectionMode.js";
import {alphaBlender, barycentricInterpolation} from "./uils.js";
import Ray from "../Ray.js";

export default class Render {
    constructor(ctx, buffer, options) {
        const {height, width} = options;
        this.options = options
        this.ctx = ctx;
        this.height = height;
        this.width = width;
        this.triangleBuffer = [];
        this.lineBuffer = [];
        this.clearBuffer();
        this.matertal = new Map();
        this.lights = [];
        this.fps = 0;
        this.trickCount = 0;
        this.scene = null;
        this.grey = []
        this.viewPortMatrix = null;
        this.shadowHash = new Map()
        // this.num_layers = 4;
        // this.block_size = 8;
        // this.layer_depth = new Array(4).fill(0).map(item => new Array(Math.floor(this.height / this.block_size)).fill(0).map(item => new Array(Math.floor(this.width / this.block_size)).fill(0)))
        // // for (let i = 0; i < this.num_layers; i++) {
        // //     for (let j = 0; j < this.layer_depth[i].length; j++) {
        // //         for (let k = 0; k < this.layer_depth[i][j].length; k++) {
        // //             this.layer_depth[i][j][k] = i / (this.num_layers - 1)
        // //         }
        // //     }
        // // }
    }

    drawCall() {
        this.ctx.putImageData(this.buffer, 0, 0)
    }

    clearBuffer(color) {
        this.depth = []
        for (let i = 0; i < this.height * this.width; i++) {
            this.depth[i] = Number.MAX_VALUE
        }
        this.buffer = this.ctx.createImageData(this.width, this.height);
        this.triangleBuffer = [];
    }

    drawEllipse(o, a, b) {
    }

    drawPoint(x, y, z, r, g, b, a) {
        const depPos = y * this.width + x
        if (z <= this.depth[depPos]) {
            const pos = y * this.width * 4 + x * 4
            this.depth[depPos] = z;
            this.buffer.data[pos] = r
            this.buffer.data[pos + 1] = g
            this.buffer.data[pos + 2] = b
            this.buffer.data[pos + 3] = 255
        }
    }

    drawMesh(vertices, normals, origins, textures, material, light) {
        for (let i = 2; i < vertices.length; i++) {
            this.shade(vertices[0], vertices[i - 1], vertices[i], origins[0], origins[i - 1], origins[i], normals[0], normals[i - 1], normals[i], material, light, textures[0], textures[i - 1], textures[i])
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

    shade(
        p1,
        p2,
        p3,
        origin1,
        origin2,
        origin3,
        normal1,
        normal2,
        normal3,
        material,
        lights,
        t1,
        t2,
        t3,
    ) {
        let left = Math.floor(Math.max(Math.min(p1.x, p2.x, p3.x), 0));
        let right = Math.ceil(Math.min(Math.max(p1.x, p2.x, p3.x), normal1[0] === 'shadow' ? normal1[2] : this.width));
        let top = Math.ceil(Math.min(Math.max(p1.y, p2.y, p3.y), normal1[0] === 'shadow' ? normal1[2] : this.height));
        let bottom = Math.floor(Math.max(Math.min(p1.y, p2.y, p3.y), 0));
        for (let y = bottom; y < top; y++) {
            for (let x = left; x < right; x++) {
                let shadowDepth = 0;
                const [w1, w2, w3] = barycentric(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, x, y);
                if (w1 > 0) {
                    // const screenPos = new Vector(x, y, 0, 1)
                    // const worldPos = screenPos.multiply(this.scene.cam.transformStack[2].reverse()).hNormalize()
                    // const camPos = new Vector(this.scene.cam.e.x, this.scene.cam.e.y, this.scene.cam.e.z)
                    // const direction = worldPos.minus(camPos)
                    // const ray = new Ray(this.scene.cam.e.x, this.scene.cam.e.y, this.scene.cam.e.z, direction.x, direction.y, direction.z)
                    // const nearestObj = this.scene.findNearObject(ray)
                    const cw1 = w1 / origin1.z;
                    const cw2 = w2 / origin2.z;
                    const cw3 = w3 / origin3.z;
                    const zn = 1 / (cw1 + cw2 + cw3)
                    if ((p1.z * w1 + p2.z * w2 + p3.z * w3) > 1 || (p1.z * w1 + p2.z * w2 + p3.z * w3) < -1) continue
                    const ndcZ = (-(p1.z * w1 + p2.z * w2 + p3.z * w3) + 1) / 2;
                    const interpolation = barycentricInterpolation(origin1, origin2, origin3, cw1, cw2, cw3, zn);

                    if (normal1[0] === 'shadow') {
                        const pos = y * normal1[2] + x
                        if (normal1[1][pos] === undefined || (normal1[1][pos] && ndcZ < normal1[1][pos])) {
                            normal1[1][pos] = ndcZ
                        }
                        continue
                    }
                    if (this.options.shadow !== 'None') {
                        const [w1, w2, w3] = barycentric(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, x, y);
                        const cw1 = w1 / origin1.z;
                        const cw2 = w2 / origin2.z;
                        const cw3 = w3 / origin3.z;
                        const interpolation = barycentricInterpolation(origin1, origin2, origin3, cw1, cw2, cw3, zn);
                        const camPos = new Vector(interpolation[0], interpolation[1], interpolation[2], 1)
                        const world = camPos.multiply(this.scene.cam.matrixMap.get('camRev'))
                        const project = world.multiply(this.scene.shadowCam[0].matrixMap.get('camToViewPort'))
                        const shadowPixelDep = (-project.z + 1) / 2
                        if (this.options.shadow === 'shadow_map') {
                            shadowDepth = shadowPixelDep > this.grey[0].get(project.x, project.y)[0] + 0.1 ? 1 : 0
                        } else {
                            let area = 5;
                            if (this.options.shadow === 'pcss') {
                                let depSum = 0;
                                for (let i = 0; i < 4; i++) {
                                    for (let j = 0; j < 4; j++) {
                                        if (project.x - 2 + i < 0 || project.y - 2 + j < 0) continue
                                        depSum += this.grey[0].get(project.x - 2 + i, project.y - 2 + j)[0];
                                    }
                                }
                                const avgDep = depSum / 16;
                                if (shadowPixelDep > avgDep) {
                                    area = Math.max(Math.ceil((shadowPixelDep - avgDep) / avgDep), 4)
                                }
                            } else if (this.options.shadow === 'pcf') area = 3;
                            let startX = x - (area >> 1);
                            let startY = y - (area >> 1);
                            let sum = 0;
                            let count = 0;

                            for (let i = 0; i < area; i++) {
                                for (let j = 0; j < area; j++) {
                                    if (startX + j < 0 || startY + i < 0) continue
                                    const [w1, w2, w3] = barycentric(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, startX + j, startY + i, 'all');
                                    const cw1 = w1 / origin1.z;
                                    const cw2 = w2 / origin2.z;
                                    const cw3 = w3 / origin3.z;
                                    const interpolation = barycentricInterpolation(origin1, origin2, origin3, cw1, cw2, cw3, zn);
                                    const camPos = new Vector(interpolation[0], interpolation[1], interpolation[2], 1)
                                    const world = camPos.multiply(this.scene.cam.matrixMap.get('camRev'))
                                    const project = world.multiply(this.scene.shadowCam[0].matrixMap.get('camToViewPort'))
                                    const shadowPixelDep = (-project.z + 1) / 2
                                    if (shadowPixelDep > this.grey[0].get(project.x, project.y)[0] + 0.02) {
                                        sum++;
                                    }
                                    count++;

                                }
                            }
                            shadowDepth = sum / count
                        }

                    }

                    const interpolationNormal = barycentricInterpolation(normal1, normal2, normal3, cw1, cw2, cw3, zn);
                    let r = 0, g = 0, b = 0, a = 1;
                    let diffuseColor = [1, 1, 1, 1]
                    if (material) {
                        let textureInterpolation = barycentricInterpolation(t1, t2, t3, cw1, cw2, cw3, zn)

                        switch (this.options.sampleType) {
                            case 0:
                                const [g1 = w1, g2 = w2, g3 = w3, o1 = w1, o2 = w2, o3 = w3] = this.sampleTextureMiniMap(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, x, y)
                                const zn2 = 1 / ((g1 / origin1.z) + (g2 / origin2.z) + (g3 / origin3.z))
                                let textureInterpolation2 = barycentricInterpolation(t1, t2, t3, g1 / origin1.z, g2 / origin2.z, g3 / origin3.z, zn2)
                                const zn3 = 1 / ((o1 / origin1.z) + (o2 / origin2.z) + (o3 / origin3.z))
                                let textureInterpolation3 = barycentricInterpolation(t1, t2, t3, o1 / origin1.z, o2 / origin2.z, o3 / origin3.z, zn3)
                                diffuseColor = material.map_Kd.miniMapSample(
                                    textureInterpolation[0],
                                    textureInterpolation[1],
                                    textureInterpolation2[0],
                                    textureInterpolation2[1],
                                    textureInterpolation3[0],
                                    textureInterpolation3[1]
                                );
                                break;
                            case 1:
                                diffuseColor = material.map_Kd.linearSample(
                                    textureInterpolation[0],
                                    textureInterpolation[1]
                                );
                                break;
                            case 2:
                                diffuseColor = material.map_Kd.nearSample(
                                    textureInterpolation[0],
                                    textureInterpolation[1]
                                );
                                break;

                        }
                        for (let i = 0; i < diffuseColor.length; i++) {
                            diffuseColor[i] /= 255;
                        }
                    }
                    for (let l = 0; l < lights.length; l++) {
                        const viewDirection = normalize([-interpolation[0], -interpolation[1], -interpolation[2]])
                        switch (lights[l].type) {

                            case 'point':
                                let light = lights[l].camPositon
                                const radius = light.len()
                                const distance = 1 / (radius * radius)
                                const indicateDirection = normalize([light.x - interpolation[0], light.y - interpolation[1], light.z - interpolation[2]])
                                if (1) {
                                    const [lr, lg, lb] = LambertDiffuse(diffuseColor, interpolationNormal, indicateDirection, lights[l].color, lights[l].intensity, distance)
                                    r += lr;
                                    g += lg;
                                    b += lb;
                                }
                                if (1) {
                                    const [br, bg, bb] = Blinn_Phong(diffuseColor, interpolationNormal, indicateDirection, lights[l].color, lights[l].intensity, distance, viewDirection, 500)
                                    r += br;
                                    g += bg;
                                    b += bb;
                                }

                                break;
                            case 'direction':
                                const direction = [-lights[l].position.x, -lights[l].position.y, -lights[l].position.z]
                                const [br, bg, bb] = Blinn_Phong(diffuseColor, interpolationNormal, direction, lights[l].color, 1, 1, viewDirection, 500)
                                r = (0.7 * r + br * 0.3);
                                g = (0.7 * g + bg * 0.3);
                                b = (0.7 * b + bb * 0.3);
                                break;
                            case 'ambient':
                                const [ar, ag, ab] = ambient(diffuseColor, lights[l].color, lights[l].intensity)
                                r += ar;
                                g += ag;
                                b += ab;
                                break;
                        }
                    }
                    this.drawPoint(x, y, ndcZ, ...alphaBlender(r * 255, g * 255, b * 255, shadowDepth))
                }
            }
        }
    }

    sampleTextureMiniMap(p1x, p1y, p2x, p2y, p3x, p3y, x, y) {
        let count = 0
        let res = []
        const [r1, r2, r3] = barycentric(
            p1x, p1y,
            p2x, p2y,
            p3x, p3y,
            x + 1, y
        );
        if (r1 > 0) {
            count++;
            res.push(r1, r2, r3)
        }
        const [t1, t2, t3] = barycentric(
            p1x, p1y,
            p2x, p2y,
            p3x, p3y,
            x, y + 1
        );
        if (t1 > 0) {
            count++;
            res.push(t1, t2, t3)
        }
        if (count === 2) return res
        const [l1, l2, l3] = barycentric(
            p1x, p1y,
            p2x, p2y,
            p3x, p3y,
            x - 1, y
        );
        if (l1 > 0) {
            count++;
            res.push(l1, l2, l3)
        }
        if (count === 2) return res
        const [b1, b2, b3] = barycentric(
            p1x, p1y,
            p2x, p2y,
            p3x, p3y,
            x, y - 1
        );
        if (b1 > 0) {
            count++;
            res.push(b1, b2, b3)
        }
        if (res.length === 3) {
            return res.concat(...res.slice(1))
        }

        return res

    }
}
