import {AABBBoundingVolume, SphereBoundingVolume} from "./Bvh.js";

export default class BvhTree {
    constructor(obj) {
        this.obj = obj
        this.limit = 1
        this.root = obj
    }

    buildBvhTree(vertices, faces, axis) {
        if (faces.length <= this.limit) {
            return new BvhTreeNode(vertices, faces, true)
        }
        const axisIndex = axis % 3;
        const node = new BvhTreeNode(vertices, faces)
        let leftFaces = []
        let rightFaces = []
        let min = Number.MAX_VALUE
        let max = -Number.MAX_VALUE
        for (let i = 0; i < faces.length; i++) {
            for (let j = 0; j < faces[i].length; j++) {
                min = Math.min(vertices[faces[i][j][0] - 1][axisIndex], min)
                max = Math.max(vertices[faces[i][j][0] - 1][axisIndex], max)
            }
        }
        let mid = (min + max) / 2;
        for (let i = 0; i < faces.length; i++) {
            let meshMin = Number.MAX_VALUE
            let meshMax = -Number.MAX_VALUE
            for (let j = 0; j < faces[i].length; j++) {
                meshMin = Math.min(vertices[faces[i][j][0] - 1][axisIndex], meshMin)
                meshMax = Math.max(vertices[faces[i][j][0] - 1][axisIndex], meshMax)
            }
            let meshMid = (meshMin + meshMax) / 2;
            if (meshMid < mid) {
                leftFaces.push(faces[i])
            } else if (meshMid > mid) {
                rightFaces.push(faces[i])
            } else {
                if (leftFaces.length < rightFaces.length) {
                    leftFaces.push(faces[i])
                } else {
                    rightFaces.push(faces[i])
                }
            }
        }
        node.left = this.buildBvhTree(vertices, leftFaces, axis + 1)
        node.right = this.buildBvhTree(vertices, rightFaces, axis + 1)
        return node;
    }
}

function BvhTreeNode(vertices, faces, isLeaf=false) {
    let v = new Set()
    for (let i = 0; i < faces.length; i++) {
        for (let j = 0; j < faces[i].length; j++) {
            v.add(vertices[faces[i][j][0] - 1])
        }
    }
    this.boundingVolume = new SphereBoundingVolume([...v])
    this.faces = faces;
    this.leaf = isLeaf
    this.left = null;
    this.right = null;
}

