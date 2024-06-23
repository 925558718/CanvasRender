export class Matrix {
  constructor(input = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]) {
    if ((Array.isArray(input) && input.length !== 16))
      throw Error("please input a array,it's length must be 16");
    this.ncol = 4;
    this.nrow = 4;
    if (Array.isArray(input)) {
      this.ele = input;
    } else {
      let arr = new Array(this.ncol * this.nrow).fill(0);
      for (let i = 0; i < this.nrow; i++) {
        arr[i * this.ncol + i] = 1;
      }
      this.ele = arr;
    }
  }
  find(row, column) {
    return this.ele[column + row * this.ncol];
  }
  set(row, column, value) {
    this.ele[column + row * this.ncol] = value;
  }

  multiplyScalar(t) {
    for (let i = 0; i < this.ele.length; i++) {
      this.ele[i] *= t;
    }
    return this;
  }
  look() {
    console.log("--------------");
    for (let i = 0; i < this.nrow; i++) {
      let str = "-";
      for (let j = 0; j < this.ncol; j++) {
        str += this.ele[i * this.ncol + j] + " ";
      }
      console.log(str);
    }
  }

  add(m) {
    for (let i = 0; i < this.ele.length; i++) {
      this.ele[i] += m.ele[i];
    }
    return this;
  }

  minus(m) {
    return this.add(m.multiplyScalar(-1));
  }

  multiply(m) {
    if (!(m instanceof Matrix)) throw Error("please input a matrix");
    let res = [];
    for (let j = 0; j < this.nrow; j++) {
      for (let k = 0; k < m.ncol; k++) {
        let sum = 0;
        for (let p = 0; p < this.ncol; p++) {
          sum += m.find(p, k) * this.find(j, p);
        }
        res.push(sum);
      }
    }
    return new Matrix(res);
  }
  transpose() {
    if (this.ncol !== 1 || this.nrow !== 1) {
      let res = [];
      for (let i = 0; i < this.ncol; i++) {
        for (let j = 0; j < this.nrow; j++) {
          res.push(this.find(j, i));
        }
      }

      return new Matrix(res);
    }
    return new Matrix();
  }
  translate(x, y = 0, z = 0) {
    const translateMatrix = new Matrix([
      1,
      0,
      0,
      x,
      0,
      1,
      0,
      y,
      0,
      0,
      1,
      z,
      0,
      0,
      0,
      1,
    ]);
    return translateMatrix.multiply(this);
  }
  scale(x = 1, y = 1, z = 1) {
    const scaleMatrix = new Matrix([
      x,
      0,
      0,
      0,
      0,
      y,
      0,
      0,
      0,
      0,
      z,
      0,
      0,
      0,
      0,
      1,
    ]);
    return scaleMatrix.multiply(this);
  }
  rotate(a, mode = "x") {
    let angle = (a / 180) * Math.PI;
    const rotateMatrix = new Matrix();
    if (mode === "x") {
      rotateMatrix.set(1, 1, +Math.cos(angle).toFixed(8));
      rotateMatrix.set(1, 2, +-Math.sin(angle).toFixed(8));
      rotateMatrix.set(2, 1, +Math.sin(angle).toFixed(8));
      rotateMatrix.set(2, 2, +Math.cos(angle).toFixed(8));
    } else if (mode === "y") {
      rotateMatrix.set(0, 0, +Math.cos(angle).toFixed(8));
      rotateMatrix.set(0, 2, +Math.sin(angle).toFixed(8));
      rotateMatrix.set(2, 0, +-Math.sin(angle).toFixed(8));
      rotateMatrix.set(2, 2, +Math.cos(angle).toFixed(8));
    } else {
      rotateMatrix.set(0, 0, +Math.cos(angle).toFixed(8));
      rotateMatrix.set(0, 1, +-Math.sin(angle).toFixed(8));
      rotateMatrix.set(1, 0, +Math.sin(angle).toFixed(8));
      rotateMatrix.set(1, 1, +Math.cos(angle).toFixed(8));
    }
    return rotateMatrix.multiply(this);
  }
  reverse(mode = 1) {
    let rev = new Matrix();
    let copy = [].concat(this.ele);
    if (mode === 1) {
      // 高斯消元法
      for (let i = 0; i < this.nrow; i++) {
        if (copy[i * this.ncol + i] !== 0) {
          for (let j = i + 1; j < this.nrow; j++) {
            if (copy[j * this.ncol + i] !== 0) {
              let times = -(copy[j * this.ncol + i] / copy[i * this.ncol + i]);
              for (let k = 0; k < this.ncol; k++) {
                copy[j * this.ncol + k] += times * copy[i * this.ncol + k];
                rev.ele[j * this.ncol + k] +=
                  times * rev.ele[i * this.ncol + k];
              }
            }
          }
        } else {
          let j = i + 1;
          for (; j < this.nrow; j++) {
            if (copy[j * this.ncol + i] !== 0) {
              break;
            }
          }
          if (j === this.nrow) {
            throw Error("this matrix can't be reversed");
          }
          for (let k = 0; k < this.ncol; k++) {
            let temp = copy[i * this.ncol + k];
            copy[i * this.ncol + k] = copy[j * this.ncol + k];
            copy[j * this.ncol + k] = temp;

            let temp2 = rev.ele[i * this.ncol + k];
            rev.ele[i * this.ncol + k] = rev.ele[j * this.ncol + k];
            rev.ele[j * this.ncol + k] = temp2;
          }
        }
      }
      for (let i = this.nrow - 1; i > 0; i--) {
        for (let j = i - 1; j >= 0; j--) {
          if (copy[j * this.ncol + i] !== 0) {
            let times = -(copy[j * this.ncol + i] / copy[i * this.ncol + i]);
            copy[j * this.ncol + i] = 0;
            for (let k = 0; k < this.ncol; k++) {
              rev.ele[j * this.ncol + k] += times * rev.ele[i * this.ncol + k];
            }
          }
        }
      }
      for (let i = 0; i < this.nrow; i++) {
        let times = 1 / copy[i * this.ncol + i];
        for (let k = 0; k < this.ncol; k++) {
          rev.ele[i * this.ncol + k] *= times;
        }
      }
    } else if (mode === 2) {
      // lu分解
    }
    for (let i = 0; i < rev.ele.length; i++) {
      rev.ele[i] = +rev.ele[i].toFixed(8);
    }
    return rev;
  }
  det(mode = 1) {
    if (mode === 1) {
      let sum = 0;
      let visit = new Array(this.ncol).fill(false);
      let calcDet = function (ori, level, visit, product, out) {
        if (level === ori.nrow) {
          let count = 0;
          for (let i = out.length - 1; i > 0; i--) {
            for (let j = i - 1; j >= 0; j--) {
              if (out[j] > out[i]) count++;
            }
          }
          if (count % 2 !== 0) product = -product;
          sum += product;
          return;
        }
        // 大公式
        for (let i = 0; i < ori.ncol; i++) {
          if (visit[i] || ori.ele[level * ori.ncol + i] === 0) continue;
          visit[i] = true;
          product *= ori.ele[level * ori.ncol + i];
          calcDet(ori, level + 1, visit, product, out.concat(i));
          visit[i] = false;
        }
      };
      calcDet(this, 0, visit, 1, []);
      return sum;
    }
  }
}
