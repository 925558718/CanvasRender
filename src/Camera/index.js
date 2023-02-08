import { SMatrix } from "./math.js";

class Camera extends SMatrix {
  constructor(position, lookAt, upward) {
    super(4);
    this.e = position;
    this.g = lookAt;
    this.t = upward;
  }
  setOrtho(t, b, l, r, n, f) {}
  setPerspective(position, lookAt, upward) {}
}

export default Camera