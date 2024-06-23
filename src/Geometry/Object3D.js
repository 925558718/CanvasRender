import {Vector} from "../Math/Vector";
import {read} from "./utils.js";
import Material from "../Material.js";
import {Matrix} from "../Math/Matrix.js";
import Texture from "../Texture.js";
import Color from "../Color.js";
import {SphereBoundingVolume} from "../dataStructure/Bvh.js";

export const ObjectType = {
    LINE: "line",
    POINT: "point",
    TRIANGLE: "triangle",
};

export class Object3D {
    constructor(path, vertices = [], normals = [], textures = [], faces = []) {
        this.fileName = "model";
        this.mtls = new Map();
        this.vertices = [...vertices];
        this.normals = [...normals];
        this.textures = [...textures];
        this.faces = [...faces];
        this.camCo = []
        this.camNormal = []
        this.screenPositions = [];
        this.shadowScreenPositions = []
        this.shadowCamCo = []
        this.path = path;
        this.transformMatrix = new Matrix()
        this.currentMaterialName = "";
    }

    transform(cameraMatrix, viewPortMatrix, mode) {
        if (mode === 'shadow') {
            for (let i = 0; i < this.vertices.length; i++) {
                const vertex = new Vector(...this.vertices[i], 1)
                this.shadowScreenPositions[i] = vertex.multiply(this.transformMatrix).multiply(cameraMatrix[1]).multiply(cameraMatrix[2]).multiply(viewPortMatrix)
                this.shadowCamCo[i] = vertex.multiply(this.transformMatrix).multiply(cameraMatrix[1]);
            }
            return
        }
        for (let i = 0; i < this.vertices.length; i++) {
            const vertex = new Vector(...this.vertices[i], 1);
            this.screenPositions[i] = vertex.multiply(this.transformMatrix).multiply(cameraMatrix[1]).multiply(cameraMatrix[2]).hNormalize().multiply(viewPortMatrix);
            this.camCo[i] = vertex.multiply(this.transformMatrix).multiply(cameraMatrix[1]);
        }
        for (let i = 0; i < this.normals.length; i++) {
            const normal = new Vector(...this.normals[i]);
            this.camNormal[i] = normal.multiply((cameraMatrix[2].multiply(cameraMatrix[1].multiply(this.transformMatrix))).reverse().transpose()).hNormalize().normalize();
        }
    }

    scale(x, y, z) {
        this.transformMatrix = this.transformMatrix.scale(x, y, z);
    }

    rotate(angle, axis) {
        this.transformMatrix = this.transformMatrix.rotate(angle, axis)
    }

    translate(x, y, z) {
        this.transformMatrix = this.transformMatrix.translate(x, y, z)
    }

    async parse(content) {
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
            if (!lines[i]) continue;
            const term = lines[i].split(" ");
            switch (term[0]) {
                case "v":
                    this.vertices.push([+term[1], +term[2], +term[3]]);
                    break;
                case "vt":
                    this.textures.push([+term[1], +term[2]]);
                    break;
                case "vn":
                    this.normals.push([+term[1], +term[2], +term[3]]);
                    break;
                case "f":
                    const points = term.slice(1).map(item => item.split('/').map(Number))
                    points.Material = this.currentMaterialName
                    this.faces.push(points)
                    break;
                case "mtllib":
                    const mtlContent = await read(this.path + "/" + term[1]);
                    this.parseMaterialFile(mtlContent);
                    break;
                case "usemtl":
                    this.currentMaterialName = term[1];
                    break;
                case "o":
                    this.fileName = term[1];
            }
        }
        return this;
    }

    async parseMaterialFile(content) {
        const lines = content.split("\n");
        let currentMaterial = null;
        let currentMaterialName = "";
        for (let i = 0; i < lines.length; i++) {
            const term = lines[i].split(" ");
            if (term.length === 0) continue;
            switch (term[0]) {
                case "newmtl":
                    if (currentMaterial) {
                        this.mtls.set(currentMaterialName, currentMaterial);
                    }
                    if (!this.currentMaterialName) this.currentMaterialName = term[1]
                    currentMaterial = new Material();
                    currentMaterialName = term[1];
                    break;
                case "Ka":
                    currentMaterial.Ka = new Vector(...term.slice(1).map(Number));
                    break;
                case "Kd":
                    currentMaterial.Kd = new Vector(...term.slice(1).map(Number));
                    break;
                case "Ks":
                    currentMaterial.Ks = new Vector(...term.slice(1).map(Number));
                    break;
                case "Ke":
                    currentMaterial.Ke = term.slice(1).map(Number);
                    break;
                case "Ns":
                    currentMaterial.Kd = +term[1];
                    break;
                case "Ni":
                    currentMaterial.Kd = +term[1];
                    break;
                case "d":
                    currentMaterial.d = +term[1];
                    break;
                case "illum":
                    currentMaterial.illum = +term[1];
                    break;
                case "map_Kd":
                    const img = new Image()
                    img.src = this.path + "/" + term[1]
                    img.onload = function (e) {
                        const canvas = document.getElementById('readImg')
                        canvas.width = img.width
                        canvas.height = img.height
                        const ctx = canvas.getContext('2d')
                        ctx.drawImage(img, 0, 0)
                        const pixel = ctx.getImageData(0, 0, this.width, this.height).data
                        let res = new Float32Array(pixel.length)
                        for (let i = 0; i < img.width; i++) {
                            for (let j = 0; j < img.width; j++) {
                                const insertPosition = (img.width - i - 1) * img.width * 4 + j * 4
                                const position = i * img.width * 4 + j * 4
                                res[insertPosition] = pixel[position]
                                res[insertPosition + 1] = pixel[position + 1]
                                res[insertPosition + 2] = pixel[position + 2]
                                res[insertPosition + 3] = pixel[position + 3]
                            }
                        }
                        currentMaterial.map_Kd = new Texture(res, img.width, img.height)

                        //test minimap
                        // const data = currentMaterial.map_Kd.miniMap[3]
                        // const canvas2 = document.getElementById('writeImg')
                        // const ctx2 = canvas2.getContext('2d')
                        // let len=128;
                        // canvas2.width=len;
                        // canvas2.height=len;
                        // for (let j = 0; j < len; j++) {
                        //     for (let i = 0; i < len; i++) {
                        //         const p = i * len * 4 + j * 4
                        //         //console.log(`rgba(${data[p]},${data[p+1]},${data[p+2]},${data[p+3]})`)
                        //         ctx2.fillStyle = `rgba(${data[p]},${data[p + 1]},${data[p + 2]},${data[p + 3]})`;
                        //         ctx2.fillRect(i, j, 1, 1)
                        //     }
                        // }
                    }

            }
        }
        this.mtls.set(currentMaterialName, currentMaterial);
    }
}
