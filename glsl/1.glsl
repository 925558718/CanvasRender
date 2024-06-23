struct Cam {
    vec3 e,l,t;
    vec3 u,v,w;
    mat4 c;
}cam;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;


    cam.e = vec3(0,0,2.) + vec3(sin(iTime),0.,cos(iTime)) * 5.;
    cam.l = normalize(vec3(0.,0.,0.) - cam.e);
    cam.t = vec3(0,1,0);

    cam.w = normalize(-cam.l);
    cam.u = cross(cam.t,cam.w);
    cam.v = cross(cam.w,cam.u);
    cam.c = inverse(mat4(vec4(cam.u,0.),vec4(cam.v,0.),vec4(cam.w,0),vec4(cam.e,1.)));

    vec3 r = vec3(uv.x,uv.y,1);
    vec4 s = vec4(0.,0.,-3.,1.);
    vec3 o = vec3(0,0,0.) - s.xyz;

    float a = dot(r,r),b = 2.* dot(o,r),
    c= dot(o,o) - s.w*s.w,delta = b*b - 4.*a*c,k;

    fragColor = vec4(0);
    if(delta<0.) {
        return;
    }
    k=(-b-sqrt(delta)) / (2.*a);
    vec3 p = (vec4(k * r,0)).xyz;

    vec3 normal = normalize((vec4(((p-s.xyz)),0)).xyz);

    vec3 light = (cam.c * vec4(2,2,2,0)).xyz;

    vec3 ambient = vec3(.2,.2,.2);
    float len = length(light - p);
    vec3 lightDirection = -normalize(light - p);

    vec3 diffuse = vec3(1) * max(0.,dot(normal,lightDirection)) * 1./ len * len;
    fragColor=vec4(diffuse + ambient,1);

}

