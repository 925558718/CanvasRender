export class MatrixBase {
    constructor(ncol = 1, secondParam) {
      if (
        Array.isArray(secondParam) &&
        (secondParam.length === 0 || secondParam.length % ncol !== 0)
      )
        throw Error("please input a array,it's length must be bigger than 1");
      this.ncol = ncol;
      if (Array.isArray(secondParam)) {
        this.nrow = secondParam.length / ncol;
        this.ele = secondParam;
      } else {
        this.nrow = secondParam;
  
        let arr = new Array(this.ncol * this.nrow).fill(0);
        for (let i = 0; i < this.nrow; i++) {
          arr[i * this.ncol + i] = 1;
        }
        this.ele = arr;
      }
    }
    get(row, column) {
      return this.ele[row + column * this.nrow];
    }
  
    multiply(m) {
      if (!(m instanceof MatrixBase)) throw Error("please input a matrix");
      if (this.ncol !== m.nrow)
        throw Error("matrix multiply must be m*n and n*p");
      let res = [];
      for (let j = 0; j < this.nrow; j++) {
        for (let k = 0; k < m.ncol; k++) {
          let sum = 0;
          for (let p = 0; p < this.ncol; p++) {
            sum += m.get(p, k) * this.get(j, p);
          }
          res.push(sum);
        }
      }
      return new MatrixBase(this.nrow, res);
    }
    transpose() {
      if (this.ncol !== 1 || this.nrow !== 1) {
        let res = [];
        for (let i = 0; i < this.ncol; i++) {
          for (let j = 0; j < this.nrow; j++) {
            res.push(this.get(j, i));
          }
        }
        return new MatrixBase(this.nrow, res);
      }
      return new MatrixBase(this.ele, this.nrow);
    }
    translate() {}
    scale() {}
    rotate() {}
  }
  
  export class SMatrix extends MatrixBase {
    constructor(n, input) {
      super(n, input || n);
    }
    reverse(mode = 1) {
      let rev = new MatrixBase(this.ncol, this.nrow);
      let copy = [].concat(this.ele);
      if (mode === 1) {
        // 高斯消元法
        for (let i = 0; i < this.nrow; i++) {
          if (copy[i * this.ncol + i] !== 0) {
            for (let j = i + 1; j < this.nrow; j++) {
              if (copy[j * this.ncol + i] !== 0) {
                let times = -(copy[j * this.ncol + i] / copy[i * this.ncol + i]);
                for (let k = 0; k < this.ncol; k++) {
                  console.log(
                    times * copy[i * this.ncol + k],
                    times,
                    copy[i * this.ncol + k]
                  );
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
    cofactor() {}
  }

  