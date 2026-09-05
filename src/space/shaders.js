// GLSL for the space renderer. Kept as plain strings so they can be shared by every material.

// Bokeh star: an instanced quad stretched along screen-space velocity, defocused by distance from the focal plane.
export const STAR_VS = /* glsl */`
uniform float uBurst; uniform vec2 uMouse; uniform float uPush;
uniform vec3 uCenter; uniform vec3 uAxis; uniform float uSpin; uniform float uWrap;
uniform vec3 uCam; uniform float uBox; uniform vec3 uVel; uniform float uStretch;
uniform vec2 uRes; uniform float uPR; uniform float uTime; uniform float uFocus;
attribute vec3 aPos; attribute vec3 aCol; attribute float aSize; attribute float aSeed;
varying vec2 vL; varying float vLen; varying float vR; varying float vB; varying vec3 vC; varying float vA;
vec3 rot(vec3 v, vec3 k, float a) { float c = cos(a), s = sin(a); return v * c + cross(k, v) * s + k * dot(k, v) * (1. - c); }
void main() {
  vec3 lp = aPos;
  if (uSpin > 0.) {
    float r = length(lp);
    lp = rot(lp, uAxis, uTime * uSpin * (.12 + 1.4 / (1. + r * .18)));
    lp += vec3(sin(uTime * .41 + aSeed), cos(uTime * .29 + aSeed * 1.3), sin(uTime * .35 + aSeed * .7)) * .22;
    if (uBurst > .001) { vec3 dir = normalize(lp + vec3(sin(aSeed), cos(aSeed * 1.7), sin(aSeed * 2.3)) * .6); lp = rot(lp, uAxis, uBurst * 1.4) + dir * uBurst * (16. + 30. * fract(aSeed * .37)) * (.6 + r * .03); }
  }
  vec3 p = mix(lp + uCenter, mod(aPos - uCam + uBox * .5, uBox) - uBox * .5 + uCam, uWrap);
  vec4 cp0 = projectionMatrix * viewMatrix * vec4(p, 1.);
  if (uPush > .001 && cp0.w > 1.) {
    vec2 dm = (cp0.xy / cp0.w - uMouse) * vec2(uRes.x / uRes.y, 1.); float md = length(dm);
    float inf = smoothstep(.42, 0., md); inf = inf * inf * (3. - 2. * inf);
    vec2 dirm = md > 1e-4 ? dm / md : vec2(0.);
    vec3 cr = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), cu = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
    p += (cr * dirm.x + cu * dirm.y) * inf * uPush * cp0.w * .075 * (.6 + .4 * sin(aSeed));
  }
  vec4 ca = projectionMatrix * viewMatrix * vec4(p, 1.);
  vec4 cb = projectionMatrix * viewMatrix * vec4(p - uVel * uStretch, 1.);
  float depth = ca.w;
  if (depth < 4. || (ca.w < 1. && cb.w < 1.)) { gl_Position = vec4(0., 0., 2., 1.); vA = 0.; return; }
  if (cb.w < 1.) cb = ca;
  vec2 pa = ca.xy / ca.w * uRes * .5, pb = cb.xy / cb.w * uRes * .5, ax = pb - pa;
  float len = min(length(ax), uRes.x * 1.5);
  vec2 dir = len > 1e-3 ? ax / len : vec2(1., 0.), perp = vec2(-dir.y, dir.x);
  float R = aSize * uPR * clamp(260. / depth, .5, 4.);
  float blur = R * clamp(abs(depth - uFocus) / (uFocus * 1.6), 0., 1.) * 1.3 + uPR * .35, rad = R + blur;
  vec2 L = vec2(mix(-rad, len + rad, position.x + .5), position.y * 2. * rad);
  vL = L; vLen = len; vR = R; vB = blur; vC = aCol;
  float tw = .82 + .18 * sin(uTime * 1.3 + aSeed);
  float fade = mix(smoothstep(1500., 700., depth), smoothstep(uBox * .5, uBox * .25, depth), uWrap);
  vA = tw * fade * smoothstep(4., 16., depth) / (1. + blur / R) / (1. + len * .04);
  gl_Position = vec4((pa + dir * L.x + perp * L.y) / (uRes * .5) * ca.w, ca.z, ca.w);
}`;

export const STAR_FS = /* glsl */`
varying vec2 vL; varying float vLen; varying float vR; varying float vB; varying vec3 vC; varying float vA;
void main() {
  vec2 q = vL; q.x -= clamp(q.x, 0., vLen); float d = length(q);
  float a = 1. - smoothstep(vR * .35, vR + vB, d), core = 1. - smoothstep(0., vR * .55, d);
  gl_FragColor = vec4(vC * (a * vA * 1.1 + core * vA * .9), a * vA);
}`;

