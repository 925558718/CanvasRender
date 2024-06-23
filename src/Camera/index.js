import {Vector} from "../Math/Vector";
import {Matrix} from "../Math/Matrix";

class Camera {
    constructor(px, py, pz, lx, ly, lz, upx, upy, upz) {
        const position = new Vector(px, py, pz, 1);
        const lookAt = new Vector(lx, ly, lz, 1);
        const upward = new Vector(upx, upy, upz);

        this.e = new Vector(px, py, pz, 1);
        this.g = lookAt.minus(position);
        this.t = upward;
        this.w = this.g.normalize().multiplyScalar(-1);
        this.u = upward.cross(this.w).normalize();
        this.v = this.w.cross(this.u);
        const [ux, uy, uz] = this.u.get();
        const [wx, wy, wz] = this.w.get();
        const [vx, vy, vz] = this.v.get();
        const [ex, ey, ez, ew] = this.e.get();
        this.frustum = []
        this.transformMatrix = new Matrix()
        this.matrixMap = new Map()
        this.transformStack = [new Matrix([
            ux,
            vx,
            wx,
            ex,
            uy,
            vy,
            wy,
            ey,
            uz,
            vz,
            wz,
            ez,
            0,
            0,
            0,
            1,
        ]).reverse()]
        this.transformStack.push(new Matrix().multiply(this.transformStack[0]))
        this.transformStack.push(new Matrix())
    }

    setOrtho(t = 1, b = 1, l = 1, r = 1, n = 1, f = 1, mode) {
        const OrthoMatrix = new Matrix([
            2 / (r - l),
            0,
            0,
            -(l + r) / (r - l),
            0,
            2 / (t - b),
            0,
            -(t + b) / (t - b),
            0,
            0,
            2 / (n - f),
            -(n + f) / (n - f),
            0,
            0,
            0,
            1,
        ])
        if (mode === 'ort') {
            this.width = r
            this.length = b;
            this.near = n;
            this.far = f;
            this.refreshFrustum()
        }
        this.transformStack[2] = OrthoMatrix.multiply(this.transformStack[2])
    }

    setPerspective(fovy, aspect, near, far) {
        const perspectiveMatrix = new Matrix([
            near,
            0,
            0,
            0,
            0,
            near,
            0,
            0,
            0,
            0,
            near + far,
            -near * far,
            0,
            0,
            1,
            0,
        ])
        this.transformStack[2] = perspectiveMatrix.multiply(this.transformStack[2]);
        this.width = Math.tan((fovy / 360) * Math.PI).toFixed(8) * Math.abs(near);
        this.length = this.width * aspect;
        this.near = near;
        this.far = far;
        this.refreshFrustum()
        this.setOrtho(this.width, -this.width, -this.length, this.length, near, far, 'per');
    }

    merge(near, width, length) {
        return this.e.add(this.w.multiplyScalar(-near)).add(this.u.multiplyScalar(width)).add(this.v.multiplyScalar(length))
    }

    rotate(a, mode) {
        this.transformMatrix = this.transformMatrix.rotate(a, mode);
        this.transformStack[1] = this.transformMatrix.reverse().multiply(this.transformStack[0])
    }

    translate(x, y, z) {
        this.transformMatrix = this.transformMatrix.translate(x, y, z);
        this.transformStack[1] = this.transformMatrix.reverse().multiply(this.transformStack[0])
    }

    refreshFrustum() {
        const fw = this.width * this.far / this.near
        const fh = this.length * this.far / this.near

        const nrt = this.merge(this.near, this.width, this.length);
        const nlb = this.merge(this.near, -this.width, -this.length);
        const nrb = this.merge(this.near, this.width, -this.length);
        const nlt = this.merge(this.near, -this.width, this.length);
        const frt = this.merge(this.far, fw, fh);
        const flb = this.merge(this.far, -fw, -fh);
        const frb = this.merge(this.far, fw, -fh);
        const flt = this.merge(this.far, -fw, fh);
        this.frustum = [[nlb, nrb, nrt], [nrt, nrb, frb], [flt, nlt, nrt], [flt, frb, nlb], [flt, frt, frb], [nrb, nlb, flb]]
    }

    calcMatrixStack(viewPort) {
        this.matrixMap.set('camRev', this.transformStack[0].reverse())
        this.matrixMap.set('camToViewPort', viewPort.multiply(this.transformStack[2].multiply(this.transformStack[0])))
    }

}

export default Camera;
