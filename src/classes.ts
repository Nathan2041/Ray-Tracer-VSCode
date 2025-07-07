export class Point2D {
  public u: number;
  public v: number;

  constructor(
    u: number,
    v: number
  ) {
    this.u = u;
    this.v = v;
  }
}

export class Point3D {
  public x: number;
  public y: number;
  public z: number;
  public textureCoords: Point2D;
  public normal: Point3D;
  public color: { r: number; g: number; b: number; a: number };
  public materialName: string;
  public originalIndex: number;

  private static readonly DEFAULT_NORMAL = { x: 0, y: 0, z: 0 } as Point3D;

  constructor(
    x: number,
    y: number,
    z: number,
    textureCoords?: Point2D,
    normal?: Point3D,
    color?: { r: number; g: number; b: number; a: number },
    materialName?: string,
    originalIndex?: number
  ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.textureCoords = textureCoords || new Point2D(0, 0);
    this.normal = normal ?? Point3D.DEFAULT_NORMAL;
    this.color = color || { r: 255, g: 255, b: 255, a: 255 };
    this.materialName = materialName || '';
    this.originalIndex = originalIndex || -1;
  }
}

export class Triangle {
  public vertex1: Point3D;
  public vertex2: Point3D;
  public vertex3: Point3D;
  public materialName: string;
  public smoothingGroup: number;

  constructor(
    vertex1: Point3D,
    vertex2: Point3D,
    vertex3: Point3D,
    materialName?: string,
    smoothingGroup?: number
  ) {
    this.vertex1 = vertex1;
    this.vertex2 = vertex2;
    this.vertex3 = vertex3;
    this.materialName = materialName || '';
    this.smoothingGroup = smoothingGroup || 0;
  }
}

export class MTLData {
  public name: string;
  public illumination: number;
  public dissolve: number;
  public opticalDensity: number;
  public specularShininess?: number;

  public ambientColor: { r: number; g: number; b: number };
  public diffuseColor: { r: number; g: number; b: number };
  public specularColor: { r: number; g: number; b: number };
  public emissiveColor: { r: number; g: number; b: number };

  public ambientTextureURL?: string;
  public diffuseTextureURL?: string;
  public specularTextureURL?: string;
  public dissolveTextureURL?: string;

  public ambientTexture: Point3D[][] | undefined;
  public diffuseTexture: Point3D[][] | undefined;
  public specularTexture: Point3D[][] | undefined;
  public dissolveTexture: Point3D[][] | undefined;
  
  constructor(
    name: string,
    illumination: number,
    dissolve: number,
    opticalDensity: number,
    specularShininess: number | undefined,
    ambientColor: { r: number; g: number; b: number },
    diffuseColor: { r: number; g: number; b: number },
    specularColor: { r: number; g: number; b: number },
    emissiveColor: { r: number; g: number; b: number },
    ambientTextureURL?: string,
    diffuseTextureURL?: string,
    specularTextureURL?: string,
    dissolveTextureURL?: string
  ) {
    this.name = name;
    this.illumination = illumination;
    this.ambientColor = ambientColor;
    this.dissolve = dissolve;
    this.opticalDensity = opticalDensity;
    this.specularShininess = specularShininess ?? 0;

    this.diffuseColor = diffuseColor;
    this.specularColor = specularColor;
    this.emissiveColor = emissiveColor;

    this.ambientTextureURL = ambientTextureURL ?? '';
    this.diffuseTextureURL = diffuseTextureURL ?? '';
    this.specularTextureURL = specularTextureURL ?? '';
    this.dissolveTextureURL = dissolveTextureURL ?? '';

    this.ambientTexture = [[]];
    this.diffuseTexture = [[]];
    this.specularTexture = [[]];
    this.dissolveTexture = [[]];
  }

  // illum <value> = illumination model number
    // 0 = color on and ambient off
    // 1 = color on and ambient on
    // 2 = highlight on
    // 3 = reflection on and ray trace on
    // 4 = transparency: glass on, reflection: ray trace on
    // 5 = reflection: Fresnel on, ray trace on
    // 6 = transparency: refraction on, reflection: Fresnel off, ray trace on
    // 7 = transparency: refraction on, reflection: Fresnel on, ray trace on
    // 8 = reflection on, ray trace off
    // 9 = transparency: glass on, reflection: ray trace off
    // 10 = casts shadows onto invisible surfaces
}


export class OBJData {
  public points: Point3D[];
  public triangles: Triangle[];

  constructor(
    points: Point3D[] = [],
    triangles: Triangle[] = []
  ) {
    this.points = points;
    this.triangles = triangles;
  }
}