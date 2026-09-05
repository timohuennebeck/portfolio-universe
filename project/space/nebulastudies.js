// Four nebula studies (fragment shaders on top of blackhole.js COMMON: uv(), stars(), fbm(), hash())
const WARP = `
// domain-warped density: two fbm passes feed a third
float dens(vec2 p,float t){vec2 q=vec2(fbm(p+vec2(0.,t)),fbm(p+vec2(5.2,1.3)-t*.7));vec2 r=vec2(fbm(p+4.*q+vec2(1.7,9.2)+t*.3),fbm(p+4.*q+vec2(8.3,2.8)));return fbm(p+3.5*r);}
`;
export const NEBULAE = {
A: WARP + `void main(){vec2 p=uv()+uMouse*.02;float t=uT*.02;
vec3 col=stars(p*1.5+vec2(2.,7.))*.9;
// bright emission behind, dark dust pillars in front
float em=dens(p*1.6+vec2(0.,.4),t);
vec3 glow=mix(vec3(.15,.35,.45),vec3(1.,.55,.2),smoothstep(.3,.75,em))*smoothstep(.25,.8,em)*1.1;
glow*=smoothstep(-.7,.5,p.y+.4);
vec2 pp=vec2(p.x*2.2,p.y*1.1+.4);float pil=dens(pp+vec2(0.,t*.5),t*.4);
float pillar=smoothstep(.42,.58,pil)*smoothstep(.75,-.2,p.y+.2);
float rim=smoothstep(.36,.42,pil)*(1.-smoothstep(.42,.5,pil))*smoothstep(.75,-.2,p.y+.2);
col=col*(1.-pillar*.95)+glow*(1.-pillar)+vec3(1.,.6,.25)*rim*.8*smoothstep(.25,.8,em)+vec3(.35,.18,.08)*pillar*.25;
gl_FragColor=vec4(1.-exp(-col*1.3),1.);}`,
B: WARP + `void main(){vec2 p=uv()+uMouse*.02;float r=length(p);float an=atan(p.y,p.x);float t=uT*.03;vec2 cs=vec2(cos(an),sin(an));
vec3 col=stars(p*1.5+vec2(4.,1.))*.8;
float n=fbm(cs*2.5+vec2(r*3.,t))*.6+.4;
float shell=exp(-pow((r-.3*n-.02)*7.,2.))*(.5+.8*fbm(cs*6.+vec2(r*14.,-t*2.)));
float inner=smoothstep(.34,.05,r)*(.25+.6*fbm(p*7.+t*3.))*smoothstep(.02,.12,r);
float outer=exp(-pow((r-.4*n)*4.,2.))*smoothstep(.3,.5,r)*(.4+.6*fbm(cs*4.+vec2(r*8.,t)));
col+=vec3(.25,.85,.75)*shell*1.1+vec3(.3,.6,1.)*inner+vec3(1.,.35,.25)*outer*.9;
col+=vec3(.9,.95,1.)*exp(-r*r*900.)*3.+vec3(.6,.8,1.)*exp(-r*18.)*.35;
gl_FragColor=vec4(1.-exp(-col*1.2),1.);}`,
C: WARP + `void main(){vec2 p=uv()+uMouse*.02;float t=uT*.015;
vec3 col=stars(p*1.5+vec2(8.,3.))*1.1;
vec2 c1=vec2(-.22,.1),c2=vec2(.25,-.08),c3=vec2(.05,.3);
float d=dens(p*2.4,t);
float wisp=smoothstep(.4,.9,d)*.9+smoothstep(.55,.95,fbm(p*9.+vec2(t*4.,0.)))*.35;
float near=exp(-length(p-c1)*3.)+exp(-length(p-c2)*3.2)*.8+exp(-length(p-c3)*4.)*.6;
col+=vec3(.35,.55,1.)*wisp*near*1.1+vec3(.2,.3,.6)*d*.12;
col+=vec3(.9,.95,1.)*(exp(-pow(length(p-c1),2.)*1200.)*2.+exp(-pow(length(p-c2),2.)*1500.)*1.6+exp(-pow(length(p-c3),2.)*2200.)*1.2);
col+=vec3(.6,.75,1.)*(exp(-length(p-c1)*14.)+exp(-length(p-c2)*15.)*.8+exp(-length(p-c3)*18.)*.6)*.3;
gl_FragColor=vec4(1.-exp(-col*1.2),1.);}`,
D: WARP + `void main(){vec2 p=uv()+uMouse*.02;float r=length(p);float t=uT*.02;
vec3 col=stars(p*1.5+vec2(1.,9.))*.8;
// slow expansion: sample in shrinking coordinates
vec2 q=p*(1.35-t*.6);
float a=fbm(q*4.+vec2(t*2.,0.)),b=fbm(q*4.+vec2(3.1,t*2.)+a*2.);
float fil=1.-abs(b*2.-1.);fil=pow(fil,6.);
float fil2=pow(1.-abs(fbm(q*9.+vec2(-t*3.,1.))*2.-1.),8.);
float env=smoothstep(.5,.15,r)*smoothstep(.02,.15,r)+smoothstep(.55,.35,r)*.3;
vec3 c=mix(vec3(1.,.3,.5),vec3(1.,.6,.2),fbm(q*2.+7.));
col+=c*fil*env*1.5+vec3(.6,.8,1.)*fil2*env*.7+vec3(.35,.45,.9)*smoothstep(.45,.1,r)*fbm(q*3.+t)*.2;
col+=vec3(.7,.85,1.)*exp(-r*r*700.)*1.6;
gl_FragColor=vec4(1.-exp(-col*1.25),1.);}`
};
