import { MatrixBase } from "../utils/math.js";

describe("test matrix", () => {
  it("init matrix ", () => {
    const m1 = new MatrixBase(3, 3);
    expect(m1.ele).toEqual([1, 0, 0, 0, 1, 0, 0, 0, 1]);

    const m2 = new MatrixBase(2, [1, 2, 3, 4, 5, 6]);
    expect(m2.nrow).toBe(3);
    expect(() => {
      const m3 = new MatrixBase(2, [1, 2, 3, 4, 5, 6, 7]);
    }).toThrow();
  });

  it("reverse", () => {
    const m1 = new MatrixBase(3, [2, -1, 0, -1, 2, -1, 0, -1, 2]);
    expect(m1.reverse().ele).toEqual([
      3 / 4,
      1 / 2,
      1 / 4,
      1 / 2,
      1,
      1 / 2,
      1 / 4,
      1 / 2,
      3 / 4,
    ]);
  });
});
