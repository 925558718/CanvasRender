import {Vector} from "./Math/Vector.js";

export default class Color extends Vector {
    constructor(r, g, b, a) {
        super(r, g, b, a)
        this.type = r > 1 ? '8bit' : '1'
    }

    mul(v) {
        return new Color(this.x * v, this.y * v, this.z * v, this.w * v)
    }
    cAdd(v) {
        return new Color(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w)
    }

    interpolation(c, value) {
        return this.cAdd(c.cMinus(this).mul(value))
    }

    mix(c1) {
        return new Color(this.x * c1.x, this.y * c1.y, this.z * c1.z, this.w * c1.w)
    }


    cMinus(v) {
        return new Color(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w)
    }



    getRgb() {
        return this.mul(255)
    }
    getOrigin() {
        return this.mul(1/255)
    }

}