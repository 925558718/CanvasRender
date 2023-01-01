import { Matrix3 } from "../utils/math.js";

describe("test matrix3", () => {
  test("test matrix3 rotate", () => {
    const m3 = new Matrix3();
    expect(m3.eliminate().ele).toEqual(
      new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])
    );
  });
  test("test matrix3 translate", () => {
    const m3 = new Matrix3();
    expect(m3.eliminate().ele).toEqual(
      new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])
    );
  });
  test("test matrix3 scale", () => {
    const m3 = new Matrix3();
    expect(m3.eliminate().ele).toEqual(
      new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])
    );
  });
});
