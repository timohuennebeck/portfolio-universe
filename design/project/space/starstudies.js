// Four star studies (fragment shaders on top of blackhole.js COMMON helpers: uv(), stars(), fbm(), hash())
const SPHERE = `
// disc -> unit sphere normal; sc = rotating surface coords
vec3 sphereN(vec2 p,float R){return vec3(p/R,sqrt(max(0.,1.-dot(p,p)/(R*R))));}
vec2 surf(vec3 n,float spin){return vec2(atan(n.x,n.z)+uT*spin,n.y*1.5);}
`;
export const STARS = {
A: SPHERE + `void main(){vec2 p=uv()+uMouse*.02;float r=length(p);float R=.2;float an=atan(p.y,p.x);float aa=fwidth(r)*1.5;
vec3 col=stars(p*1.4+vec2(3.,8.))*.8;
float disc=1.-smoothstep(R-aa,R+aa,r);vec3 n=sphereN(p,R);vec2 sc=surf(n,.05);
float gran=fbm(sc*6.)*.5+fbm(sc*18.+uT*.03)*.25;float limb=pow(max(n.z,0.),.45);
vec3 s=mix(vec3(.55,.75,1.),vec3(1.),limb*(.7+.6*gran))*(1.2+1.4*gran*limb);
float cor=exp(-(r-R)*7.)*step(R,r)*(.6+.6*fbm(vec2(an*4.+uT*.1,r*12.-uT*.15)));
float rays=exp(-(r-R)*2.5)*step(R,r)*pow(fbm(vec2(an*9.,r*2.+uT*.05)),2.)*1.2;
col=col*(1.-disc)*(1.-cor*.6)+s*disc+vec3(.55,.75,1.)*(cor*1.2+rays*.7)+vec3(.6,.8,1.)*exp(-pow((r-R)*60.,2.))*.6;
gl_FragColor=vec4(1.-exp(-col*1.2),1.);}`,
B: SPHERE + `void main(){vec2 p=uv()+uMouse*.02;float r=length(p);float R=.34;float an=atan(p.y,p.x);float aa=fwidth(r)*1.5;
vec3 col=stars(p*1.4+vec2(6.,2.))*.7;
float disc=1.-smoothstep(R-aa,R+aa,r);vec3 n=sphereN(p,R);vec2 sc=surf(n,.02);
float cells=fbm(sc*3.5+uT*.015);float fine=fbm(sc*14.-uT*.02);
float conv=smoothstep(.35,.75,cells)*.7+fine*.3;float limb=pow(max(n.z,0.),.7);
float spots=smoothstep(.62,.72,fbm(sc*2.2+7.));
vec3 s=mix(vec3(.45,.06,.01),mix(vec3(1.,.32,.08),vec3(1.,.78,.45),conv),limb)*(.9+.9*conv)*(1.-spots*.7);
float cor=exp(-(r-R)*9.)*step(R,r)*(.5+.5*fbm(vec2(an*3.+uT*.05,r*8.)));
float haze=exp(-(r-R)*2.)*step(R,r)*.25;
col=col*(1.-disc)+s*disc+vec3(1.,.4,.15)*(cor*.8+haze)+vec3(1.,.5,.25)*exp(-pow((r-R)*50.,2.))*.5;
gl_FragColor=vec4(1.-exp(-col*1.1),1.);}`,
C: SPHERE + `void main(){vec2 p=uv()+uMouse*.02;float r=length(p);float R=.045;float an=atan(p.y,p.x);
vec3 col=stars(lens(p,.004)*1.3+vec2(1.,5.))*.8;
float w=uT*1.9;vec2 ax=vec2(cos(w),sin(w));float along=dot(p,ax);float across=dot(p,vec2(-ax.y,ax.x));
float cone=.02+.16*abs(along);float beam=exp(-across*across/(cone*cone))*smoothstep(R,R*3.,abs(along))*exp(-abs(along)*1.6);
beam*=.55+.45*fbm(vec2(along*14.-uT*3.,across*40.));
float face=pow(.5+.5*cos(w*2.),12.);
float core=exp(-pow(r/R,2.)*2.)*(2.+6.*face)+exp(-r*10.)*(.25+.9*face);
float shell=exp(-pow((r-.42)*9.,2.))*(.35+.4*fbm(vec2(an*5.+uT*.03,r*6.)))*(.6+.4*fbm(vec2(an*20.,r*30.-uT*.1)));
col+=vec3(.75,.85,1.)*(beam*1.3+core)+vec3(.45,.6,1.)*shell*.6;
gl_FragColor=vec4(1.-exp(-col*1.2),1.);}`,
D: SPHERE + `void main(){vec2 p=uv()+uMouse*.02;float r=length(p);float R=.24;float an=atan(p.y,p.x);float aa=fwidth(r)*1.5;
vec3 col=stars(p*1.4+vec2(9.,1.))*.7;
float disc=1.-smoothstep(R-aa,R+aa,r);vec3 n=sphereN(p,R);vec2 sc=surf(n,.04);
float gran=fbm(sc*22.+uT*.05)*.6+fbm(sc*7.)*.4;float limb=pow(max(n.z,0.),.5);
float spots=smoothstep(.66,.74,fbm(sc*3.+3.))*smoothstep(.2,.6,limb);
vec3 s=mix(vec3(1.,.45,.1),mix(vec3(1.,.72,.3),vec3(1.,.96,.85),gran),limb)*(1.1+.9*gran)*(1.-spots*.85);
float d=r-R;
vec2 cs=vec2(cos(an),sin(an));
float prom=smoothstep(.55,.9,fbm(cs*3.2+vec2(uT*.05,d*30.-uT*.25)))*exp(-d*18.)*step(R,r);
float streak=pow(fbm(cs*2.6+vec2(uT*.02,r*1.5)),2.)*exp(-d*4.)*step(R,r)*.7;
float cor=exp(-d*10.)*step(R,r)*.55;
col=col*(1.-disc)+s*disc+vec3(1.,.55,.2)*prom*1.5+vec3(1.,.85,.6)*(streak+cor)+vec3(1.,.8,.5)*exp(-pow(d*60.,2.))*.6;
gl_FragColor=vec4(1.-exp(-col*1.15),1.);}`
};
