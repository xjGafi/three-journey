varying vec2 vUv;
varying vec2 vUv2;
varying vec3 vPos;

uniform vec2 uMouseInertia;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;

#include <g_pnoise>
#include <g_circle>

void main() {
  vec3 color = vec3(0.);

  vec3 light = vec3((uMouseInertia * 2. - 1.), 10.);

  float lighten = dot(normalize(light), normalize(vPos));

  color = mix(
    color,
    uColor1,
    pnoise(vUv * 3., vec2(10.))
  );
  color = mix(
    color,
    uColor2,
    pnoise(vUv * 5., vec2(10.)) * .5
  );
  color = mix(
    color,
    uColor3,
    pnoise(vUv * 12., vec2(10.)) * .5
  );
  color = mix(
    color,
    uColor4,
    pnoise(vUv * 15., vec2(10.)) * .5
  );
  color += max(0., lighten * 2.);

  float alpha = circle(vUv2, .9, .1);
  gl_FragColor = vec4(color, alpha);
}