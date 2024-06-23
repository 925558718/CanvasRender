import { read } from "../src/Geometry/utils";
import { readFileSync } from "fs";
describe("model", () => {
  it("request", () => {
    const cube = readFileSync("model/cube.obj");
    console.log(cube);
  });
});
