import { Object3D } from "./Object3D.js";

export async function read(path) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (req.readyState === 4 && req.status !== 404) {
        resolve(req.responseText);
      }
    };
    req.open("GET", path, true);
    req.send();
  });
}

export async function parseObjFile(path, name) {
  return new Promise(async (resolve, reject) => {
    const content = await read(path + "/" + name);
    const objDoc = new Object3D(path);
    const result = await objDoc.parse(content);
    resolve(result);
  });
}
