import { read } from "../src/Geometry/utils";
import { readFileSync } from "fs";
describe("model", () => {
    it("request", () => {
        const cube = readFileSync("public/model/cube.obj");
    });
});
