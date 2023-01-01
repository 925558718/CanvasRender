import Engine from "./utils/engine.js";

const eng = new Engine("canvas", {
  antialias: "None",
  coordinateSystem: "3D",
  Z_Buffer: true,
});

//eng.render.drawTriangle([0, 10], [300, 10], [150, 150]);
eng.render.fillTriangle(
  [-100, 0, 0],
  [0, 0, 0],
  [-50, 150, 0],
  [1, 0, 0, 1],
  [0, 1, 0, 1],
  [0, 0, 1, 1]
);
eng.render.drawCube(30, 30, 30, [1, 0, 0, 1]);
//eng.render.drawLine([0, 0, 0], [-100, 50, 0]);
eng.processBuffer();
