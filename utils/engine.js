import {
  drawCoordinateSystem,
  drawLine,
  drawPoint,
  renderBuffer,
} from "./render";

class Engine {
  constructor(canvasClassName) {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.buffer = new Array(this.width * this.height);
    this.ctx.translate(300, 300);
    this.ctx.scale(1, -1);
  }
  render() {
    requestAnimationFrame(() => {
      this.render();
      renderBuffer(this.ctx, this.buffer, this.height, this.width);
    });
  }
  enableCoordinateSystem() {
    drawCoordinateSystem(this.ctx, this.canvas);
  }
}

export default Engine;
