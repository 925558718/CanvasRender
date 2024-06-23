import {Vector} from "../Math/Vector.js";

export class SphereBoundingVolume {
    constructor(object) {
        this.object = object
        this.calc(object)
    }

    inner(surface) {
        const [v1, v2, v3] = surface
        const b1 = v3.minus(v2)
        const b2 = v1.minus(v2);
        const normal = b1.cross(b2).normalize();
        return normal.dot(this.info) - this.distance < normal.dot(v1)
    }

    intersection(ray) {
        let o = [ray.origin.x - this.info.x, ray.origin.y - this.info.y, ray.origin.z - this.info.z]
        let direction = [ray.direction.x, ray.direction.y, ray.direction.z]
        let ov = -dot(o, direction)
        let b2 = 4 * ov * ov;
        let ac = 4 * (dot(o, o) - this.distance * this.distance)
        let delta = b2 - ac
        if (delta < 0) return null;
        let t1 = (2 * ov + Math.sqrt(delta)) / 2;
        let t2 = (2 * ov - Math.sqrt(delta)) / 2;
        if (t1 < 0 && t2 < 0) return null;
        if (t1 === t2) {
            return ray.origin.z + ray.direction.z * t1
        } else {
            return Math.min(ray.origin.z + ray.direction.z * t1, ray.origin.z + ray.direction.z * t2)
        }
    }

    calc(points) {
        if (!points.length) return;
        let center = points[0];
        let radius = 0;
        // 找到离p0最远的点p1
        for (let i = 1; i < points.length; i++) {
            let dist = distance(center, points[i])
            if (dist > radius) {
                radius = dist;
                center = points[i];
            }
        }
        for (let i = 0; i < 10; i++) {
            let maxDistance = 0;
            let farthestPoint = center
            for (let j = 0; j < points.length; j++) {
                const dist = distance(center, points[j])
                if (dist > maxDistance) {
                    maxDistance = dist;
                    farthestPoint = points[j]
                }
            }
            radius = Math.sqrt(maxDistance)
            center = [(farthestPoint[0] - center[0]) * 0.5 + center[0], (farthestPoint[1] - center[1]) * 0.5 + center[1], (farthestPoint[2] - center[2]) * 0.5 + center[2]]
            for (let j = 0; j < points.length; j++) {
                let dist = distance(center, points[j])
                if (dist > radius) {
                    radius = dist
                }
            }
        }
        // 以p0为圆心，d为半径，构造初始球
        this.info = new Vector(center[0], center[1], center[2])
        this.distance = radius
    }

    scale(x, y, z) {
        this.info.r *= Math.max(x, y, z);
    }

    translate(x = 0, y = 0, z = 0) {
        this.info.x += x;
        this.info.y += y;
        this.info.z += z;
    }
}

export class AABBBoundingVolume {
    constructor(object) {
        this.object = object
        this.calc(object)
    }

    intersection() {

    }

    calc(vertices) {
        if (vertices.length < 1) return;
        let maxX = -Number.MAX_VALUE
        let minX = -Number.MAX_VALUE
        let maxY = -Number.MAX_VALUE
        let minY = -Number.MAX_VALUE
        let maxZ = -Number.MAX_VALUE
        let minZ = -Number.MAX_VALUE
        for (let i = 0; i < vertices; i++) {

        }
    }
}

function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2) + Math.pow(p1[2] - p2[2], 2));
}

function subtract(p1, p2) {
    return [p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]];
}

function add(p1, p2) {
    return [p1[0] + p2[0], p1[1] + p2[1], p1[2] + p2[2]];
}

function multiply(p, s) {
    return [p[0] * s, p[1] * s, p[2] * s];
}

function magnitude(p) {
    return Math.sqrt(Math.pow(p[0], 2) + Math.pow(p[1], 2) + Math.pow(p[2], 2));
}

function dot(p1, p2) {
    return p1[0] * p2[0] + p1[1] * p2[1] + p1[2] * p2[2]

}