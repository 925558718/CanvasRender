import Render from "../Render/index";
import Scene from "../Scene.js";
import {Matrix} from "../Math/Matrix.js";
import {Vector} from "../Math/Vector.js";
import Camera from "../Camera/index.js";
import Texture from "../Texture.js";

class Engine {
    constructor(dom, options) {
        const {
            antialias = "None",
            sampleType = 1,
            light = 'direction',
            shadow = 'pcss'
        } = options;
        this.canvas = dom;
        this.time = 0;
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.shadowBuffer = []
        this.buffer = [];
        this.render = new Render(this.ctx, this.buffer, {
            height: this.height,
            width: this.width,
            antialias,
            sampleType:1,
            light,
            shadow
        });
        this.viewPortMatrix = new Matrix([
            this.width / 2,
            0,
            0,
            (this.width - 1) / 2,
            0,
            this.height / 2,
            0,
            (this.height - 1) / 2,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1,
        ]);
        this.shadowWidth = 2048;
        this.shadowViewPort = new Matrix([
            this.shadowWidth / 2,
            0,
            0,
            (this.shadowWidth - 1) / 2,
            0,
            this.shadowWidth / 2,
            0,
            (this.shadowWidth - 1) / 2,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1,
        ]);
        this.render.viewPortMatrix = this.viewPortMatrix
    }

    renderTrick(scene, options) {
        if (scene instanceof Scene) {
            const {cam} = scene
            if (!this.render.scene) {
                this.render.scene = scene;
                cam.calcMatrixStack(this.viewPortMatrix)
            }
            const culledObjs = scene.getObject()
            console.log(cam)
            options.shadow !== 'None' && this.genShadowMap(scene)
            for (let i = 0; i < culledObjs.length; i++) {
                culledObjs[i].obj.transform(scene.cam.transformStack, this.viewPortMatrix)
            }
            for (let i = 0; i < scene.lights.length; i++) {
                if (scene.lights[i].type === 'ambient') continue
                scene.lights[i].transform(cam.transformStack[0])
            }
            this.primitiveMerge(culledObjs, scene.lights);
        }
        //this.traverseTree(scene.bvh.root, objects)
    }

    frustumCull(camera, objs) {
        let res = []
        for (let i = 0; i < objs.length; i++) {
            let j = 0;
            for (; j < camera.frustum.length; j++) {
                if (!objs[i].root.boundingVolume.inner(camera.frustum[j])) break;
            }
            if (j === 6) {
                res.push(objs[i])
            }
        }
        return res;
    }

    primitiveMerge(objs, lights, mode = '') {
        for (let i = 0; i < objs.length; i++) {
            const obj = objs[i].obj;
            for (let j = 0; j < obj.faces.length; j++) {
                const face = obj.faces[j];
                const m = obj.mtls.get(face.Material);
                let screens = []
                let origins = []
                let textures = []
                let normals = []
                for (let f = 0; f < face.length; f++) {
                    for (let item = 0; item < face[f].length; item++) {
                        switch (item) {
                            case 0:
                                screens.push(obj.screenPositions[face[f][0] - 1])
                                origins.push(obj.camCo[face[f][0] - 1])
                                break;
                            case 1:
                                textures.push(obj.textures[face[f][1] - 1])
                                break;
                            case 2:
                                normals.push(obj.camNormal[face[f][2] - 1])
                        }
                    }
                }
                if (normals.length === 0) {
                    const p2 = obj.camCo[face[2][0] - 1];
                    const p1 = obj.camCo[face[1][0] - 1];
                    const p0 = obj.camCo[face[0][0] - 1];
                    const p01 = p1.minus(p0);
                    const p02 = p2.minus(p0);
                    const normal = p01.cross(p02).normalize();
                    normals = new Array(screens.length).fill(normal);
                }

                if (normals[0].dot(new Vector(0, 0, 1, 1)) <= 0) continue
                this.render.drawMesh(screens, normals, origins, textures, m, lights)
            }
        }
        this.render.drawCall()
    }

    traverseTree(root, out) {
        let stack = [root]
        while (stack.length) {
            let t = stack.pop();
            for (let i = 0; i < t.children.length; i++) {
                if (t.children[i].length) {
                    stack.push(t.children[i])
                } else {
                    out.push(t.children[i].volume.object)
                }
            }
        }

    }

    clear(color) {
        this.render.clearBuffer(color);
    }

    Loop(trickFn) {
        this.time += 1 / 60
        requestAnimationFrame(() => {
            trickFn(this.time);
            this.Loop(trickFn);
        });
    }

    genShadowMap(scene) {
        const camera = new Camera(0, 5, 0, 0, 0, 0, 0, 0, 1);
        camera.setOrtho(5, -5, -5, 5, -0.1, -10, 'ort')
        camera.calcMatrixStack(this.shadowViewPort)
        scene.shadowCam.push(camera)
        const culledObjs = scene.getObject()
        for (let i = 0; i < culledObjs.length; i++) {
            culledObjs[i].obj.transform(camera.transformStack, this.shadowViewPort, 'shadow')
        }
        let zBuffer = new Float32Array(this.shadowWidth * this.shadowWidth).fill(1)
        for (let i = 0; i < culledObjs.length; i++) {
            const obj = culledObjs[i].obj;
            for (let j = 0; j < obj.faces.length; j++) {
                const face = obj.faces[j]
                let mesh = []
                let ori = []
                for (let f = 0; f < face.length; f++) {
                    mesh.push(obj.shadowScreenPositions[face[f][0] - 1])
                    ori.push(obj.shadowCamCo[face[f][0] - 1])
                }
                for (let l = 2; l < mesh.length; l++) {
                    this.render.shade(mesh[0], mesh[l - 1], mesh[l], ori[0], ori[l - 1], ori[l], ['shadow', zBuffer, this.shadowWidth])
                }
            }
        }
        let shadowTexture = new Texture(zBuffer, this.shadowWidth, this.shadowWidth, 1, 'pos','linear')
        this.render.grey.push(shadowTexture)
        //test minimap
        const canvas2 = document.getElementById('gray')
        const ctx2 = canvas2.getContext('2d')
        let len = this.shadowWidth;
        canvas2.width = len;
        canvas2.height = len;
        const buffer = ctx2.createImageData(len, len);
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len; j++) {
                let pos = i * len * 4 + j * 4
                const grey = zBuffer[i * len + j]
                buffer.data[pos] = grey * 255
                buffer.data[pos + 1] = grey * 255
                buffer.data[pos + 2] = grey * 255
                buffer.data[pos + 3] = 255
            }
        }
        ctx2.putImageData(buffer, 0, 0)
    }
}

export default Engine;
