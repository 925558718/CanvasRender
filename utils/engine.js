import Render from "./render";

class Engine {
  constructor(canvasIdName, options) {
    const {
      antialias = "None",
      coordinateSystem = "None",
      Z_Buffer = false,
    } = options;
    this.canvas = document.getElementById(canvasIdName);
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.buffer = [];

    this.ctx.translate(this.width / 2, this.width / 2);
    this.ctx.scale(1, -1);
    this.render = new Render(this.ctx, this.buffer, {
      height: this.height,
      width: this.width,
      antialias: antialias,
      Z_Buffer: Z_Buffer,
    });
    if (coordinateSystem === "2D") {
      this.enableCoordinateSystem();
    }
  }
  processBuffer() {
    this.render.renderBuffer();
  }
  enableCoordinateSystem(mode = "2D") {
    if (mode === "2D") {
      this.render.drawLine(
        [-this.width / 2, 0, 0],
        [this.width / 2, 0, 0],
        [1, 0, 0, 1]
      );
      this.render.drawLine(
        [0, this.height / 2, 0],
        [0, -this.height / 2, 0, 0],
        [0, 1, 0, 1]
      );
    } else {
    }
  }
}

export default Engine;
