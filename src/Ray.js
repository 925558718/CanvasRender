import {Vector} from "./Math/Vector.js";

export default class Ray {
    constructor(x, y, z, dx, dy, dz) {
        this.origin = new Vector(x, y, z, 1)
        this.direction = new Vector(dx, dy, dz).normalize()
        this.tmin = 0;
        this.tmax = 0;
    }
    pointAt(t) {
        return this.origin.add(this.direction.multiplyScalar((t)))
    }
}