export const FAR_VS = 'uniform float uPR;attribute vec3 aColor;varying vec3 vC;void main(){vC=aColor;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=1.6*uPR;}';
export const FAR_FS = 'varying vec3 vC;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(vC,1.-d*2.);}';

// Full-screen quad
export const QUAD_VS = 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';

// Sky is baked once into an equirectangular texture (the fbm is far too expensive to run per frame).
export const SKY_BAKE_FS = /* glsl */`
varying vec2 vUv;
float hash(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*noise(p);p=p*2.07+1.9;a*=.5;}return s;}
void main(){
  float phi = vUv.x * 6.2831853, theta = (1. - vUv.y) * 3.14159265;
  vec3 d = vec3(sin(theta) * cos(phi), cos(theta), sin(theta) * sin(phi));
  float band = exp(-pow(d.y * 2.6 + .2, 2.)), n = fbm(d * 2.5), n2 = fbm(d * 5. + 9.);
  vec3 col = vec3(.002, .003, .007);
  col += vec3(.05, .08, .16) * band * (.3 + .7 * n) * .16;
  col += vec3(.16, .07, .03) * smoothstep(.62, .9, n2) * band * .12;
  col += vec3(.03, .05, .12) * smoothstep(.55, .85, n) * .18;
  gl_FragColor = vec4(col, 1.);
}`;

export const BRIGHT_FS = 'uniform sampler2D tDiffuse;uniform float uThresh;varying vec2 vUv;void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;float l=dot(c,vec3(.2126,.7152,.0722));gl_FragColor=vec4(c*smoothstep(uThresh-.3,uThresh+.4,l),1.);}';
export const BLUR_FS = 'uniform sampler2D tDiffuse;uniform vec2 uDir;varying vec2 vUv;void main(){vec3 s=texture2D(tDiffuse,vUv).rgb*.2270270;s+=(texture2D(tDiffuse,vUv+uDir*1.3846).rgb+texture2D(tDiffuse,vUv-uDir*1.3846).rgb)*.3162162;s+=(texture2D(tDiffuse,vUv+uDir*3.2308).rgb+texture2D(tDiffuse,vUv-uDir*3.2308).rgb)*.0702703;gl_FragColor=vec4(s,1.);}';

// Composite: bloom, warp radial blur, chromatic aberration, vignette, ACES, grain, dim
export const FINAL_FS = /* glsl */`
uniform sampler2D tScene, tBloomA, tBloomB; uniform float uTime, uBloom, uCA, uGrain, uWarp, uDim; uniform vec4 uHole; uniform float uAspect; varying vec2 vUv;
// uHole: xy = hole centre (uv), z = shadow radius (uv, in y units), w = strength 0..1
vec2 lensUv(vec2 uv) { if (uHole.w < .001) return uv; vec2 d = (uv - uHole.xy) * vec2(uAspect, 1.); float r = length(d); float rs = uHole.z; float k = 1. + uHole.w * 1.2 * rs * rs / max(r * r, 1e-5); float fade = smoothstep(rs * 9., rs * 2.6, r) * smoothstep(rs * 1.0, rs * 2.4, r); k = mix(1., k, fade); return uHole.xy + d * k / vec2(uAspect, 1.); }
vec3 aces(vec3 x) { return clamp((x * (2.51 * x + .03)) / (x * (2.43 * x + .59) + .14), 0., 1.); }
vec3 sceneAt(vec2 uv) { uv = lensUv(uv); vec2 c = uv - .5; float ca = uCA * (1. + uWarp * 6.) * dot(c, c) * 2.; return vec3(texture2D(tScene, uv + c * ca).r, texture2D(tScene, uv).g, texture2D(tScene, uv - c * ca).b); }
void main() {
  vec2 uv = vUv, c = uv - .5; float r2 = dot(c, c);
  vec3 col = sceneAt(uv);
  if (uWarp > .002) { vec3 acc = col; for (int i = 1; i < 6; i++) { float f = 1. - float(i) * .024 * uWarp * (.5 + r2 * 2.); acc += sceneAt(.5 + c * f); } col = acc / 6.; }
  col += (texture2D(tBloomA, uv).rgb * .5 + texture2D(tBloomB, uv).rgb * .8) * uBloom;
  // lens and bloom both pull light into the shadow; keep the horizon black
  if (uHole.w > .001) { float hr = length((uv - uHole.xy) * vec2(uAspect, 1.)); col *= smoothstep(uHole.z * .45, uHole.z * .8, hr); }
  col *= 1. - r2 * (.9 + uWarp * .6);
  col = aces(col * (.85 + uWarp * .35));
  float gr = fract(sin(dot(uv + fract(uTime * .37), vec2(12.9898, 78.233))) * 43758.5453);
  col += (gr - .5) * uGrain * (1. - col * .6);
  col *= 1. - uDim;
  gl_FragColor = vec4(pow(col, vec3(1. / 2.2)), 1.);
}`;

