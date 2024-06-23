import { readFileSync } from "fs";
import { Vector } from "../src/Math/Vector.js";
import { barycentric } from "../src/Math/MathUtils.js";

describe("texture", () => {
    it("interpolation texture", () => {
        let p1 = new Vector(449.5, 149.5);
        let p2 = new Vector(149.5, 449.5);
        let p3 = new Vector(149.5, 149.5);
        let t1 = new Vector(0.5, 0.5);
        let t2 = new Vector(0, 0);
        let t3 = new Vector(0, 0.5);

        const [i1, i2, i3] = barycentric(p1, p2, p3, new Vector(150, 150));
        expect(i1 !== false).toBeTruthy();
        const [o1, o2, o3] = barycentric(p1, p2, p3, new Vector(151, 150));
        expect(o1 !== false).toBeTruthy();
        const [s1, s2, s3] = barycentric(p1, p2, p3, new Vector(150, 151));
        expect(s1 !== false).toBeTruthy();
        const nt1 = t1
            .multiplyScalar(i1)
            .add(t2.multiplyScalar(i2))
            .add(t3.multiplyScalar(i3));
        const nt2 = t1
            .multiplyScalar(o1)
            .add(t2.multiplyScalar(o2))
            .add(t3.multiplyScalar(o3));
        const nt3 = t1
            .multiplyScalar(s1)
            .add(t2.multiplyScalar(s2))
            .add(t3.multiplyScalar(s3));
    });
});
