export class VectorBase extends MatrixBase {
    constructor(input = [1]) {
      super(1, 1);
      this.dimension = input.length;
    }
    dot(b) {}
    cross(b) {}
}