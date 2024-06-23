class Light {
    constructor(intensity, type, position) {
        this.position = position;
        this.intensity = intensity;
        this.type = type;
        this.tag = "light";
    }
}

const LightShadeModel = {
    LAMBERT: "Lambert",
    PHONG: "Phong",
    BLINN_PHONG: "Blinn-Phong",
};

export const LightType = {
    POINT_LIGHT: "point",
    AMBIENT_LIGHT: "ambient",
    DIRECTIONAL_LIGHT: "direction"
};

export class PointLight extends Light {
    constructor(intensity, position, color) {
        super(intensity, LightType.POINT_LIGHT, position);
        this.color = color;
        this.position = position
        this.camPositon = position
    }

    transform(m) {
        this.camPositon = this.position.multiply(m)
    }
}

export class DirectionalLight extends Light {
    constructor(intensity, color, direction) {
        super(intensity, LightType.DIRECTIONAL_LIGHT, direction);
        this.color = color;
    }

    transform(m) {
        this.position = this.position.multiply(m)
    }
}

export class AmbientLight extends Light {
    constructor(color) {
        super(1, LightType.AMBIENT_LIGHT);
        this.color = color;
    }
}
