import {Object3D} from "./Geometry/Object3D.js";
import BvhTree from "./dataStructure/BvhTree.js";

export default class Scene {
    constructor(type) {
        this.type = type
        this.lights = [];
        this.cam = null;
        this.group = []
        this.shadowCam = []
    }

    add(obj) {
        this.group.push(new BvhTree(obj))
    }

    addLight(light) {
        this.lights.push(light)
    }

    findNearObject(ray) {
        let nearest = Infinity
        let res = null;
        for (let i = 0; i < this.group.length; i++) {
            let z = this.group[i].root.boundingVolume.intersection(ray);
            if (z < nearest) {
                nearest = z;
                res = this.group[i]
            }
        }
        return res;
    }

    getObject() {
        return this.group
    }

    setCamera(cam) {
        this.cam = cam;
    }
}
