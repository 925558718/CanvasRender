import {Matrix} from "./Matrix.js";

export class Vector {
    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        this.storeW = w;
    }

    dot(v) {
        const {x: vx, y: vy, z: vz, w: vw} = v;
        const {x, y, z, w} = this;
        return vx * x + vy * y + vz * z;
    }

    get() {
        return [this.x, this.y, this.z, this.w];
    }

    cross(v) {
        const {x: a1, y: a2, z: a3, w: a4} = this;
        let m = new Matrix([
            0,
            -a3,
            a2,
            0,
            a3,
            0,
            -a1,
            0,
            -a2,
            a1,
            0,
            0,
            0,
            0,
            0,
            1,
        ]);
        return v.multiply(m);
    }

    multiply(m) {
        if(m instanceof Matrix) {
            let res = [];
            for (let i = 0; i < m.nrow; i++) {
                let sum =
                    this.x * m.find(i, 0) +
                    this.y * m.find(i, 1) +
                    this.z * m.find(i, 2) +
                    this.w * m.find(i, 3);
                res.push(sum);
            }
            return new Vector(...res);
        }else if(m instanceof Vector) {
            return new Vector(this.x * m.x,this.y * m.y,this.z * m.z,this.w * m.w);
        }else {
            return new Vector(this.x * m, this.y * m, this.z * m, this.w * m);
        }
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z, 1);
    }

    minus(v) {
        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z, 0);
    }

    multiplyScalar(v) {
        return new Vector(this.x * v, this.y * v, this.z * v, this.w);
    }

    normalize() {
        this.w = 1;
        let len = this.len();
        if(len===0) return new Vector(0,0,0)
        return this.multiplyScalar(1 / len);
    }

    hNormalize() {
        this.storeW = this.w;
        return new Vector(this.x / this.w, this.y / this.w, this.z / this.w, 1);
    }

    len() {
        return Math.sqrt(this.dot(this));
    }

    componentMultiply(v) {
        return new Vector(this.x * v.x, this.y * v.y, this.z * v.z, 1);
    }
}
