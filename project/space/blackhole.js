// Four black-hole studies as single-pass fragment shaders (screen-space lensing approximation).
const VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
const COMMON = `#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 uRes;uniform float uT;uniform vec2 uMouse;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
vec3 starLayer(vec2 q,float s,float seed){vec2 g=floor(q*s),f=fract(q*s);float h=hash(g+seed);if(h<.9)return vec3(0.);vec2 c0=vec2(hash(g+seed+1.3),hash(g+seed+2.7))*.8+.1;float d=length(f-c0);float b=(h-.9)/.1;float core=smoothstep(.09+.08*b,0.,d);vec3 tint=mix(vec3(.75,.85,1.),vec3(1.,.9,.75),hash(g+seed+5.));return tint*core*(.5+b*1.2);}
vec3 stars(vec2 q){return starLayer(q,18.,0.)+starLayer(q,40.,3.)*.7;}
vec2 lens(vec2 p,float m){float r=length(p);return p*(1.+m/(r*r));}
vec2 uv(){return (gl_FragCoord.xy-.5*uRes)/uRes.y;}
`;
export const SHADERS = {
A: `void main(){vec2 p=uv()+uMouse*.02;float r=length(p);float rs=.13;
vec3 col=stars(lens(p,.012)*1.3+vec2(2.1,.7))*.9;col*=smoothstep(rs*.97,rs*1.01,r);
float tilt=.2;vec2 e=vec2(p.x,p.y/tilt);float rd=length(e);float an=atan(e.y,e.x);float ri=rs*1.6,ro=.95;
float band=smoothstep(ri-.02,ri+.06,rd)*smoothstep(ro,ro-.4,rd);
float tex=fbm(vec2(an*2.2+uT*.25-rd*3.,rd*10.))*.7+.3*fbm(vec2(an*6.-uT*.5,rd*30.));
float dop=1.+.8*(e.x/max(rd,1e-4));float heat=exp(-(rd-ri)*3.2);
vec3 dcol=mix(vec3(1.,.55,.25),vec3(1.,.93,.85),heat*.9)*(.35+tex)*dop*band*(.6+1.6*heat);
float front=step(0.,-e.y);dcol*=mix(smoothstep(rs*.95,rs*1.25,r),1.,front);
float ring=smoothstep(rs*2.1,rs*1.25,r)*smoothstep(rs*.98,rs*1.12,r);
float rtex=fbm(vec2(atan(p.y,p.x)*3.-uT*.4,r*20.))*.6+.4;
vec3 halo=vec3(1.,.8,.6)*ring*rtex*(.9+.5*smoothstep(-.4,.8,p.y/r));
float ph=exp(-pow((r-rs*1.06)*90.,2.))*1.6;
col+=dcol+halo+vec3(1.,.9,.8)*ph+vec3(1.,.6,.35)*exp(-rd*2.2)*.12*smoothstep(rs,rs*1.5,r);
gl_FragColor=vec4(1.-exp(-col*1.6),1.);}`,
B: `void main(){vec2 p=uv()*1.1+uMouse*.03;float r=length(p);float rs=.17,m=.03;
vec2 q=lens(p,m),q2=-p*(m*.5/(r*r))-p*.4;vec2 o=vec2(5.,1.)+uT*.004;
vec3 col=stars(q*1.2+o)*1.1+stars(q2*1.2+o)*.5*smoothstep(rs*3.,rs*1.1,r);
col+=vec3(.25,.35,.6)*fbm(q*1.5+uT*.01)*.12;
// infalling stars: two streams from left and right, drawn straight in along the disk plane, fading at the horizon
float side=sign(p.x);float x=abs(p.x);float lx=log(max(x,1e-3));
vec2 sp=vec2(lx*3.+uT*.28, p.y*(6.+40.*x)+side*3.7);
vec3 fall=starLayer(sp,1.,4.)*.9+starLayer(sp*1.7+vec2(0.,2.),1.,11.)*.45;
float lane=exp(-p.y*p.y/(.0025+.09*x*x));
float dens=smoothstep(1.3,.35,x)*smoothstep(rs*.85,rs*1.15,r)*lane;
vec3 tint=mix(vec3(.7,.85,1.),vec3(1.),smoothstep(.7,.2,r));
col+=fall*tint*dens*(.6+1.8*exp(-(r-rs)*4.));
col*=smoothstep(rs*.99,rs*1.03,r);
col+=vec3(.85,.92,1.)*exp(-pow((r-rs*1.03)*140.,2.))*1.8+vec3(.5,.7,1.)*exp(-(r-rs)*9.)*.35*step(rs,r);
gl_FragColor=vec4(1.-exp(-col*1.5),1.);}`,
C: `void main(){vec2 p=uv()+uMouse*.02;float r=length(p);float an=atan(p.y,p.x);float rs=.11;
vec3 col=stars(lens(p,.008)*1.2+vec2(7.,3.))*.5;
float lr=log(max(r,1e-3));float sw=an+2.6*lr-uT*.28/(r+.15);
vec2 sp=vec2(fract(sw/6.2832+.5)*24.,lr*4.);
vec3 s1=starLayer(sp,1.,0.)+starLayer(sp*2.,1.,9.)*.6;
float dens=smoothstep(1.,.2,r)*smoothstep(rs*.9,rs*1.3,r);
vec3 tint=mix(vec3(.62,.83,1.),vec3(1.),smoothstep(.6,.15,r));
col+=s1*tint*dens*(1.+2.5*exp(-(r-rs)*5.));
col+=vec3(.6,.8,1.)*exp(-(r-rs)*14.)*step(rs,r)*.9;
col+=vec3(.4,.6,1.)*fbm(vec2(sw*.8,lr*3.))*exp(-(r-rs)*4.)*.35*step(rs,r);
col*=smoothstep(rs*.97,rs*1.02,r);
gl_FragColor=vec4(1.-exp(-col*1.4),1.);}`,
D: `void main(){vec2 p=uv()+uMouse*.02;float r=length(p);float rs=.1;
vec3 col=stars(lens(p,.008)*1.3+vec2(9.,4.))*.7;col*=smoothstep(rs*.97,rs*1.02,r);
float tilt=.42;vec2 e=vec2(p.x,p.y/tilt);float rd=length(e);float an=atan(e.y,e.x);float ri=rs*1.5,ro=.7;
float band=smoothstep(ri-.02,ri+.05,rd)*smoothstep(ro,ro-.3,rd);
float tex=fbm(vec2(an*3.+uT*.35-rd*4.,rd*12.))*.7+.3*fbm(vec2(an*8.-uT*.7,rd*28.));
float dop=1.+.5*(e.x/max(rd,1e-4));float heat=exp(-(rd-ri)*4.);
vec3 dcol=mix(vec3(.35,.45,1.),vec3(.9,.95,1.),heat)*(.3+tex)*dop*band*(.7+1.6*heat);
float front=step(0.,-e.y);dcol*=mix(smoothstep(rs*.95,rs*1.2,r),1.,front);
float jw=.012+.05*abs(p.y);
float jet=exp(-p.x*p.x/(jw*jw))*smoothstep(rs*1.2,rs*2.5,abs(p.y))*smoothstep(1.1,.35,abs(p.y));
jet*=.5+.6*fbm(vec2(p.x*30.,abs(p.y)*5.-uT*1.2));
col+=dcol+vec3(.7,.75,1.)*jet*1.4+vec3(.55,.6,1.)*exp(-pow((r-rs*1.06)*110.,2.))*1.2+vec3(.4,.45,1.)*exp(-rd*2.5)*.15;
gl_FragColor=vec4(1.-exp(-col*1.5),1.);}`
};
export function mount(canvas, fs) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false }); if (!gl) return () => {}; gl.getExtension('OES_standard_derivatives');
  const mk = (t, s) => { const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh); if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(sh)); return sh; };
  const pr = gl.createProgram(); gl.attachShader(pr, mk(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, COMMON + fs)); gl.linkProgram(pr); gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(pr, 'uRes'), uT = gl.getUniformLocation(pr, 'uT'), uMouse = gl.getUniformLocation(pr, 'uMouse');
  const mouse = [0, 0]; let target = [0, 0];
  const onMove = e => { const r = canvas.getBoundingClientRect(); target = [(e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height * 2 - 1)]; };
  const onLeave = () => { target = [0, 0]; };
  canvas.addEventListener('pointermove', onMove); canvas.addEventListener('pointerleave', onLeave);
  const PR = Math.min(devicePixelRatio || 1, 1.5), t0 = performance.now(); let raf;
  const frame = () => {
    const w = Math.floor(canvas.clientWidth * PR), h = Math.floor(canvas.clientHeight * PR);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    mouse[0] += (target[0] - mouse[0]) * .05; mouse[1] += (target[1] - mouse[1]) * .05;
    gl.uniform2f(uRes, w, h); gl.uniform1f(uT, (performance.now() - t0) / 1000); gl.uniform2f(uMouse, mouse[0], mouse[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 3); raf = requestAnimationFrame(frame);
  };
  frame();
  return () => { cancelAnimationFrame(raf); canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerleave', onLeave); };
}
