import sdk from "./src/index";
import {AmbientLight, DirectionalLight, PointLight} from "./src/Light/index.js";
import {parseObjFile} from "./src/Geometry/utils";
import {Vector} from "./src/Math/Vector.js";
import {Object3D} from "./src/Geometry/Object3D.js";

const canvas = document.getElementById("canvas");
const eng = new sdk.Engine(canvas, {
    antialias: "None",
    sampleType: 1
});
const camera = new sdk.Camera(-1, 3.5, 3.5, 0, 0, 0, 0, 1, 0);
camera.setPerspective(90, canvas.width / canvas.height, -.1, -10);
//camera.setOrtho(5, -5, -5, 5, -2, -4);

const scene = new sdk.Scene('bvh');

scene.addLight(new AmbientLight([.3, .3, .3]));
scene.addLight(new PointLight(1, new Vector(0, 3.5, 3.5,1), [1, 1, 1]))
scene.addLight(new DirectionalLight(1, [1, 1, 1], new Vector(-0, -1, 0)))
scene.setCamera(camera)
const options = {
    'antialias': 'None',
    'light': 'point',
    'shadow': 'shadow_map'
}

async function initScene(options) {
    const cube1 = await parseObjFile("model", "cube.obj");

    cube1.rotate(-150, 'y')
    cube1.translate(0, 0.58)
    cube1.scale(1.5, 1.5, 1.5)

    scene.add(cube1)
    setTimeout(() => {
        console.time()
        eng.renderTrick(scene, options);
        console.timeEnd()
    }, 100)
}


initScene(options);

document.getElementById('antialias-list').style.display = 'block'
document.getElementById('right').addEventListener('click', () => {

    initScene({a: 1})
})



