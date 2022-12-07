class Matrix3 {

}

class Matrix4 {

}

export class Vector4 {
    constructor(...args) {


        this.wrap = [...args]
    }
}

export class Vector3 {

}

export class Vector2 {

}

export function calcLineValue(p0, p1, targetPoint) {
    const [p0x, p0y] = p0;
    const [p1x, p1y] = p1;
    const [tx, ty] = targetPoint
    return (p0y - p1y) * tx + (p1x - p0x) * ty + p0x * p1y - p1x * p0y
}

export function calcLineK(p0, p1) {
    const [p0x, p0y] = p0;
    const [p1x, p1y] = p1;
    return (p1y - p0y) / (p1x - p0x)
}

export function symmetryXY(p){
    return [p[1],p[0]]
}

export function symmetryMinusXY(p) {
    return [-p[1],-p[0]]
}

export function symmetryX(p) {
    return [p[0],-p[1]]
}

export function symmetryY(p) {
    return [-p[0],p[1]]
}