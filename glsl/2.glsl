float rectSdf (vec2 uv) {
    return max(abs(uv.x),abs(uv.y))-0.1;
}

float sphere (vec2 uv) {
    return distance(uv,vec2(0.1,0.1)) - 0.1;
}

float sdf (vec2 uv) {
    float w = 1.0 / iResolution.y;
    float d = min(rectSdf(uv),sphere(uv));
    return smoothstep(w,-w,d);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ){

        vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
        vec3 col = vec3(0.0);
        col = mix(col,vec3(1.0,0.0,1.0),sdf(uv));
        fragColor = vec4(col,1.0);

}