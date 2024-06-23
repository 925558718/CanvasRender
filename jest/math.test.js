import { Matrix } from "../src/Math/Matrix";
import { Vector } from "../src/Math/Vector";
import { barycentric } from "../src/Math/MathUtils";
import { SphereBoundingVolume } from "../src/dataStructure/Bvh";
import Ray from "../src/Ray.js";

describe("test matrix", () => {
    it("init matrix ", () => {
        const m1 = new Matrix();
        expect(m1.ele).toEqual([
            1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
        ]);

        expect(() => {
            const m3 = new Matrix([1, 2, 3, 4, 5, 6, 7]);
        }).toThrow();
    });
    it("multyply", () => {
        const pro = new Matrix(
            4,
            [10, 0, 0, 0, 0, 10, 0, 0, 0, 0, 110, -1000, 0, 0, 1, 0]
        );
        const orj = new Matrix(
            4,
            [
                0.1, 0, 0, -0, 0, 0.1, 0, -0, 0, 0, 0.022222222222222223,
                1.2222222222222223, 0, 0, 0, 1,
            ]
        );
        expect(pro.multiply(orj).ele).toEqual([
            1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
        ]);
    });

    it("reverse", () => {
        const m1 = new Matrix([
            10, 0, 0, 0, 0, 10, 0, 0, 0, 0, 110, -1000, 0, 0, 1, 0,
        ]);
        expect(m1.reverse().multiply(m1).ele).toEqual([
            1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
        ]);
    });
    it("set", () => {
        const m1 = new Matrix([1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4]);
        m1.set(0, 0, 9);
        expect(m1.ele).toEqual([
            9, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4,
        ]);
    });
    it("find", () => {
        const m = new Matrix([1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4]);
        expect(m.find(1, 2)).toBe(2);
    });
    it("translate", () => {
        const v1 = new Vector(0, 0, 0, 1);
        const m = new Matrix(4);
        expect(v1.multiply(m.translate(2, 2, 2))).toEqual(
            new Vector(2, 2, 2, 1)
        );
    });
    it("scale", () => {
        const v1 = new Vector(1, 1, 1, 1);
        const m = new Matrix(4);
        expect(v1.multiply(m.scale(2, 2, 2))).toEqual(new Vector(2, 2, 2, 1));
    });
    it("rotate", () => {
        const v1 = new Vector(1, 0, 0, 1);
        const m = new Matrix(4);
        expect(v1.multiply(m.rotate(90, "z"))).toEqual(new Vector(0, 1, 0, 1));
        expect(v1.multiply(m.rotate(90, "y"))).toEqual(new Vector(0, 0, -1, 1));
        expect(v1.multiply(m.rotate(90, "x"))).toEqual(new Vector(1, 0, 0, 1));
    });
});

describe("vector", () => {
    it("vector add", () => {
        let a = new Vector(1, 1, 3, 1);
        let b = new Vector(2, 2, 4, 1);
        expect(a.add(b)).toEqual(new Vector(3, 3, 7, 1));
    });
    it("vector length", () => {
        let a = new Vector(1, 1, 3);
        expect(a.len()).toBe(Math.sqrt(11));
    });
    it("vector scalar", () => {
        let a = new Vector(1, 1, 3);
        expect(a.multiplyScalar(2)).toEqual(new Vector(2, 2, 6, 0));
    });
    it("vector dot", () => {
        let a = new Vector(1, 1, 3);
        let b = new Vector(2, 2, 4);
        expect(a.dot(b)).toBe(16);
    });
    it("vector cross", () => {
        let a = new Vector(1, 1, 3);
        let b = new Vector(2, 2, 4);
        expect(a.cross(b)).toEqual(new Vector(-2, 2, 0, 0));
    });
    it("vector multiply matrix", () => {
        const v1 = new Vector(-1, -1, 1, 1);
        const m = new Matrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -3, 0, 0, 0, 1]);
        expect(v1.multiply(m)).toEqual(new Vector(-1, -1, -2, 1));
    });
    it("normalize", () => {
        let a = new Vector(2, 4, 3);
        expect(a.normalize().len()).toEqual(1);
    });
});

describe("geometry", () => {
    it("in trangle", () => {
        let p1 = new Vector(299.5, 299.5, 0);
        let p2 = new Vector(209.5, 299.5, 0);
        let p3 = new Vector(254.5, 599.5, 0);
        let p = new Vector(254.5, 599.5, 0);
        const res = barycentric(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p.x, p.y);
        expect(res[0] >= 0 && res[1] >= 0 && res[2] >= 0).toBe(true);
    });

    it("sphere intersection ray", () => {
        const bound = new SphereBoundingVolume([]);
        bound.info = new Vector(0, 0, 0);
        bound.distance = 3;
        let ray = new Ray(0, 0, 3.0, 0, 0, 1);
        const res = bound.intersection(ray);
        expect(!!res).toBe(true);
    });
});