// Black hole billboard (option B): shadow, photon ring, and two lanes of infalling stars. Premultiplied output: rgb adds, alpha punches the shadow.
export const HOLE_VS = 'varying vec2 vUv;void main(){vUv=uv-.5;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
export const HOLE_FS = /* glsl */`
uniform float uTime; uniform vec2 uHover; uniform float uHov; uniform float uSpeed; uniform float uFade; varying vec2 vUv;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
vec3 starLayer(vec2 q,float seed){vec2 g=floor(q),f=fract(q);float h=hash(g+seed);if(h<.9)return vec3(0.);vec2 c0=vec2(hash(g+seed+1.3),hash(g+seed+2.7))*.8+.1;float d=length(f-c0);float b=(h-.9)/.1;float core=smoothstep(.09+.08*b,0.,d);vec3 tint=mix(vec3(.75,.85,1.),vec3(1.,.9,.75),hash(g+seed+5.));return tint*core*(.5+b*1.2);}
void main(){
  vec2 p=vUv*1.1;
  float r=length(p); float rs=.17;
  float side=sign(p.x); float x=abs(p.x); float lx=log(max(x,1e-3));
  float aa=min(fwidth(r)*1.5,rs*.08);
  vec2 sp=vec2(lx*3.+uTime*.22, p.y*(6.+40.*x)+side*3.7);
  vec3 fall=starLayer(sp,4.)*.9+starLayer(sp*1.7+vec2(0.,2.),11.)*.45;
  float lane=exp(-p.y*p.y/(.0025+.09*x*x));
  float dens=smoothstep(.55,.3,x)*smoothstep(rs*.85,rs*1.15,r)*lane*.7;
  vec3 tint=mix(vec3(.7,.85,1.),vec3(1.),smoothstep(.7,.2,r));
  vec3 col=fall*tint*dens*(.6+1.8*exp(-(r-rs)*4.));
  float shadow=1.-smoothstep(rs-aa,rs+aa,r);
  col*=1.-shadow;
  float rw=max(rs*.02,aa);
  col+=vec3(.9,.95,1.)*exp(-pow((r-rs-rw)/(rw*1.4),2.))*(3.+1.2*uHov)+vec3(.55,.75,1.)*exp(-(r-rs)*14.)*(.3+.15*uHov)*step(rs,r);
  float edge=smoothstep(.55,.35,r);
  // the composite raises bloom (x1.6) and exposure (x1.18) at warp speed; divide that back out so the ring reads the same brightness the whole way
  float comp=1./((1.+uSpeed*.6)*(1.+uSpeed*.185));
  gl_FragColor=vec4((1.-exp(-col*1.5))*edge*comp*uFade, shadow*uFade);
}`;

// Sun billboard (star option D): opaque photosphere with granulation and spots, prominences and soft streamers added over the scene.
export const SUN_FS = /* glsl */`
uniform float uTime; uniform float uHov; uniform float uSpeed; uniform float uFade; uniform vec2 uOrbit; varying vec2 vUv;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 p=vUv*1.1; float r=length(p); float R=.24; float an=atan(p.y,p.x); float aa=fwidth(r)*1.5;
  float disc=1.-smoothstep(R-aa,R+aa,r);
  vec3 n=vec3(p/R,sqrt(max(0.,1.-dot(p,p)/(R*R)))); // orbit drag rotates the sphere: yaw spins it, pitch tilts the visible latitude band
  float cy=cos(-uOrbit.y), sy=sin(-uOrbit.y); vec3 nr=vec3(n.x, n.y*cy-n.z*sy, n.y*sy+n.z*cy);
  vec2 sc=vec2(atan(nr.x,nr.z)+uTime*.04+uOrbit.x, nr.y*1.5);
  float gran=fbm(sc*22.+uTime*.05)*.6+fbm(sc*7.)*.4; float limb=pow(max(n.z,0.),.5);
  float spots=smoothstep(.66,.74,fbm(sc*3.+3.))*smoothstep(.2,.6,limb);
  vec3 s=mix(vec3(1.,.45,.1),mix(vec3(1.,.68,.25),vec3(1.,.93,.75),gran),limb)*(.7+.55*gran)*(1.-spots*.85);
  float d=r-R; vec2 cs=vec2(cos(an),sin(an)); float out_=step(R,r);
  float chromo=exp(-pow(d*120.,2.))*out_;            // thin reddish chromosphere rim
  float glare=exp(-d*7.)*out_;                        // smooth, structureless camera glare
  vec3 col=s*disc+vec3(1.,.4,.15)*chromo*.5+vec3(1.,.8,.55)*glare*.09;
  float edge=smoothstep(.55,.35,r); float comp=1./((1.+uSpeed*.6)*(1.+uSpeed*.185));
  gl_FragColor=vec4((1.-exp(-col*1.15))*edge*comp*uFade, disc*uFade);
}`;
