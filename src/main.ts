import OBJFile from "obj-file-parser";
import MTLFile from "mtl-file-parser/src/MTLFile.ts";
import Image from 'image-js';

import { Point3D, Point2D, Triangle, MTLData, OBJData } from './classes';
import './style.css';
import variables from './variables.json';

interface RGBPixel {
  r: number;
  g: number;
  b: number;
}

type RGBMatrix = RGBPixel[][];
const MTLTEXTURES = ["ambientTexture", "diffuseTexture", "specularTexture", "dissolveTexture"];

import cubeOBJ from '/cube.obj?url&raw';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
ctx.fillStyle = variables.backgroundColor;

ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

const OBJFileContents: string = cubeOBJ;
const objFile: OBJFile = new OBJFile(OBJFileContents);
const outputOBJ: any = objFile.parse();

const vertices: Point3D[] = [];
for (const vertex of outputOBJ["models"][0]["vertices"]) { vertices.push(new Point3D(vertex["x"], vertex["y"], vertex["z"])) }

const triangles: Triangle[] = [];

const model = outputOBJ.models[0];

for (const face of model.faces) {
  if (face.vertices.length !== 3) { console.warn(`Face "${face.vertices}" does not have exactly 3 vertices, skipping...`) }
  
  const vertices: Point3D[] = [];
     
  for (let i = 0; i < 3; i++) {
    const faceVertex = face.vertices[i];
    const vertex = model.vertices[faceVertex.vertexIndex - 1];
    const textureCoord = model.textureCoords[faceVertex.textureCoordsIndex - 1];
    const vertexNormal = model.vertexNormals[faceVertex.vertexNormalIndex - 1];
    vertices.push(new Point3D(
      vertex.x,
      vertex.y,
      vertex.z,
      new Point2D(textureCoord?.u || 0, textureCoord?.v || 0),
      new Point3D(vertexNormal?.x || 0, vertexNormal?.y || 0, vertexNormal?.z || 0),
      undefined,
      face.material,
      faceVertex.vertexIndex - 1
    ));
  }
  
  triangles.push(new Triangle(vertices[0], vertices[1], vertices[2], face.material, face.smoothingGroup));
}

const MTLFiles: string[] = await Promise.all(
  outputOBJ.materialLibraries.map(async (filename: string) => {
    const url = `/${filename}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Could not load MTL file: ${url}`);
      return '';
    }
    return await response.text();
  })
);


const MTLFileContents: string[] = MTLFiles;
const typedMTLFiles: MTLFile[] = MTLFileContents.map(content => new MTLFile(content));
const outputMTL: any[] = typedMTLFiles.map(file => file.parse());

let objData: OBJData = new OBJData(
  vertices,
  triangles
);

let mtlData: MTLData[] = outputMTL.map((mtl) => {
  return new MTLData(
    mtl[0]["name"],
    mtl[0]["illum"],
    mtl[0]["dissolve"],
    mtl[0]["opticalDensity"],
    mtl[0]["specularShininess"] || undefined,
    { r: mtl[0]["Ka"]["red"], g: mtl[0]["Ka"]["green"], b: mtl[0]["Ka"]["blue"] },
    { r: mtl[0]["Kd"]["red"], g: mtl[0]["Kd"]["green"], b: mtl[0]["Kd"]["blue"] },
    { r: mtl[0]["Ks"]["red"], g: mtl[0]["Ks"]["green"], b: mtl[0]["Ks"]["blue"] },
    { r: mtl[0]["Ke"]["red"], g: mtl[0]["Ke"]["green"], b: mtl[0]["Ke"]["blue"] },
    mtl[0]["map_Ka"]["file"] || undefined,
    mtl[0]["map_Kd"]["file"] || undefined,
    mtl[0]["map_Ks"]["file"] || undefined,
    mtl[0]["map_d"]["file"] || undefined
  )
});

async function pngToRGBMatrix(pngData: Uint8Array | string): Promise<RGBMatrix> {
  try {
    const image = await Image.load(pngData);
    
    const width = image.width;
    const height = image.height;
    
    const rgbMatrix: RGBMatrix = [];
    
    const rgbImage = image.rgba8();
    
    for (let y = 0; y < height; y++) {
      const row: RGBPixel[] = [];
      
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;
        const data = rgbImage.data;
        
        const pixel: RGBPixel = {
          r: data[pixelIndex],
          g: data[pixelIndex + 1],
          b: data[pixelIndex + 2]
        };
        
        row.push(pixel);
      }
      
      rgbMatrix.push(row);
    }
    
    return rgbMatrix;
    
  } catch (error) {
    throw new Error(`Failed to convert PNG to RGB matrix: ${error}`);
  }
}

for (let i = 0; i < mtlData.length; i++) {
  // const mtl = mtlData[i];
  // import data
  // run data through pngToRGBMatrix
  // assign RGBMatrix to mtlData[i][MTLTEXTURES[j]]
}

console.log(JSON.stringify(mtlData));
//console.log(JSON.stringify(objData));
//console.log(JSON.stringify(triangles));

// shutting up the compiler
pngToRGBMatrix;
objData;
mtlData;
MTLTEXTURES;

// outputMTL
[
  [
    {
      "name":"Cube_Material",
      "illum":2,
      "Ka":{"method":"rgb","red":0,"green":0,"blue":0},
      "Kd":{"method":"rgb","red":0,"green":0,"blue":0},
      "Ks":{"method":"ks","red":0.5,"green":0.5,"blue":0.5},
      "Ke":{"method":"rgb","red":0,"green":0,"blue":0},
      "map_Ka":{},
      "map_Kd":{"file":"/public/broken_brick_wall_diff_4k.png"},
      "map_Ks":{},
      "map_d":{},
      "dissolve":1,
      "opticalDensity":1.45
      // "specularShininess": 0.0
    }
  ]
];

// mtlData
[
  {
    "name":"Cube_Material",
    "illumination":2,
    "dissolve":1,
    "opticalDensity":1.45,
    "specularShininess":0,
    "ambientColor":{"r":0,"g":0,"b":0},
    "diffuseColor":{"r":0,"g":0,"b":0},
    "specularColor":{"r":0.5,"g":0.5,"b":0.5},
    "emissiveColor":{"r":0,"g":0,"b":0},
    "ambientTextureURL":"",
    "diffuseTextureURL":"/public/broken_brick_wall_diff_4k.png",
    "specularTextureURL":"",
    "dissolveTextureURL":"",
    "ambientTexture":[[]],
    "diffuseTexture":[[]],
    "specularTexture":[[]],
    "dissolveTexture":[[]]
  }
];