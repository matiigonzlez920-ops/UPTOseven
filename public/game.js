(()=>{
const LW=640,LH=360,G=306,LEVEL_W=4300,GOAL_X=4110;
const cv=document.getElementById('c'),ctx=cv.getContext('2d'),frame=document.getElementById('frame'),stage=document.getElementById('stage');
const lo=document.createElement('canvas');lo.width=LW;lo.height=LH;const g=lo.getContext('2d');g.imageSmoothingEnabled=false;
let U=1;
function resize(){
  const r=stage.getBoundingClientRect();
  const fsOn=document.documentElement.classList.contains('is-fs');let s=Math.min((r.width-(fsOn?0:24))/LW,(r.height-(fsOn?0:24))/LH);if(s>=2&&!fsOn)s=Math.floor(s);s=Math.max(.3,s);
  const d=window.devicePixelRatio||1;
  frame.style.width=LW*s+'px';frame.style.height=LH*s+'px';
  cv.width=Math.round(LW*s*d);cv.height=Math.round(LH*s*d);U=cv.height/LH;
}
addEventListener('resize',resize);resize();
const fsBtn=document.getElementById('fs'),fsMsg=document.getElementById('fsMsg');
function fsEl(){return document.fullscreenElement||document.webkitFullscreenElement;}
function flash(t){fsMsg.textContent=t;fsMsg.style.display='block';clearTimeout(flash.t);flash.t=setTimeout(()=>fsMsg.style.display='none',3500);}
function toggleFS(){const root=document.documentElement;
  if(fsEl()){(document.exitFullscreen||document.webkitExitFullscreen).call(document);return;}
  const req=root.requestFullscreen||root.webkitRequestFullscreen;
  if(!req){flash('Tu navegador no deja pantalla completa acá: probá con F11.');return;}
  try{const pr=req.call(root);if(pr&&pr.catch)pr.catch(()=>flash('No se pudo abrir en pantalla completa: probá con F11.'));}catch(e){flash('No se pudo abrir en pantalla completa: probá con F11.');}}
fsBtn.addEventListener('click',toggleFS);
addEventListener('keydown',e=>{if(e.code==='KeyF'&&!e.target.closest('input,select,textarea')){toggleFS();}});
function onFS(){const on=!!fsEl();document.documentElement.classList.toggle('is-fs',on);fsBtn.textContent=on?'Salir':'Pantalla completa';if(on)flash('Esc o F para salir');setTimeout(resize,60);}
document.addEventListener('fullscreenchange',onFS);document.addEventListener('webkitfullscreenchange',onFS);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- utilidades de pixel ----------
function R(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function mk(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function dith(c,x,y,w,h,a,b){if(a)R(c,x,y,w,h,a);c.fillStyle=b;for(let j=0;j<h;j++)for(let i=(j%2);i<w;i+=2)c.fillRect(x+i,y+j,1,1);}
function spk(c,x,y,w,h,col,dens,rn){c.fillStyle=col;const n=Math.floor(w*h*dens);for(let i=0;i<n;i++)c.fillRect(x+Math.floor(rn()*w),y+Math.floor(rn()*h),1,1);}
function ell(c,cx,cy,rx,ry,col){c.fillStyle=col;for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/(ry*ry))));c.fillRect(Math.round(cx-w),Math.round(cy+y),w*2+1,1);}}
function seeded(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const FONT={A:[" ### ","#   #","#   #","#####","#   #","#   #","#   #"],B:["#### ","#   #","#   #","#### ","#   #","#   #","#### "],C:[" ####","#    ","#    ","#    ","#    ","#    "," ####"],D:["#### ","#   #","#   #","#   #","#   #","#   #","#### "],E:["#####","#    ","#    ","#### ","#    ","#    ","#####"],F:["#####","#    ","#    ","#### ","#    ","#    ","#    "],G:[" ####","#    ","#    ","#  ##","#   #","#   #"," ####"],H:["#   #","#   #","#   #","#####","#   #","#   #","#   #"],I:["#####","  #  ","  #  ","  #  ","  #  ","  #  ","#####"],J:["    #","    #","    #","    #","#   #","#   #"," ### "],K:["#   #","#  # ","# #  ","##   ","# #  ","#  # ","#   #"],L:["#    ","#    ","#    ","#    ","#    ","#    ","#####"],M:["#   #","## ##","# # #","#   #","#   #","#   #","#   #"],N:["#   #","##  #","# # #","#  ##","#   #","#   #","#   #"],O:[" ### ","#   #","#   #","#   #","#   #","#   #"," ### "],P:["#### ","#   #","#   #","#### ","#    ","#    ","#    "],R:["#### ","#   #","#   #","#### ","# #  ","#  # ","#   #"],S:[" ####","#    ","#    "," ### ","    #","    #","#### "],T:["#####","  #  ","  #  ","  #  ","  #  ","  #  ","  #  "],U:["#   #","#   #","#   #","#   #","#   #","#   #"," ### "],V:["#   #","#   #","#   #","#   #","#   #"," # # ","  #  "],X:["#   #","#   #"," # # ","  #  "," # # ","#   #","#   #"],Y:["#   #","#   #"," # # ","  #  ","  #  ","  #  ","  #  "],Z:["#####","    #","   # ","  #  "," #   ","#    ","#####"],"0":[" ### ","#   #","#  ##","# # #","##  #","#   #"," ### "],"1":["  #  "," ##  ","  #  ","  #  ","  #  ","  #  "," ### "],"2":[" ### ","#   #","    #","   # ","  #  "," #   ","#####"],"5":["#####","#    ","#### ","    #","    #","#   #"," ### "],"6":[" ### ","#    ","#    ","#### ","#   #","#   #"," ### "],"9":[" ### ","#   #","#   #"," ####","    #","    #"," ### "]," ":["     ","     ","     ","     ","     ","     ","     "]};
function ptext(c,str,x,y,col,sc){sc=sc||1;c.fillStyle=col;let cx=x;for(const ch of str){const gl=FONT[ch];if(gl)gl.forEach((row,j)=>{for(let i=0;i<5;i++)if(row[i]==='#')c.fillRect(cx+i*sc,y+j*sc,sc,sc);});cx+=6*sc;}}
function tw(str,sc){return (str.length*6-1)*(sc||1);}

// ---------- sonido (sintetizado) ----------
let AC=null,muted=false;
function ac(){if(muted)return null;if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){return null;}}if(AC.state==='suspended')AC.resume();return AC;}
let NB=null;function nbuf(a){if(!NB){NB=a.createBuffer(1,a.sampleRate,a.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}return NB;}
function tone(type,f0,f1,dur,vol,delay){const a=ac();if(!a)return;const t=a.currentTime+(delay||0);const o=a.createOscillator(),gn=a.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
  gn.gain.setValueAtTime(vol,t);gn.gain.exponentialRampToValueAtTime(.0008,t+dur);o.connect(gn).connect(a.destination);o.start(t);o.stop(t+dur+.02);}
function noise(dur,vol,ft,f0,f1,q,delay,attack){const a=ac();if(!a)return;const t=a.currentTime+(delay||0);const src=a.createBufferSource();src.buffer=nbuf(a);
  const fl=a.createBiquadFilter();fl.type=ft;fl.Q.value=q;fl.frequency.setValueAtTime(f0,t);fl.frequency.exponentialRampToValueAtTime(Math.max(40,f1),t+dur);
  const gn=a.createGain();if(attack){gn.gain.setValueAtTime(.0008,t);gn.gain.exponentialRampToValueAtTime(vol,t+attack);}else gn.gain.setValueAtTime(vol,t);gn.gain.exponentialRampToValueAtTime(.0008,t+dur);
  src.connect(fl).connect(gn).connect(a.destination);src.start(t,Math.random()*.5);src.stop(t+dur+.02);}
const SFX={
  jump(){tone('square',260,640,.13,.07);},
  land(){noise(.06,.12,'lowpass',500,120,1);},
  lime(){[784,988,1319,1568].forEach((f,i)=>tone('square',f,f,.09,.06,i*.055));},
  cap(){tone('square',1175,1175,.05,.06);tone('square',1568,1568,.14,.06,.05);},
  orange(){for(let i=0;i<9;i++)noise(.035,.5,'bandpass',1400+Math.random()*3200,900,2.2,i*.018+Math.random()*.012);
    noise(.22,.3,'lowpass',1200,180,1.2,.02);tone('sine',200,55,.18,.25);},
  bear(){noise(.09,.55,'bandpass',3400,1600,5);tone('square',240,70,.12,.12);
    for(let i=0;i<5;i++)noise(.025,.35,'highpass',3500+i*400,3000,1,.04+i*.022);
    noise(.55,.3,'highpass',7000,2600,.8,.16,.05);},
  hurt(){tone('sawtooth',420,110,.32,.09);noise(.12,.2,'lowpass',800,200,1);},
  fall(){tone('square',700,90,.6,.07);},
  win(){[523,659,784,1047,0,784,1047,1319].forEach((f,i)=>{if(f)tone('square',f,f,.13,.07,i*.1);});},
  roll(){noise(.25,.12,'bandpass',900,600,3);noise(.18,.08,'highpass',4000,3000,1,.05);},
  talk(){[520,660,590,780,700].forEach((f,i)=>tone('square',f,f*1.05,.05,.05,i*.07));},
  boing(){const a=ac();if(!a)return;tone('sine',140,880,.34,.32);tone('triangle',280,1100,.3,.1,.03);tone('sine',880,620,.25,.1,.3);noise(.1,.18,'bandpass',900,600,3);},
  flap(){for(let i=0;i<7;i++)noise(.04,.18,'bandpass',1400,900,1.5,i*.05);},
  subte(){noise(1.1,.22,'lowpass',900,180,1,0,.2);[659,523].forEach((f,i)=>tone('sine',f,f,.45,.14,.1+i*.38));tone('sawtooth',90,60,1,.05,.2);},
  dribble(){tone('sine',150,70,.09,.35);noise(.05,.25,'lowpass',900,300,1);},
  nope(){tone('square',330,330,.09,.06);tone('square',247,247,.16,.06,.1);},
  drink(){
    // destapar botella de vidrio
    noise(.04,.7,'highpass',2400,1800,1);tone('triangle',620,280,.07,.25);tone('sine',2700,2500,.35,.06,.012);tone('sine',3900,3700,.25,.03,.012);
    noise(1.1,.22,'highpass',7000,3200,.7,.06,.05);noise(.8,.08,'bandpass',4500,2500,2,.15,.1);
    // glu glu glu
    for(let i=0;i<4;i++){const d=.95+i*.3;tone('sine',230,80,.16,.4,d);noise(.12,.2,'lowpass',700,150,1,d);tone('sine',300,700,.07,.14,d+.11);}
    // ahhh
    ahh(2.7);
    [784,988,1175,1568].forEach((f,i)=>tone('square',f,f,.12,.05,3.75+i*.08));
  },
  over(){[392,349,311,262,196].forEach((f,i)=>tone('square',f,f,.2,.07,i*.18));},
  splash(){noise(.7,.3,'bandpass',1800,500,.8,0,.05);for(let i=0;i<10;i++)tone('sine',400+Math.random()*900,900+Math.random()*900,.06,.05,.1+Math.random()*.8);}
};
function ahh(delay){const a=ac();if(!a)return;const t=a.currentTime+delay;
  const o=a.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(175,t);o.frequency.linearRampToValueAtTime(158,t+.25);o.frequency.linearRampToValueAtTime(112,t+1.15);
  const vib=a.createOscillator(),vg=a.createGain();vib.frequency.value=5.5;vg.gain.value=3.5;vib.connect(vg).connect(o.frequency);
  const out=a.createGain();out.gain.setValueAtTime(.0008,t);out.gain.exponentialRampToValueAtTime(.35,t+.06);out.gain.exponentialRampToValueAtTime(.18,t+.5);out.gain.exponentialRampToValueAtTime(.0008,t+1.1);
  [[780,5,2.2],[1180,7,1.4],[2550,9,.6],[3400,10,.3]].forEach(([fr,q,gv])=>{const b=a.createBiquadFilter();b.type='bandpass';b.frequency.value=fr;b.Q.value=q;const gg=a.createGain();gg.gain.value=gv;o.connect(b).connect(gg).connect(out);});
  out.connect(a.destination);o.start(t);vib.start(t);o.stop(t+1.3);vib.stop(t+1.3);
  noise(.08,.35,'bandpass',1800,1200,1.5,delay-.1,.02);
  noise(1.15,.55,'bandpass',1300,650,1.1,delay,.05);noise(1.0,.25,'bandpass',2600,1500,2,delay,.05);noise(.9,.2,'lowpass',900,300,1,delay+.05,.08);
}
const sndBtn=document.getElementById('snd');
sndBtn.addEventListener('click',()=>{muted=!muted;sndBtn.textContent='Sonido: '+(muted?'no':'sí');sndBtn.setAttribute('aria-pressed',String(!muted));if(!muted)SFX.cap();});

// ---------- cielo ----------
const sky=mk(LW,LH);(()=>{const c=sky.getContext('2d'),rn=seeded(3);
  const cols=['#0A2A1C','#0C3322','#0F3C28','#12472E','#165234','#1C5E3A','#256A40','#327646','#44824C','#5A8E52','#749A58','#90A860','#AEB86A','#C8C676','#DCD484','#EADE94','#F2E6A6'];
  const bh=20;cols.forEach((col,i)=>{R(c,0,i*bh,LW,bh,col);if(i<cols.length-1){dith(c,0,i*bh+bh-4,LW,4,null,cols[i+1]);}});
  R(c,0,cols.length*bh,LW,LH,cols[cols.length-1]);
  const cx=470,cy=226;
  for(let y=-44;y<=44;y++)for(let x=-44;x<=44;x++){const d=Math.hypot(x,y);if(d<=26)R(c,cx+x,cy+y,1,1,d>22?'#FAF0A8':'#FFF8D0');else if(d<=34&&(x+y)%2===0)R(c,cx+x,cy+y,1,1,'#F4E890');else if(d<=44&&(x+y)%4===0&&x%2===0)R(c,cx+x,cy+y,1,1,'#E8DE88');}
  const clouds=[[20,70,150],[210,48,110],[350,96,180],[560,58,90],[120,140,120],[430,160,140]];
  clouds.forEach(([x,y,w])=>{
    R(c,x+10,y-4,w-30,4,'#F5EEDC');R(c,x+24,y-7,w-60,3,'#FFFBEC');R(c,x,y,w,6,'#D8DEB4');R(c,x+4,y+6,w-8,3,'#A8BE90');R(c,x+10,y+9,w-24,2,'#7EA078');
    dith(c,x,y,w,2,null,'#ECEAD0');for(let i=0;i<w;i+=7)R(c,x+i,y-2,5,2,'#F5EEDC');});
  for(let i=0;i<6;i++){const bx=40+i*97,by=36+(i%3)*14;R(c,bx,by,2,1,'#0A2A1C');R(c,bx+3,by,2,1,'#0A2A1C');R(c,bx+2,by+1,1,1,'#0A2A1C');}
})();

// ---------- skyline lejano con el Obelisco ----------
const far=mk(960,LH);(()=>{const c=far.getContext('2d'),rn=seeded(11);const base='#1F4A30',hi='#2C5C3C',dk='#173A26',win=['#F8D870','#FFE8A0','#F0B860'];
  let x=0;while(x<960){const w=22+Math.floor(rn()*40),top=205+Math.floor(rn()*45);
    R(c,x,top,w,LH-top,base);R(c,x,top,2,LH-top,hi);R(c,x+w-2,top,2,LH-top,dk);
    if(rn()<.35){const ax=x+4+Math.floor(rn()*(w-8));R(c,ax,top-16,1,16,dk);R(c,ax-3,top-12,7,1,dk);R(c,ax-2,top-8,5,1,dk);R(c,ax,top-17,1,1,'#FF5050');}
    if(rn()<.3){R(c,x+6,top-10,12,10,dk);R(c,x+5,top-11,14,2,base);R(c,x+8,top-4,1,4,base);R(c,x+15,top-4,1,4,base);}
    for(let yy=top+6;yy<290;yy+=7)for(let xx=x+4;xx<x+w-4;xx+=5)if(rn()<.18)R(c,xx,yy,2,3,win[Math.floor(rn()*3)]);
    x+=w;}
  // Obelisco
  const ox=520,oc='#8FB08C',os='#6E9070',ol='#B4CCA8';
  R(c,ox-40,280,80,LH,base);
  for(let y=46;y<292;y++){const t=(y-46)/246,hw=Math.round(5+t*5);R(c,ox-hw,y,hw*2,1,oc);R(c,ox,y,hw,1,os);R(c,ox-hw,y,1,1,ol);}
  for(let y=30;y<46;y++){const hw=Math.round((y-30)/16*5);R(c,ox-hw,y,hw*2+1,1,y%2?oc:ol);R(c,ox+1,y,hw,1,os);}
  R(c,ox-1,56,2,3,'#173A26');R(c,ox-9,288,18,4,ol);
})();

// ---------- cuadra de enfrente ----------
function vitrine(c,name,vx,vw,rn,bx,bw){
  const X=vx+1,Y=244,W=vw-2,H=17,cl=(a)=>a[Math.floor(rn()*a.length)];
  const bright=['#E84040','#F8D030','#40A0E0','#F0F0F0','#50C050','#F08030','#E060B0','#8060D0'];
  if(name==='VIDEOCLUB'){R(c,X,Y,W,H,'#141420');for(let r2=0;r2<2;r2++)for(let gx=X+2;gx<X+W-18;gx+=4){R(c,gx,Y+1+r2*8,3,7,cl(bright));R(c,gx,Y+3+r2*8,3,1,'#FFFFFF');}
    R(c,X+W-16,Y+1,14,15,'#F8D030');R(c,X+W-15,Y+2,12,13,'#1A1A40');ell(c,X+W-9,Y+7,3,3,'#E8B08A');R(c,X+W-13,Y+11,8,3,'#E84040');
    R(c,X+2,Y-4,18,4,'#101010');ptext(c,'VHS',X+2,Y-5,'#F83060',1);return;}
  if(name==='LOCUTORIO'){R(c,X,Y,W,H,'#2A3040');for(let gx=X+2,n=0;gx+10<X+W;gx+=12,n++){R(c,gx,Y+1,10,16,'#6A4A2A');R(c,gx+1,Y+2,8,6,'#A8C8E0');R(c,gx+3,Y+10,4,3,'#101010');R(c,gx+1,Y+1,8,1,'#9A6A42');R(c,gx+7,Y+11,1,2,'#F8D030');}
    R(c,X+W-14,Y-6,12,6,'#1E4EA0');ptext(c,'FAX',X+W-14,Y-6,'#FFFFFF',1);ell(c,X+5,Y-3,2,2,'#F0F0F0');return;}
  if(name==='PIZZERIA'){R(c,X,Y,W,H,'#3A1E14');for(let gx=X+6;gx<X+W-6;gx+=12){ell(c,gx,Y+6,5,3,'#D8A050');ell(c,gx,Y+6,4,2,'#E84030');R(c,gx-2,Y+5,1,1,'#F8E8A0');R(c,gx+1,Y+7,1,1,'#F8E8A0');R(c,gx+2,Y+5,1,1,'#50A040');}
    for(let gx=X;gx<X+W;gx+=2)R(c,gx,Y+11,2,6,(gx/2+Math.floor((gx-X)/4))%2?'#E83030':'#F4F0E4');return;}
  if(name==='FARMACIA'){R(c,X,Y,W,H,'#E8F0EC');for(let r2=0;r2<3;r2++){R(c,X,Y+5+r2*6,W,1,'#A8B8B0');for(let gx=X+2;gx<X+W-2;gx+=4)R(c,gx,Y+1+r2*6,3,4,cl(['#40A0E0','#F0F0F0','#E84040','#50C050','#F8D030']));}
    const px=bx+bw-10;R(c,px,206,9,9,'#101010');R(c,px+1,207,7,7,'#1E9A3A');R(c,px+3,208,3,5,'#FFFFFF');R(c,px+2,209,5,3,'#FFFFFF');R(c,px+4,215,1,5,'#303038');return;}
  if(name==='BAR'){R(c,X,Y,W,H,'#2A1A10');for(let gx=X+2;gx<X+W;gx+=4)R(c,gx,Y,2,2,'#F8C860');
    for(let gx=X+6;gx<X+W-8;gx+=14){R(c,gx,Y+10,8,2,'#8A5A30');R(c,gx+3,Y+12,2,5,'#5A3A20');R(c,gx-3,Y+9,2,8,'#5A3A20');R(c,gx+9,Y+9,2,8,'#5A3A20');R(c,gx+2,Y+7,2,3,'#F0F0F0');}
    R(c,X+W-14,Y+2,12,8,'#1A2A1A');ptext(c,'MENU',X+W-13,Y+3,'#F0F0F0',.5>1?1:1);return;}
  if(name==='DISCOS'){R(c,X,Y,W,H,'#1A1426');for(let gx=X+6;gx<X+W-4;gx+=11){ell(c,gx,Y+8,5,5,'#101010');ell(c,gx,Y+8,2,2,cl(bright));R(c,gx-3,Y+5,1,1,'#4A4A5A');}
    R(c,X+2,Y-5,W-4,4,'#E060B0');return;}
  if(name==='LIBRERIA'){R(c,X,Y,W,H,'#3A2A1A');for(let r2=0;r2<2;r2++)for(let gx=X+1;gx<X+W-1;gx+=2){const h=5+Math.floor(rn()*3);R(c,gx,Y+8+r2*8-h,2,h,cl(['#8A2A2A','#2A4A8A','#2A6A3A','#C8A040','#6A3A7A','#D8D0C0']));}return;}
  if(name==='ALMACEN'){R(c,X,Y,W,H,'#4A3420');for(let gx=X+3;gx<X+W-3;gx+=6){R(c,gx,Y,1,3,'#303030');R(c,gx-1,Y+3,3,7,'#8A3A2A');R(c,gx-1,Y+4,1,5,'#A85040');}
    for(let gx=X+2;gx<X+W-4;gx+=5){R(c,gx,Y+13,4,4,cl(['#E84040','#F8D030','#40A0E0','#C8C8C8']));}ell(c,X+W-6,Y+14,4,2,'#F0D060');return;}
  if(name==='CAFE'){R(c,X,Y,W,H,'#3A2418');R(c,X+3,Y+3,12,10,'#A8ACB4');R(c,X+4,Y+4,10,3,'#D8DCE2');R(c,X+7,Y+9,2,3,'#101010');
    for(let gx=X+20;gx<X+W-4;gx+=7){R(c,gx,Y+10,4,4,'#F4F4F0');R(c,gx+4,Y+11,1,2,'#F4F4F0');R(c,gx+1,Y+9,2,1,'#5A3A20');}
    const px=bx+bw-12;R(c,px,206,11,9,'#101010');R(c,px+1,207,9,7,'#F4F0E4');R(c,px+3,209,4,4,'#5A3A20');R(c,px+7,210,2,2,'#5A3A20');R(c,px+5,215,1,5,'#303038');return;}
  if(name==='KIOSCO'){R(c,X,Y,W,H,'#2A3040');for(let gx=X+3;gx<X+W-6;gx+=9){R(c,gx,Y+4,7,12,'#C8E0E8');R(c,gx+1,Y+2,5,2,'#E84040');for(let k=0;k<6;k++)R(c,gx+1+(k*3)%5,Y+6+Math.floor(k/2)*3,2,2,cl(bright));}return;}
  if(name==='PANADERIA'){R(c,X,Y,W,H,'#F0E0C0');for(let r2=0;r2<2;r2++){R(c,X,Y+7+r2*8,W,1,'#A8906A');for(let gx=X+4;gx<X+W-3;gx+=7)ell(c,gx,Y+4+r2*8,3,2,r2?'#C88A40':'#E0A860');}return;}
  // BAZAR y otros
  R(c,X,Y,W,H,'#2A2A34');for(let gx=X+4;gx<X+W-3;gx+=8){ell(c,gx,Y+5,3,3,'#D8D8DC');ell(c,gx,Y+5,1,1,'#A8A8B0');R(c,gx-2,Y+11,5,5,cl(['#C84040','#4080C0','#E0C040','#50A050']));}
}
const SHOPS=['VIDEOCLUB','KIOSCO','LOCUTORIO','PIZZERIA','FARMACIA','BAR','DISCOS','LIBRERIA','ALMACEN','VIDEOCLUB','CAFE','LOCUTORIO','PANADERIA','BAZAR'];
const mid=mk(1280,LH);(()=>{const c=mid.getContext('2d'),rn=seeded(42);
  const styles=[
    {b:'#E6D6AE',s:'#C8B486',d:'#8E7C58',l:'#F6EACC',fr:true},
    {b:'#CC8A54',s:'#A86A3A',d:'#6E4222',l:'#E4A66C',fr:true},
    {b:'#B4B0A6',s:'#908C84',d:'#5E5A56',l:'#D0CCC2',fr:false},
    {b:'#D8A09A',s:'#B87C76',d:'#7C4C48',l:'#EEBCB6',fr:true},
    {b:'#C8C090',s:'#A8A070',d:'#6C6844',l:'#E0D8AA',fr:false}];
  const BASE=262;let x=0;let si=0;
  while(x<1280){
    const w=Math.min(1280-x,96+Math.floor(rn()*70)),st=styles[Math.floor(rn()*styles.length)],top=104+Math.floor(rn()*66);
    const persiana=rn()<.5?['#3E6A3A','#2A4A28','#5A8A52']:['#7A4A28','#56321A','#9A6A42'];
    // fachada
    R(c,x,top,w,BASE-top,st.b);dith(c,x,top,w,BASE-top,null,st.b);spk(c,x,top,w,BASE-top,st.l,.02,rn);spk(c,x,top,w,BASE-top,st.s,.03,rn);
    R(c,x+w-3,top,3,BASE-top,st.s);R(c,x+w-1,top,1,BASE-top,st.d);R(c,x,top,1,BASE-top,st.l);
    // techo
    if(st.fr){for(let i=0;i<20;i++){R(c,x+4+i,top-20+i,w-8-i*2,1,i<2?'#6A7090':'#4A5068');}
      R(c,x+4,top-21,w-8,1,'#8890B0');const ow=Math.floor(w/2);ell(c,x+ow,top-10,5,4,'#2A2E40');ell(c,x+ow,top-10,4,3,'#F0C868');R(c,x+ow-6,top-15,13,1,'#8890B0');}
    else{R(c,x,top-4,w,4,st.d);if(rn()<.8){const tx=x+10+Math.floor(rn()*(w-40));R(c,tx+2,top-22,2,18,'#303040');R(c,tx+18,top-22,2,18,'#303040');R(c,tx,top-38,24,18,'#8A8C94');R(c,tx,top-38,24,2,'#B0B4BC');R(c,tx+20,top-38,4,18,'#6A6C74');for(let yy=top-34;yy<top-22;yy+=4)R(c,tx,yy,24,1,'#7A7C84');}}
    if(rn()<.7){const ax=x+w-20;R(c,ax,top-30,1,30,'#302838');for(let i=0;i<4;i++)R(c,ax-8+i,top-28+i*5,17-i*2,1,'#302838');}
    // cornisa
    R(c,x-2,top-3,w+4,5,st.l);R(c,x-2,top+2,w+4,1,st.d);for(let xx=x;xx<x+w;xx+=4)R(c,xx,top+3,2,2,st.s);
    // pisos
    const floors=Math.floor((218-top-10)/34);
    for(let f=0;f<floors;f++){
      const fy=218-(f+1)*34;
      R(c,x,fy+33,w,2,st.l);R(c,x,fy+35,w,1,st.s);
      const n=Math.max(1,Math.floor((w-10)/26)),gap=(w-n*14)/(n+1);
      for(let i=0;i<n;i++){
        const wx=Math.round(x+gap+i*(14+gap)),wy=fy+5;
        R(c,wx-2,wy-3,18,27,st.d);R(c,wx-1,wy-2,16,25,st.l);
        const mode=rn();
        if(mode<.45){R(c,wx,wy,14,23,persiana[0]);for(let yy=wy+1;yy<wy+23;yy+=2)R(c,wx,yy,14,1,persiana[1]);R(c,wx+6,wy,2,23,persiana[1]);R(c,wx,wy,1,23,persiana[2]);}
        else if(mode<.75){R(c,wx,wy,14,23,'#243058');R(c,wx+1,wy+1,3,8,'#5A70A8');R(c,wx+7,wy,1,23,st.l);R(c,wx,wy+10,14,1,st.l);R(c,wx-3,wy,3,23,persiana[0]);R(c,wx+14,wy,3,23,persiana[0]);}
        else{R(c,wx,wy,14,23,'#F2C860');R(c,wx,wy,14,4,'#E0A040');R(c,wx+7,wy,1,23,'#C88A30');R(c,wx+1,wy+4,4,19,'#F8E0A0');R(c,wx+9,wy+4,4,19,'#F8E0A0');}
        R(c,wx+1,wy-4,12,1,st.s);R(c,wx+3,wy-5,8,1,st.s);
        // balcón de hierro
        const by=wy+23;R(c,wx-4,by,22,2,st.l);R(c,wx-4,by+2,22,1,st.d);
        R(c,wx-4,by-8,22,1,'#101014');for(let bx=wx-4;bx<wx+18;bx+=2)R(c,bx,by-8,1,8,'#1A1A20');for(let bx=wx-2;bx<wx+16;bx+=6){R(c,bx,by-6,2,1,'#1A1A20');R(c,bx+1,by-5,1,2,'#1A1A20');}
        if(rn()<.2){R(c,wx-3,by-11,4,3,'#C0402A');R(c,wx-3,by-14,4,3,'#3A8A36');}
        if(rn()<.13){const ax=i%2?wx+17:wx-14;R(c,ax,wy+6,12,9,'#E0E0D8');R(c,ax,wy+6,12,1,'#FFFFFF');for(let gx=ax+1;gx<ax+11;gx+=2)R(c,gx,wy+8,1,6,'#A0A098');R(c,ax,wy+15,12,1,'#707068');}
      }
    }
    // planta baja
    R(c,x,218,w,44,st.s);R(c,x,218,w,2,st.d);
    if(rn()<.72){
      const name=SHOPS[si++%SHOPS.length];const bc=['#0F6B3A','#B81E1E','#1F3F20','#0F6B3A','#2A2A2A'][Math.floor(rn()*5)];
      const sw=Math.min(w-8,tw(name)+14);const sx=x+Math.floor((w-sw)/2);
      R(c,sx,221,sw,13,bc);R(c,sx,221,sw,1,'#F8D030');R(c,sx,233,sw,1,'#F8D030');R(c,sx,221,1,13,'#D82828');R(c,sx+sw-1,221,1,13,'#D82828');
      R(c,sx+2,223,1,1,'#F8D030');R(c,sx+sw-3,223,1,1,'#F8D030');R(c,sx+2,231,1,1,'#F8D030');R(c,sx+sw-3,231,1,1,'#F8D030');
      ptext(c,name,sx+Math.floor((sw-tw(name))/2),224,'#FFFFFF');
      if(rn()<.5){const aw=rn()<.5?['#1E7B34','#F0ECDC']:['#C82828','#F0ECDC'];for(let i=0;i<w-6;i+=5){R(c,x+3+i,236,5,6,(i/5)%2?aw[1]:aw[0]);R(c,x+4+i,242,3,1,(i/5)%2?aw[1]:aw[0]);}R(c,x+3,236,w-6,1,'#000');}
      const vx=x+5,vw=w-30;R(c,vx,243,vw,19,'#1A1A24');R(c,vx+1,244,vw-2,17,'#3A5070');dith(c,vx+1,244,vw-2,5,null,'#6A88AC');
      vitrine(c,name,vx,vw,rn,x,w);
      R(c,x+w-22,240,14,22,'#4A2C18');R(c,x+w-21,241,12,20,'#7A4A28');R(c,x+w-19,243,8,8,'#3A5070');R(c,x+w-12,252,2,2,'#F8D030');
    }else{
      const dx=x+Math.floor(w/2)-11;R(c,dx-2,224,26,38,st.d);ell(c,dx+11,232,13,8,st.d);R(c,dx,228,22,34,'#5A3418');ell(c,dx+11,232,11,6,'#5A3418');
      R(c,dx+10,228,2,34,'#3A2010');for(let yy=236;yy<260;yy+=6){R(c,dx+2,yy,7,4,'#7A4A28');R(c,dx+13,yy,7,4,'#7A4A28');}R(c,dx+8,244,2,3,'#E8C050');R(c,dx+12,244,2,3,'#E8C050');ell(c,dx+11,230,6,3,'#F2C860');
      R(c,x+6,229,8,5,'#E8C050');R(c,x+8,230,4,3,'#3A2010');
    }
    x+=w;
  }
  // vereda de enfrente y faroles
  R(c,0,BASE,1280,10,'#B8B0A0');for(let xx=0;xx<1280;xx+=12)R(c,xx,BASE,1,10,'#9C9488');R(c,0,BASE+5,1280,1,'#A8A094');R(c,0,BASE+9,1280,1,'#6C6660');
  for(let fx=60;fx<1280;fx+=210){R(c,fx,190,3,72,'#1C1C24');R(c,fx-1,258,5,4,'#1C1C24');R(c,fx-6,186,15,3,'#1C1C24');R(c,fx-5,178,13,8,'#1C1C24');R(c,fx-4,179,11,6,'#F8E0A0');R(c,fx-3,174,9,4,'#1C1C24');R(c,fx+1,171,1,3,'#1C1C24');}
  for(let tx=160;tx<1280;tx+=320){R(c,tx-1,236,3,26,'#6A5A48');ell(c,tx,226,16,12,'#2E6A2A');dith(c,tx-16,214,32,12,null,'#3E8A36');ell(c,tx-6,220,8,6,'#4A9A40');}
})();

// ---------- vehículos ----------
function taxiSpr(){const c=mk(84,32),x=c.getContext('2d');
  R(x,6,14,74,12,'#101016');R(x,4,16,78,9,'#1C1C24');R(x,4,16,78,2,'#3A3A4A');R(x,18,5,40,11,'#101016');R(x,19,6,38,10,'#F0C020');R(x,19,6,38,2,'#FFE070');
  R(x,22,8,15,7,'#98B8D8');R(x,39,8,15,7,'#88A8C8');R(x,22,8,4,3,'#D8ECF8');R(x,37,8,2,8,'#F0C020');
  R(x,2,22,6,3,'#C8C8D0');R(x,78,22,6,3,'#C8C8D0');R(x,80,17,3,3,'#F8E8A0');R(x,2,17,3,3,'#D02020');R(x,40,19,6,1,'#5A5A6A');R(x,56,19,6,1,'#5A5A6A');
  R(x,25,0,26,9,'#F8F8F0');ptext(x,'TAXI',27,1,'#101016',1);
  for(const wx of [18,64]){ell(x,wx,26,6,6,'#0A0A0E');ell(x,wx,26,3,3,'#A8A8B4');R(x,wx,26,1,1,'#F0F0F0');}return c;}
function busSpr(lo,dk,num,up){lo=lo||'#0F6B3A';dk=dk||'#0A4A28';num=num||'60';up=up||'#F0E6C8';const c=mk(168,56),x=c.getContext('2d');
  R(x,2,4,164,44,'#0E0E14');R(x,3,5,162,24,up);R(x,3,29,162,17,lo);R(x,3,29,162,2,'#F8D030');R(x,3,44,162,2,dk);
  for(let i=0;i<9;i++){const wx=10+i*16;R(x,wx,9,13,15,'#243048');R(x,wx+1,10,4,6,'#6880A8');}
  R(x,150,9,14,18,'#1A2438');R(x,151,10,5,8,'#6880A8');R(x,146,7,18,2,'#101016');R(x,140,4,24,5,'#101016');ptext(x,num,num.length>2?143:147,1,'#F8A020',1);
  for(let i=0;i<150;i+=12){R(x,8+i,36,6,1,'#F8D030');R(x,10+i,35,2,1,'#F8D030');R(x,14+i,37,1,2,'#D82828');}
  R(x,120,28,20,18,'#101016');R(x,121,29,8,16,'#243048');R(x,131,29,8,16,'#243048');
  R(x,162,38,5,4,'#F8E8A0');R(x,1,38,3,4,'#D02020');
  for(const wx of [30,128]){ell(x,wx,47,8,8,'#0A0A0E');ell(x,wx,47,4,4,'#B8B8C4');}return c;}
function carSpr(col,hi){const c=mk(64,26),x=c.getContext('2d');
  R(x,4,11,56,10,'#101016');R(x,5,12,54,8,col);R(x,5,12,54,2,hi);R(x,14,3,32,9,'#101016');R(x,15,4,30,8,col);R(x,17,5,12,6,'#98B8D8');R(x,31,5,12,6,'#88A8C8');
  R(x,2,18,4,2,'#C8C8D0');R(x,58,18,4,2,'#C8C8D0');R(x,59,14,2,2,'#F8E8A0');
  for(const wx of [15,49]){ell(x,wx,21,5,5,'#0A0A0E');ell(x,wx,21,2,2,'#A8A8B4');}return c;}
const TAXI=taxiSpr(),BUS=busSpr(),BUS2=busSpr('#1E4EA0','#143A7A','152','#F4E4B0'),CARS=[carSpr('#5A8AC0','#8AB8E8'),carSpr('#E8E0C8','#FFFFF0'),carSpr('#9A2A2A','#C85050')];

// ---------- utilería de vereda ----------
function puestoSpr(){const c=mk(150,84),x=c.getContext('2d'),rn=seeded(9);
  // techo oscuro con alero
  R(x,0,0,112,7,'#101010');R(x,1,1,110,5,'#3A3430');R(x,1,1,110,1,'#6A625A');R(x,6,7,100,3,'#2A2420');
  // estructura metálica gris
  R(x,6,10,6,70,'#101010');R(x,7,10,4,70,'#A8ACB0');R(x,7,10,1,70,'#D8DCE0');R(x,100,10,6,70,'#101010');R(x,101,10,4,70,'#A8ACB0');R(x,101,10,1,70,'#D8DCE0');
  // cartel verde con skyline
  R(x,12,11,88,11,'#101010');R(x,13,12,86,9,'#1E6A40');for(let i=0;i<86;i+=3){const h=2+Math.floor(rn()*5);R(x,13+i,21-h,3,h,'#2E8A58');}R(x,13,12,86,1,'#3EA06A');R(x,33,12,46,9,'#0E4A2A');ptext(x,'DIARIOS',35,13,'#F5EEDC',1);
  // interior repleto de revistas
  R(x,12,22,88,44,'#141418');
  const cols=['#E84040','#F8D030','#40A0E0','#F07830','#E060B0','#50C050','#F0F0F0','#8060D0','#D8A050','#30C0C0'];
  for(let row=0;row<5;row++)for(let i=0;i<14;i++){const mx=14+i*6+(row%2),my=24+row*8;const col=cols[Math.floor(rn()*cols.length)];R(x,mx,my,5,7,col);R(x,mx,my,5,1,'#FFFFFF');if(rn()<.5)R(x,mx+1,my+3,3,2,rn()<.5?'#303030':'#F0D0A0');}
  // diariero
  R(x,48,34,12,20,'#101010');R(x,49,35,10,19,'#2A3040');R(x,50,26,8,9,'#101010');R(x,51,27,6,7,'#D8A078');R(x,50,25,8,3,'#2A2A30');R(x,53,40,6,3,'#F0F0F0');
  // mostrador con pilas de diarios
  R(x,10,62,92,5,'#101010');R(x,11,62,90,4,'#8A8A90');R(x,11,62,90,1,'#C8C8CC');
  for(let i=0;i<6;i++){const sx=14+i*14,h=3+Math.floor(rn()*4);R(x,sx,62-h,11,h,'#E8E4DC');for(let j=0;j<h;j+=2)R(x,sx,62-h+j,11,1,'#A8A49C');}
  // zócalo con revistas y banquito
  R(x,12,67,88,13,'#2A2A30');for(let i=0;i<12;i++)R(x,14+i*7,69,6,9,cols[(i*3)%cols.length]);
  R(x,70,70,2,14,'#C87830');R(x,78,70,2,14,'#C87830');R(x,68,69,14,2,'#E0A050');
  R(x,40,74,14,10,'#B08050');R(x,40,74,14,1,'#D8A870');R(x,58,76,8,8,'#C82020');
  R(x,4,80,108,4,'#6A6460');
  // bicicleta celeste apoyada
  const bx=116;const wheel=(cx)=>{for(let a=0;a<24;a++){const an=a/24*Math.PI*2;R(x,Math.round(cx+Math.cos(an)*8),Math.round(74+Math.sin(an)*8),1,1,'#1A1A20');}R(x,cx,74,1,1,'#606068');};
  wheel(bx+6);wheel(bx+28);
  const line=(x0,y0,x1,y1,col)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));for(let i=0;i<=n;i++)R(x,Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),1,1,col);};
  line(bx+6,74,bx+15,60,'#6AB8E8');line(bx+15,60,bx+26,60,'#6AB8E8');line(bx+15,60,bx+17,74,'#6AB8E8');line(bx+17,74,bx+6,74,'#6AB8E8');line(bx+26,60,bx+28,74,'#6AB8E8');line(bx+26,60,bx+17,74,'#6AB8E8');
  R(x,bx+12,57,6,2,'#2A2A30');line(bx+26,60,bx+27,55,'#8A8A92');R(x,bx+24,54,6,1,'#2A2A30');
  R(x,bx+26,48,10,7,'#101010');R(x,bx+27,49,8,5,'#2E9A4A');for(let i=0;i<8;i+=2)R(x,bx+27+i,49,1,5,'#1E6A34');
  return c;}
function standSpr(){const c=mk(176,150),x=c.getContext('2d'),rn=seeded(77);
  const G1='#0F6B3A',G2='#0A4A28',G3='#1E8A4E',CR='#F5EEDC',RD='#D82828',YE='#F8D030';
  // cajones de botellas a los costados
  for(const cx of [0,150])for(let k=0;k<3;k++){const cy=150-16*(k+1);R(x,cx,cy,26,16,'#1A1A1A');R(x,cx+1,cy+1,24,14,RD);R(x,cx+1,cy+1,24,2,'#F05858');for(let b=0;b<4;b++){R(x,cx+3+b*6,cy-5,3,6,'#1E8A3A');R(x,cx+4+b*6,cy-7,1,2,'#1E8A3A');R(x,cx+4+b*6,cy-4,1,3,'#8AE09A');}}
  // estructura
  R(x,28,40,120,110,'#101010');R(x,30,40,116,108,G1);dith(x,30,40,116,108,null,'#12743F');R(x,30,40,4,108,G3);R(x,142,40,4,108,G2);
  // cartel
  R(x,18,0,140,34,'#101010');R(x,20,2,136,30,CR);R(x,24,6,128,22,G1);R(x,24,6,128,2,G3);
  x.drawImage(LIME,28,5);
  ptext(x,'LIMA',58,9,YE,1);ptext(x,'LIMON',58,18,YE,1);
  for(let i=0;i<14;i++){const bx=94+Math.floor(rn()*54),by=8+Math.floor(rn()*18),r=rn()<.4?2:1;ell(x,bx,by,r,r,rn()<.5?CR:YE);if(r===2)R(x,bx,by,1,1,G1);}
  // toldo
  for(let i=0;i<176;i+=8){const col=(i/8)%2?CR:G1;R(x,i,34,8,12,col);R(x,i+1,46,6,2,col);R(x,i+2,48,4,1,'#101010');}R(x,0,34,176,1,'#101010');R(x,0,36,176,1,'rgba(255,255,255,.4)');
  // franja canje
  R(x,34,54,108,11,RD);R(x,34,54,108,1,'#F05858');R(x,34,64,108,1,'#8E1414');ptext(x,'CANJE DE TAPITAS',37,56,CR,1);
  // ventana con heladera
  R(x,36,68,104,48,'#101010');R(x,38,70,100,44,'#12301E');
  R(x,40,72,44,40,'#D8DCD8');R(x,42,74,40,36,'#A8D0B8');dith(x,42,74,40,36,null,'#B8DCC4');
  for(let s=0;s<3;s++){R(x,42,85+s*12,40,1,'#FFFFFF');for(let i=0;i<7;i++){R(x,44+i*5,76+s*12,3,9,'#1E8A3A');R(x,45+i*5,74+s*12,1,2,'#1E8A3A');R(x,44+i*5,80+s*12,3,2,CR);}}
  R(x,88,74,48,36,'#0A2416');ell(x,112,92,16,16,'#0F6B3A');
  x.drawImage(CAP,100,80);ptext(x,'X',104+22,88,YE,1);
  for(let i=0;i<10;i++){const bx=92+Math.floor(rn()*40),by=76+Math.floor(rn()*30);R(x,bx,by,1,1,CR);}
  // mostrador
  R(x,30,116,116,4,CR);R(x,30,120,116,1,'#B8B0A0');
  for(let i=0;i<5;i++){R(x,50+i*20,104,4,12,'#1E8A3A');R(x,51+i*20,100,2,4,'#1E8A3A');R(x,51+i*20,99,2,1,'#C0C4CC');R(x,51+i*20,106,1,8,'#8AE09A');}
  // frente del mostrador: burbujas
  for(let i=0;i<22;i++){const bx=36+Math.floor(rn()*104),by=124+Math.floor(rn()*20),r=rn()<.3?3:rn()<.6?2:1;ell(x,bx,by,r,r,rn()<.7?CR:YE);if(r>1)ell(x,bx,by,r-1,r-1,G1);}
  R(x,28,146,120,4,'#6A6460');
  return c;}
function kioscoSpr(big){const c=mk(120,110),x=c.getContext('2d'),rn=seeded(big?5:6);
  R(x,0,0,120,110,'#E8E0C8');dith(x,0,0,120,110,null,'#DCD2B6');R(x,0,0,120,3,'#8E7C58');R(x,118,0,2,110,'#B8A888');
  R(x,6,8,108,20,'#B81E1E');R(x,6,8,108,2,'#F8D030');R(x,6,26,108,2,'#F8D030');R(x,6,8,2,20,'#F8D030');R(x,112,8,2,20,'#F8D030');ptext(x,'KIOSCO',60-Math.floor(tw('KIOSCO',2)/2),11,'#FFFFFF',2);
  for(let i=0;i<108;i+=6){R(x,6+i,30,6,8,(i/6)%2?'#F0ECDC':'#C82828');R(x,7+i,38,4,2,(i/6)%2?'#F0ECDC':'#C82828');}R(x,6,30,108,1,'#000');
  R(x,8,44,66,50,'#2A2A30');R(x,10,46,62,40,'#384860');
  const cols=['#E84040','#F8D030','#40A0E0','#F07830','#E060B0','#50C050','#8A5030','#F0F0F0'];
  for(let s=0;s<3;s++){R(x,10,58+s*13,62,1,'#C0C0C8');for(let i=0;i<14;i++){const h=3+Math.floor(rn()*6);R(x,12+i*4,57+s*13-h,3,h,cols[Math.floor(rn()*cols.length)]);}}
  R(x,8,86,66,8,'#7A4A28');R(x,8,86,66,1,'#A87040');R(x,20,80,20,6,'#F0E6C8');R(x,21,81,4,4,'#E84040');R(x,27,81,4,4,'#F8D030');R(x,33,81,4,4,'#50C050');
  R(x,80,42,32,62,'#D8D8DC');R(x,81,43,30,60,'#F4F4F8');R(x,83,46,26,50,'#A8C8E0');dith(x,83,46,26,50,null,'#B8D4EA');
  for(let s=0;s<4;s++){R(x,83,58+s*12,26,1,'#FFFFFF');for(let i=0;i<5;i++){const col=['#1E7B34','#F08018','#5A2A10','#1E7B34','#D8D8D8'][(i+s)%5];R(x,85+i*5,50+s*12,3,8,col);R(x,86+i*5,48+s*12,1,2,col);}}
  R(x,81,97,30,6,'#B8B8C0');
  R(x,24,95,46,10,'#2A2A30');ptext(x,'ABIERTO',26,96,'#50E050',1);
  R(x,0,104,120,6,'#8C8478');return c;}
function cabinaSpr(){const c=mk(44,104),x=c.getContext('2d');
  const B='#2A6AB8',Bd='#1A4A88',Bl='#5A9AE0',Gr='#6AC83A',Gd='#3E9A20',K='#101010';
  // caja superior azul con tubo
  R(x,9,0,26,20,K);R(x,10,1,24,18,B);R(x,10,1,24,2,Bl);R(x,30,1,4,18,Bd);ell(x,22,10,5,5,Bl);R(x,20,7,2,6,'#F4F4F0');R(x,20,6,4,2,'#F4F4F0');R(x,20,12,4,2,'#F4F4F0');
  // capuchón verde en trapecio
  for(let i=0;i<10;i++){R(x,5-Math.floor(i/3),20+i,34+Math.floor(i/3)*2,1,i<2?'#8AE05A':Gr);}R(x,2,29,40,2,Gd);R(x,2,19,40,1,K);
  // vidrios laterales y cabina
  R(x,4,31,36,32,K);R(x,5,31,34,31,'#1A2228');
  R(x,5,31,6,31,'rgba(170,220,230,.55)');R(x,33,31,6,31,'rgba(170,220,230,.55)');R(x,6,33,1,24,'#F4FCFF');R(x,34,33,1,22,'#F4FCFF');
  R(x,11,31,22,31,'#B8BCC4');R(x,11,31,22,2,'#D8DCE2');
  // teléfono azul
  R(x,15,35,14,21,K);R(x,16,36,12,19,'#3A7AC8');R(x,16,36,12,2,'#6AA8E8');R(x,19,38,7,4,'#A8D8A0');R(x,20,39,5,1,'#4A7A48');
  for(let r=0;r<3;r++)for(let i=0;i<3;i++)R(x,19+i*3,44+r*3,2,2,'#D8DCE2');R(x,16,38,2,14,K);R(x,17,52,1,4,K);
  // repisa verde inferior
  for(let i=0;i<6;i++)R(x,4+Math.floor(i/2),62+i,36-Math.floor(i/2)*2,1,i<1?'#8AE05A':Gr);R(x,7,68,30,1,Gd);
  // pedestal azul
  R(x,10,68,24,34,K);R(x,11,68,22,34,B);R(x,11,68,3,34,Bl);R(x,29,68,4,34,Bd);R(x,8,101,28,3,'#3A3E48');
  return c;}
function buzonSpr(){const c=mk(24,46),x=c.getContext('2d');
  R(x,4,10,16,32,'#7A1010');R(x,5,10,14,32,'#C81E1E');R(x,6,10,3,32,'#E85050');R(x,15,10,3,32,'#A01414');ell(x,12,10,8,5,'#C81E1E');ell(x,10,8,3,2,'#E85050');
  R(x,7,16,10,2,'#101014');R(x,7,22,10,5,'#F8D030');R(x,8,23,8,3,'#C81E1E');R(x,2,42,20,4,'#4A4A52');R(x,3,41,18,1,'#7A7A82');return c;}
function paradaSpr(){const c=mk(24,96),x=c.getContext('2d');
  R(x,11,20,3,76,'#8C8C96');R(x,12,20,1,76,'#C0C0C8');R(x,1,0,22,30,'#101014');R(x,2,1,20,28,'#1E4EA0');R(x,2,1,20,7,'#F0F0F0');ptext(x,'BUS',3,1,'#1E4EA0',1);
  ptext(x,'60',5,10,'#FFFFFF',1);ptext(x,'152',3,19,'#F8D030',1);return c;}
function arbolSpr(){const c=mk(124,170),x=c.getContext('2d'),rn=seeded(17);
  R(x,50,164,24,6,'#3A2A1C');R(x,52,165,20,4,'#5A4028');
  for(let y=66;y<166;y++){const w=10+Math.floor((y-66)/30);R(x,62-w/2,y,w,1,'#BCB08C');}
  for(let i=0;i<60;i++){const py=70+Math.floor(rn()*94),px=57+Math.floor(rn()*10);R(x,px,py,3+Math.floor(rn()*3),2+Math.floor(rn()*3),['#8A9A6A','#D8CCA8','#7A6A4A','#A8A080'][Math.floor(rn()*4)]);}
  R(x,66,70,3,94,'#8A7E60');R(x,48,70,14,3,'#A89C78');R(x,64,62,18,3,'#A89C78');
  const blobs=[[62,46,54,34],[34,56,28,20],[92,54,28,22],[50,24,30,20],[80,26,30,20],[62,10,24,12]];
  blobs.forEach(([bx,by,rx,ry])=>ell(x,bx,by,rx+1,ry+1,'#1E4A1E'));
  blobs.forEach(([bx,by,rx,ry])=>ell(x,bx,by,rx,ry,'#2E6A2A'));
  blobs.forEach(([bx,by,rx,ry])=>ell(x,bx-4,by-4,Math.floor(rx*.75),Math.floor(ry*.7),'#3E8A36'));
  blobs.forEach(([bx,by,rx,ry])=>ell(x,bx-8,by-7,Math.floor(rx*.4),Math.floor(ry*.4),'#5AA848'));
  const d=x.getImageData(0,0,124,80);for(let i=0;i<500;i++){const px=Math.floor(rn()*124),py=Math.floor(rn()*78);if(d.data[(py*124+px)*4+3]>0)R(x,px,py,2,1,rn()<.5?'#7AC05A':'#24561F');}
  return c;}
function vallaSpr(){const c=mk(40,30),x=c.getContext('2d');
  R(x,2,4,36,12,'#101014');R(x,3,5,34,10,'#F0F0F0');x.save();x.beginPath();x.rect(3,5,34,10);x.clip();for(let i=-10;i<40;i+=8){for(let j=0;j<10;j++)R(x,3+i+j,5+j,4,1,'#D02020');}x.restore();
  R(x,4,16,3,14,'#606068');R(x,33,16,3,14,'#606068');R(x,1,28,9,2,'#303038');R(x,30,28,9,2,'#303038');
  R(x,8,17,27,10,'#F8D030');R(x,8,17,27,1,'#101014');ptext(x,'OBRA',10,19,'#101014',1);ell(x,36,3,2,2,'#F89020');return c;}
function tachoSpr(){const c=mk(20,32),x=c.getContext('2d');
  R(x,9,12,3,20,'#4A4A52');R(x,2,4,16,16,'#1E5A32');R(x,3,5,14,14,'#2E7A44');for(let i=4;i<17;i+=3)R(x,i,6,1,12,'#1E5A32');R(x,1,3,18,2,'#3E9A56');R(x,6,2,4,2,'#E8E4DC');R(x,11,1,3,3,'#E84040');return c;}
const PUESTO=puestoSpr(),CABINA=cabinaSpr(),BUZON=buzonSpr(),PARADA=paradaSpr(),ARBOL=arbolSpr(),VALLA=vallaSpr(),TACHO=tachoSpr();

// ---------- ítems ----------
let STAND=null;
function spr(w,h,fn){const c=mk(w,h),x=c.getContext('2d');for(let j=0;j<h;j++)for(let i=0;i<w;i++){const col=fn(i,j);if(col)R(x,i,j,1,1,col);}return c;}
const LIME=spr(25,25,(i,j)=>{const dx=i-12,dy=j-12,d=Math.hypot(dx,dy);if(d>12.2)return null;if(d>11.2)return '#123A12';if(d>9.8)return (dx<0&&dy<0)?'#5AB83A':'#3E8E2A';if(d>8.8)return '#2E6A1E';if(d>7.6)return '#F0F8D0';
  if(d<1.4)return '#FAFCE8';const a=(Math.atan2(dy,dx)+Math.PI*2)%(Math.PI/4);if(a<.12||a>Math.PI/4-.12)return '#F4FAD8';
  if(dx<-2&&dy<-2&&d<6)return (i+j)%2?'#D8EC88':'#C8E470';return (i*3+j*5)%7===0?'#98C838':'#AED450';});
const CAP=(()=>{const c=mk(24,24),x=c.getContext('2d');
  for(let i=0;i<24;i++){const a=i/24*Math.PI*2;const px=12+Math.cos(a)*10.5,py=12+Math.sin(a)*10.5;ell(x,Math.round(px),Math.round(py),1,1,i%2?'#9CA0AC':'#5A5E6A');}
  ell(x,12,12,10,10,'#3A3E48');for(let i=0;i<24;i++){const a=i/24*Math.PI*2;R(x,Math.round(12+Math.cos(a)*10),Math.round(12+Math.sin(a)*10),1,1,i%2?'#D0D4DC':'#6A6E7A');}
  ell(x,12,12,9,9,'#0A3A1C');ell(x,12,12,8,8,'#1E8A3A');ell(x,11,11,7,7,'#2A9A46');ell(x,9,8,3,2,'#6AC878');
  ell(x,10,13,3,3,'#F8F8F0');ell(x,10,13,2,2,'#2A9A46');ell(x,15,9,2,2,'#F8F8F0');R(x,15,9,1,1,'#2A9A46');ell(x,15,15,1,1,'#F8F8F0');R(x,8,7,1,1,'#F8F8F0');R(x,17,13,1,1,'#F8D030');return c;})();

STAND=standSpr();
function vendorFrame(wave){const c=mk(52,50),x=c.getContext('2d');
  const K='#101010',Sk='#EDB88E',Ss='#C98A62',Hr='#A8A8A8',Hd='#707070',Mu='#5A4232',Ap='#1E7B34',Ad='#12521F',Al='#3E9A56',Sh='#F4F4F0',Ssh='#C8C8C0';
  // brazos
  const ay=wave?[4,2,4][wave-1]:22;
  if(wave){R(x,39,20,5,-1,K);ell(x,42,ay+10,3,10,K);ell(x,42,ay+10,2,9,Sh);ell(x,43,ay,4,4,K);ell(x,43,ay,3,3,Sk);R(x,44,ay-4,1,3,Sk);}
  // cuerpo: camisa y delantal
  ell(x,24,44,16,12,K);ell(x,24,44,15,11,Sh);ell(x,16,44,5,9,Ssh);
  R(x,14,34,20,16,K);R(x,15,35,18,15,Ap);R(x,15,35,3,15,Ad);R(x,30,35,3,15,Al);R(x,20,40,8,6,Ad);R(x,21,40,6,1,'#F5EEDC');
  R(x,15,33,2,4,Ap);R(x,31,33,2,4,Ap);R(x,17,31,2,3,Ap);R(x,29,31,2,3,Ap);
  if(!wave){ell(x,40,40,4,7,K);ell(x,40,40,3,6,Sh);ell(x,40,46,3,3,K);ell(x,40,46,2,2,Sk);}
  ell(x,8,40,4,7,K);ell(x,8,40,3,6,Ssh);ell(x,8,46,3,3,K);ell(x,8,46,2,2,Ss);
  // cabeza
  R(x,20,26,8,5,K);R(x,21,26,6,5,Sk);
  ell(x,24,15,11,12,K);ell(x,24,15,10,11,Sk);ell(x,20,18,4,6,Ss);
  ell(x,13,16,2,3,K);ell(x,13,16,1,2,Ss);ell(x,35,16,2,3,K);ell(x,35,16,1,2,Sk);
  R(x,14,9,4,8,Hr);R(x,31,9,4,8,Hr);R(x,15,8,3,2,Hd);R(x,31,8,3,2,Hd);R(x,20,5,8,1,'#F8D8B8');
  R(x,18,12,3,1,K);R(x,27,12,3,1,K);R(x,18,11,1,1,K);R(x,29,11,1,1,K);
  ell(x,24,17,2,2,'#D88A6A');R(x,23,16,1,1,'#F8C8A8');
  R(x,17,20,14,3,Mu);R(x,16,21,2,2,Mu);R(x,30,21,2,2,Mu);R(x,19,20,10,1,'#7A5A44');
  R(x,20,23,8,1,K);R(x,19,22,1,1,K);R(x,28,22,1,1,K);R(x,21,24,6,1,'#C85050');
  ell(x,16,19,2,1,'#F09A8A');ell(x,32,19,2,1,'#F09A8A');
  return c;}
const VENDOR=[vendorFrame(0),vendorFrame(1),vendorFrame(2),vendorFrame(3)];
// ---------- enemigos ----------
function bearFrame(fr){const c=mk(52,56),x=c.getContext('2d');const K='#1A2030',Wf='#F4F8FC',Sf='#C0D0E0',Df='#8CA0B8',Rd='#D02828',Rs='#8E1414',Rl='#F05858';
  const sw=[-3,0,3,0][fr],bob=fr%2?1:0;
  // piernas
  ell(x,20-sw,47,6,7,K);ell(x,20-sw,47,5,6,Sf);ell(x,31+sw,47,6,7,K);ell(x,31+sw,47,5,6,Wf);R(x,14-sw,52,12,3,K);R(x,25+sw,52,12,3,K);R(x,15-sw,52,10,2,Df);R(x,26+sw,52,10,2,Sf);
  // brazo de atrás
  ell(x,16+sw,34+bob,4,7,K);ell(x,16+sw,34+bob,3,6,Sf);
  // cuerpo de pelo blanco
  ell(x,26,34+bob,14,12,K);ell(x,26,34+bob,13,11,Wf);ell(x,21,37+bob,6,7,Sf);ell(x,29,38+bob,6,5,'#E6EEF6');
  for(let i=0;i<9;i++)R(x,16+((i*7)%20),28+bob+((i*5)%14),2,1,Sf);
  // brazo de adelante
  ell(x,36-sw,35+bob,4,7,K);ell(x,36-sw,35+bob,3,6,Wf);R(x,33-sw,40+bob,6,2,Df);R(x,35-sw,31+bob,2,5,Sf);
  // bufanda roja
  R(x,15,22+bob,24,7,K);R(x,16,23+bob,22,5,Rd);R(x,16,23+bob,22,1,Rl);for(let i=17;i<37;i+=4)R(x,i,24+bob,2,4,Rs);
  const tb=fr%2?1:0;R(x,13-tb,24+bob,5,15,K);R(x,14-tb,25+bob,3,13,Rd);R(x,14-tb,27+bob,3,1,Rs);R(x,14-tb,31+bob,3,1,Rs);
  for(let i=0;i<3;i++)R(x,14-tb+i,38+bob,1,3,i%2?Rs:Rd);
  // cabeza
  const hy=15+bob;ell(x,19,hy-8,4,4,K);ell(x,19,hy-8,3,3,Wf);ell(x,19,hy-8,1,1,Df);ell(x,32,hy-9,4,4,K);ell(x,32,hy-9,3,3,Wf);ell(x,32,hy-9,1,1,Df);
  ell(x,27,hy,13,11,K);ell(x,27,hy,12,10,Wf);ell(x,24,hy+3,8,6,Sf);ell(x,29,hy-3,8,5,Wf);
  ell(x,38,hy+3,7,5,K);ell(x,38,hy+3,6,4,Wf);R(x,34,hy+5,8,2,Sf);ell(x,43,hy+1,2,2,K);R(x,42,hy,1,1,'#6A7080');R(x,39,hy+6,4,1,K);
  R(x,32,hy-3,3,3,K);R(x,33,hy-3,1,1,'#FFFFFF');R(x,30,hy-6,6,1,K);R(x,35,hy-5,1,1,K);
  R(x,17,23+bob,20,5,Rd);R(x,17,23+bob,20,1,Rl);for(let i=18;i<36;i+=4)R(x,i,24+bob,2,4,Rs);R(x,16,22+bob,22,1,K);R(x,16,28+bob,22,1,K);
  return c;}
const BEAR=[0,1,2,3].map(bearFrame);
const BEARSQ=(()=>{const c=mk(52,56),x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(BEAR[1],0,0,52,56,0,38,52,18);return c;})();
const ORANGE=(()=>{const c=mk(32,34),x=c.getContext('2d'),rn=seeded(4);
  ell(x,16,19,14,14,'#5A2400');ell(x,16,19,13,13,'#E07010');ell(x,14,17,11,11,'#F08A1C');ell(x,11,13,5,4,'#FFB850');R(x,9,11,3,2,'#FFE0A0');
  for(let i=0;i<60;i++){const px=4+Math.floor(rn()*24),py=7+Math.floor(rn()*24);if(Math.hypot(px-16,py-19)<12)R(x,px,py,1,1,rn()<.5?'#C85A08':'#F8A040');}
  
  R(x,15,4,2,4,'#5A3A10');ell(x,21,4,5,2,'#2E7A20');ell(x,20,3,3,1,'#5AB83A');
  if(false){R(x,12,18,2,2,'#101010');R(x,21,18,2,2,'#101010');R(x,8,13,6,1,'#3A1400');R(x,9,14,2,1,'#3A1400');R(x,18,13,6,1,'#3A1400');R(x,21,14,2,1,'#3A1400');
  }
  R(x,20,22,1,1,'#C85A08');R(x,22,24,1,1,'#C85A08');R(x,18,26,1,1,'#C85A08');return c;})();

// ---------- personajes (B/N con detalle) ----------
const CK='#101010',CW='#F6F6F6',CL='#D0D0D0',CM='#8E8E8E',CD='#343434',CD2='#5C5C5C';
const STYLES=[
  {id:'tranqui',name:'EL TRANQUI',desc:'Anda a su ritmo. Nada lo apura.',sp:1,jp:1,lives:3,stats:[3,3,3],hat:'cap',top:'tee',bot:'shorts',shoe:'chunky',face:'smile'},
  {id:'rockero',name:'EL ROCKERO',desc:'Pesado para caer. Aguanta todo.',sp:.93,jp:1,lives:4,stats:[2,3,4],hat:'hair',top:'jacket',bot:'jeans',shoe:'boots',face:'shades'},
  {id:'pibe10',name:'EL PIBE 10',desc:'El más rápido del barrio.',sp:1.13,jp:.97,lives:3,stats:[5,2,3],hat:'band',top:'jersey',bot:'sport',shoe:'hightop',face:'focus'},
  {id:'dj',name:'EL DJ',desc:'Salta como si sonara un tema.',sp:1,jp:1.08,lives:3,stats:[3,5,2],hat:'bucket',top:'wind',bot:'track',shoe:'chunky',face:'chill',phones:true}];
const POSES=[{b:[-7,0],f:[7,0],a:4},{b:[-2,0],f:[3,-6],a:0},{b:[7,0],f:[-7,0],a:-4},{b:[3,-6],f:[-2,0],a:0},{b:[-6,-3],f:[6,-10],a:-9,j:1},{b:[-3,0],f:[3,0],a:1}];
function charFrame(st,pi){
  const c=mk(48,82),x=c.getContext('2d'),P=POSES[pi];
  const oE=(cx,cy,rx,ry,f)=>{ell(x,cx,cy,rx+1,ry+1,CK);ell(x,cx,cy,rx,ry,f);};
  const oR=(x0,y0,w,h,f,round)=>{R(x,x0,y0,w,h,CK);R(x,x0+1,y0+1,w-2,h-2,f);if(round){R(x,x0,y0,1,1,'rgba(0,0,0,0)');}};
  const cr=(x0,y0,w,h)=>{x.clearRect(x0,y0,1,1);x.clearRect(x0+w-1,y0,1,1);};
  const limb=(x0,y0,x1,y1,wd,f,outline)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1;
    if(outline!==false)for(let i=0;i<=n;i++){const px=Math.round(x0+(x1-x0)*i/n),py=Math.round(y0+(y1-y0)*i/n);R(x,px-1,py-1,wd+2,wd+2,CK);}
    for(let i=0;i<=n;i++){const px=Math.round(x0+(x1-x0)*i/n),py=Math.round(y0+(y1-y0)*i/n);R(x,px,py,wd,wd,f);}};
  const hipY=52,groundY=74;
  const legW={shorts:3,sport:3,jeans:5,track:5}[st.bot],legF={shorts:CW,sport:CW,jeans:CD2,track:CD}[st.bot];
  const leg=(hx,d,back)=>{const fx=hx+d[0],fy=groundY+d[1],kx=Math.round((hx+fx)/2+(d[1]<0?4:0)),ky=Math.round((hipY+fy)/2+(d[1]<0?-2:0));
    limb(hx,hipY,kx,ky,legW,back&&legW===3?CL:legF);limb(kx,ky,fx,fy-4,legW,back&&legW===3?CL:legF);
    if(st.bot==='sport'){limb(kx,ky+3,fx,fy-4,3,CW);R(x,fx,fy-9,4,1,CK);R(x,fx,fy-7,4,1,CM);}
    if(st.bot==='jeans'&&!back){R(x,kx+1,ky,3,2,CW);R(x,kx+1,ky,3,1,CK);}
    if(st.bot==='track'){limb(kx+2,ky,fx+2,fy-4,1,CW,false);}
    shoe(fx,fy,back);};
  const shoe=(fx,fy,back)=>{const f=back?CL:CW;
    if(st.shoe==='boots'){oR(fx-3,fy-9,9,11,back?CD2:CD);oE(fx+4,fy-1,5,3,back?CD2:CD);R(x,fx-3,fy+1,14,2,CM);R(x,fx-4,fy+3,16,1,CK);R(x,fx-1,fy-7,1,5,CD2);return;}
    if(st.shoe==='hightop'){oR(fx-3,fy-8,9,10,f);oE(fx+4,fy-1,6,3,f);R(x,fx-3,fy+1,15,2,CM);R(x,fx-4,fy+3,17,1,CK);R(x,fx-1,fy-6,6,1,CK);R(x,fx,fy-4,6,1,CK);R(x,fx+6,fy-2,3,1,CK);return;}
    oE(fx+4,fy-1,7,4,f);oR(fx-4,fy-6,10,6,f);R(x,fx-4,fy+1,17,2,CM);R(x,fx-5,fy+3,19,1,CK);R(x,fx+2,fy-3,1,1,CK);R(x,fx+4,fy-3,1,1,CK);R(x,fx+6,fy-2,1,1,CK);R(x,fx-2,fy-5,6,1,CL);R(x,fx-2,fy-5,6,1,CL);R(x,fx+7,fy,3,1,CL);};
  const sleeveLong=st.top==='jacket'||st.top==='wind',armF=st.top==='jacket'?CD:st.top==='wind'?CW:CW;
  const arm=(sx,sy,sw,back)=>{const hx=sx+sw,hy=P.j?sy-12:sy+17;const ex=Math.round((sx+hx)/2)-(P.j?2:0),ey=Math.round((sy+hy)/2);
    const f=sleeveLong?(back?(st.top==='jacket'?CD2:CL):armF):(back?CL:CW);
    limb(sx,sy,ex,ey,sleeveLong?4:3,f);limb(ex,ey,hx,hy,sleeveLong?4:3,f);
    if(sleeveLong){if(st.top==='wind'){R(x,ex,ey,4,2,CD);}R(x,hx,hy+(P.j?-1:3),4,1,CK);}
    oE(hx+1,hy+(P.j?-3:5),2,2,back?CL:CW);};
  // pelo largo detrás
  if(st.hat==='hair'){oR(13,5,13,24,CD);R(x,15,8,2,18,CD2);R(x,19,10,1,16,CD2);}
  // brazo y pierna de atrás
  arm(15,26,-P.a,true);
  leg(20,P.b,true);leg(27,P.f,false);
  // parte de abajo
  if(st.bot==='shorts'){oR(13,41,22,15,CW);R(x,14,42,3,13,CL);R(x,24,48,1,8,CK);R(x,14,53,20,1,CL);R(x,29,44,3,1,CL);}
  else if(st.bot==='sport'){oR(14,41,20,12,CW);R(x,15,42,20-2,1,CL);R(x,31,42,2,10,CM);R(x,24,47,1,6,CK);}
  else if(st.bot==='jeans'){oR(14,41,20,10,CD2);R(x,14,42,20,2,CK);R(x,23,42,2,2,CM);R(x,24,46,1,5,CK);for(let i=0;i<5;i++)R(x,17+i*2,45+(i%2),1,1,CL);}
  else{oR(14,41,20,10,CD);R(x,30,42,1,9,CW);R(x,24,46,1,5,CK);}
  // torso
  if(st.top==='tee'){oR(9,23,7,11,CL);oR(12,22,23,24,CW);R(x,13,23,4,22,CL);R(x,13,43,21,2,CL);R(x,20,22,8,2,CK);R(x,21,23,6,1,CL);
    R(x,23,29,6,6,CK);R(x,24,30,4,4,CW);R(x,25,31,1,1,CK);R(x,27,31,1,1,CK);R(x,25,33,3,1,CK);oR(31,23,7,11,CW);R(x,32,32,5,1,CL);}
  else if(st.top==='jacket'){oR(12,22,23,24,CD);R(x,13,23,3,22,CK);R(x,25,24,6,21,CW);R(x,26,26,4,6,CM);R(x,27,27,2,1,CK);R(x,24,22,2,10,CD2);R(x,31,22,2,10,CD2);R(x,24,32,1,13,CK);R(x,31,32,1,13,CK);R(x,33,34,1,4,CM);R(x,17,38,5,1,CD2);}
  else if(st.top==='jersey'){oR(14,22,20,25,CW);R(x,15,23,3,23,CL);R(x,19,22,10,3,CK);R(x,20,23,8,1,CW);R(x,32,24,2,20,CM);R(x,15,24,1,20,CM);
    const dg={'1':["010","110","010","010","111"],'0':["111","101","101","101","111"]};let nx=21;for(const ch of '10'){dg[ch].forEach((row,j)=>{for(let i=0;i<3;i++)if(row[i]==='1')R(x,nx+i,29+j*2,1,2,CK);});nx+=5;}}
  else{oR(11,21,26,26,CW);R(x,12,22,4,24,CL);R(x,12,30,24,4,CD);R(x,12,34,24,2,CM);R(x,29,22,1,24,CK);R(x,30,26,1,1,CM);R(x,12,44,24,2,CL);oR(18,19,12,5,CW);R(x,19,22,10,1,CL);}
  if(st.phones){oE(19,22,3,3,CD);oE(30,22,3,3,CD);R(x,19,20,12,1,CK);R(x,18,21,1,1,CM);R(x,29,21,1,1,CM);}
  // brazo de adelante
  arm(31,26,P.a,false);
  // cuello y cabeza
  R(x,21,17,5,6,CK);R(x,22,17,3,6,CW);
  oE(25,10,8,9,CW);ell(x,21,13,3,5,CL);R(x,23,19,6,1,CL);
  oE(18,11,2,3,CW);R(x,18,11,1,2,CL);
  const f=st.face;
  if(f==='shades'){R(x,24,8,9,4,CK);R(x,25,9,2,1,CM);R(x,29,9,2,1,CM);R(x,21,9,3,1,CK);R(x,27,15,5,1,CK);}
  else{R(x,29,8,1,3,CK);if(f==='focus'){R(x,27,6,4,1,CK);R(x,30,7,2,1,CK);}else R(x,28,6,3,1,CK);
    if(f==='chill'){R(x,28,9,3,1,CK);R(x,28,8,1,1,CW);}
    R(x,27,15,4,1,CK);if(f==='smile'||f==='chill')R(x,31,14,1,1,CK);}
  R(x,33,11,1,2,CK);
  // sombreros y pelo
  if(st.hat==='cap'){oR(16,0,18,8,CD);cr(16,0,18,8);R(x,18,1,12,1,CD2);R(x,24,0,2,1,CM);oR(9,5,9,3,CD);R(x,10,6,7,1,CD2);}
  else if(st.hat==='hair'){oE(25,4,9,4,CD);R(x,20,2,10,1,CD2);R(x,30,5,4,3,CD);R(x,31,6,2,1,CD2);}
  else if(st.hat==='band'){oE(25,3,8,3,CM);R(x,20,2,9,1,CL);R(x,16,5,19,4,CK);R(x,17,6,17,2,CW);R(x,23,6,5,2,CD);oR(12,6,5,6,CW);}
  else{oE(25,4,8,4,CW);R(x,19,3,9,1,CL);oR(13,6,24,4,CW);R(x,14,8,22,1,CL);R(x,17,5,16,1,CK);}
  return c;}
function buildChar(st){return {walk:[0,1,2,3].map(i=>charFrame(st,i)),jump:charFrame(st,4),idle:charFrame(st,5)};}
let CHAR=null,CHOSEN=0;

// ---------- nivel ----------
const groundSegs=[[0,600],[666,466],[1214,334],[1634,600],[2320,700],[3100,560],[3740,560]];
const platsOLD=[[280,216,106,'and'],[426,180,94,'toldo'],[766,216,120,'toldo'],[934,172,100,'and'],[1266,216,94,'and'],[1434,176,120,'toldo'],[1734,216,106,'toldo'],[1880,176,106,'and'],[2040,140,94,'and'],[2234,216,80,'toldo'],[2466,216,134,'and'],[2654,176,106,'toldo']];
const solids=[];
groundSegs.forEach(([x,w])=>solids.push({x,y:G,w,h:LH-G+100,g:true}));
// cada plataforma es parte de algo real del barrio
const plats=[[280,226,106,'refugio'],[880,212,120,'flores'],[1266,232,96,'cajones'],[1434,190,120,'cartel'],[1790,226,106,'refugio'],[2000,230,96,'subte','PERU'],[2420,196,100,'and'],[2540,280,48,'hoist'],[2760,190,106,'cartel'],[3160,226,150,'camion'],[3850,0,120,'mesa']];
plats.forEach(([x,y,w,k,st])=>{
  if(k==='mesa'){solids.push({x,y:-9999,w,h:0,one:true,k:'mesa'});solids.push({x:x+33,y:G-38,w:54,h:8,one:true,k:'mesatop'});solids.push({x:x+12,y:G-112,w:96,h:10,one:true,k:'sombrilla'});return;}
  if(k==='fuente'){solids.push({x,y:G-22,w,h:22,one:false,k,solid:1});solids.push({x:x+w/2-12,y:G-62,w:24,h:40,one:false,k:'cabina',solid:1});return;}
  if(k==='subte'){solids.push({x,y,w,h:12,one:true,k,st});return;}
  if(k==='flores'){solids.push({x:x-7,y,w:w+14,h:12,one:true,k,bounce:1,sq:0,rx:x,rw:w});return;}
  if(k==='hoist'){solids.push({x,y,w,h:10,one:true,k,mv:{y0:280,y1:140,sp:.022}});return;}
  if(k==='taxi'){solids.push({x,y:y+11,w,h:G-y-11,one:false,k,solid:1,ty:y});solids.push({x:x+17,y,w:w-36,h:12,one:true,k:'cabina'});return;}
  if(k==='cajones'||k==='volquete'){solids.push({x,y,w,h:G-y,one:false,k,solid:1});return;}
  if(k==='camion'){solids.push({x:x-18,y:G-26,w:18,h:26,one:false,k:'cabina',solid:1});solids.push({x,y,w,h:G-y,one:false,k,solid:1});solids.push({x:x+w,y:y+8,w:36,h:G-(y+8),one:false,k:'cabina',solid:1});solids.push({x:x+w+36,y:y+40,w:30,h:G-(y+40),one:false,k:'cabina',solid:1});return;}
  solids.push({x,y,w,h:12,one:true,k});});
const props=[[60,'arbol'],[190,'buzon'],[668,'puesto'],[1382,'tacho'],[1650,'arbol'],[2150,'buzon'],[2336,'cabina'],[2900,'tacho'],[3430,'arbol'],[4040,'tacho']];
props.filter(p=>p[1]==='puesto').forEach(([x])=>solids.push({x:x,y:G-84,w:112,h:9,one:true,k:'roof'}));
const gaps=[[600,666],[1132,1214],[1548,1634],[2234,2320],[3020,3100],[3660,3740]];
const capPos=[[334,196],[940,86],[1494,160],[1860,200],[2048,206],[2564,110],[3244,190]];
const limeRows=[[120,284,4],[560,284,2],[706,196,4],[1386,284,3],[1700,284,2],[1790,204,2],[2440,172,3],[2640,284,4],[2860,284,3],[3168,204,2],[3560,284,3],[3880,150,3],[3990,284,2]];
const bearDefs=[[506,414,586],[1040,1030,1126],[1450,1370,1540],[1834,1646,2000],[2680,2600,2740],[2880,2840,3000],[3480,3440,3600],[3790,3760,3840]];
const orangeDefs=[[1080,1050,1120],[2000,1920,2200],[300,220,520],[3560,3450,3640]];

let S;
function reset(){
  const items=[];
  capPos.forEach(([x,y])=>items.push({x,y,t:'cap',got:false,b:Math.random()*6}));
  limeRows.forEach(([x,y,n])=>{for(let i=0;i<n;i++)items.push({x:x+i*24,y,t:'lime',got:false,b:Math.random()*6});});
  const en=bearDefs.map(([x,min,max])=>({t:'bear',x,y:G-50,w:30,h:50,v:.8,min,max,dead:0}))
    .concat(orangeDefs.map(([x,min,max])=>({t:'orange',x,y:G-120-Math.random()*60,vy:0,w:24,h:26,v:1.1,min,max,dead:0,sq:0})));
  const st=STYLES[CHOSEN];
  S={p:{x:40,y:G-64,vx:0,vy:0,w:20,h:62,dir:1,on:false,coy:0,buf:0,inv:0,walk:0,land:0},cam:0,lives:st.lives,maxLives:st.lives,sp:st.sp,jp:st.jp,caps:0,limes:0,kills:0,warnT:0,drinkT:0,
     t:0,f:0,dust:[],ballHit:0,greetT:0,greeted:0,floGreet:0,floT:0,warpT:0,birds:[460,1720,3560].flatMap(bx=>[0,1,2].map(i=>({x:bx+i*9+(i%2)*3,y:G-1,st:0,vx:0,vy:0,ph:Math.random()*6,d:i%2?1:-1}))),state:'menu',safe:solids[0],items,pops:[],enemies:en,totalLimes:items.filter(i=>i.t==='lime').length,
     traffic:[{spr:TAXI,x:200,v:1.6,lane:0},{spr:BUS2,x:900,v:-1.1,lane:1},{spr:CARS[0],x:1400,v:1.3,lane:0}],spawnT:120};
}
reset();

const keys={left:false,right:false,jump:false,down:false};
const map={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'jump',KeyW:'jump',Space:'jump',ArrowDown:'down',KeyS:'down'};
addEventListener('keydown',e=>{const k=map[e.code];if(!k)return;e.preventDefault();if(k==='jump'&&!keys.jump)S.p.buf=8;keys[k]=true;});
addEventListener('keyup',e=>{const k=map[e.code];if(k)keys[k]=false;});
document.querySelectorAll('.touch button').forEach(b=>{const k=b.dataset.k;
  b.addEventListener('pointerdown',e=>{e.preventDefault();if(k==='jump')S.p.buf=8;keys[k]=true;b.setPointerCapture(e.pointerId);});
  ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>b.addEventListener(ev,()=>keys[k]=false));});

function ov(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function pop(x,y,txt){S.pops.push({x,y,txt,t:0});}
function hurt(fell,e){const p=S.p;S.lives--;if(S.lives<=0){finish(false);return;}p.inv=90;
  if(fell){p.x=S.safe.x+20;p.y=S.safe.y-p.h-30;p.vx=0;p.vy=0;}else{p.vy=-5.2;p.vx=(p.x+p.w/2<e.x+e.w/2)?-4:4;}}

function updateTraffic(k){
  for(const c of S.traffic)c.x+=c.v*k;
  S.traffic=S.traffic.filter(c=>c.x>-400&&c.x<LEVEL_W*0.7+800);
  S.spawnT-=k;if(S.spawnT<=0){S.spawnT=160+Math.random()*220;
    const lane=Math.random()<.5?0:1,v=(lane?-1:1)*(1+Math.random()*1.2);const r=Math.random();
    const spr=r<.42?TAXI:r<.53?BUS:r<.66?BUS2:CARS[Math.floor(Math.random()*3)];
    const camL=S.cam*.7;S.traffic.push({spr,x:v>0?camL-200:camL+LW+60,v,lane});}
}
function update(k){
  const p=S.p;S.t+=k/60;S.f+=k;
  const dir=(keys.right?1:0)-(keys.left?1:0);
  const sk=CPX[CHOSEN]&&SET[CHOSEN].mode==='skate';if(dir){p.vx+=dir*(sk?.45:.6)*S.sp*k;p.dir=dir;}else p.vx*=Math.pow(sk?.94:.78,k);
  if(Math.abs(p.vx)<.04)p.vx=0;const mx=4.4*S.sp;p.vx=Math.max(-mx,Math.min(mx,p.vx));
  if(p.buf>0)p.buf-=k;if(p.coy>0)p.coy-=k;if(p.inv>0)p.inv-=k;
  if(p.buf>0&&(p.on||p.coy>0)){p.vy=-9.4*S.jp;p.on=false;p.coy=0;p.buf=0;SFX.jump();}
  if(p.bounced&&p.vy>=0)p.bounced=0;
  if(!keys.jump&&p.vy<-3.4&&!p.bounced)p.vy=-3.4;
  p.vy=Math.min(10,p.vy+.42*k);
  for(const s2 of solids){if(!s2.mv)continue;const ny=s2.mv.y0+(s2.mv.y1-s2.mv.y0)*(.5-.5*Math.cos(S.f*s2.mv.sp));const dy=ny-s2.y;s2.y=ny;if(p.onS===s2&&wasOnPrev(p))p.y+=dy;}
  for(const s2 of solids)if(s2.sq>0)s2.sq-=k;
  p.x+=p.vx*k;if(p.x<0){p.x=0;p.vx=0;}if(p.x>LEVEL_W-p.w){p.x=LEVEL_W-p.w;p.vx=0;}
  for(const s of solids)if(!s.one&&ov(p,s)){if(p.vx>0)p.x=s.x-p.w;else if(p.vx<0)p.x=s.x+s.w;p.vx=0;}
  const wasOn=p.on,prevB=p.y+p.h,fallV=p.vy;p.on=false;p.onS=null;p.y+=p.vy*k;
  for(const s of solids)if(ov(p,s)){
    if(s.one){if(p.vy>=0&&prevB<=s.y+(s.mv?4:1)){p.y=s.y-p.h;
      if(s.bounce){p.vy=-14.2;p.on=false;p.bounced=1;s.sq=14;p.land=0;SFX.boing();continue;}
      p.on=true;p.vy=0;p.onS=s;}continue;}
    if(p.vy>0){p.y=s.y-p.h;p.on=true;p.vy=0;S.safe=s;p.onS=s;}else if(p.vy<0){p.y=s.y+s.h;p.vy=0;}}
  if(wasOn&&!p.on&&p.vy>=0)p.coy=6;
  if(!wasOn&&p.on&&fallV>5){p.land=8;SFX.land();}if(p.land>0)p.land-=k;
  if(p.y>LH+60){SFX.fall();hurt(true);if(S.state!=='play')return;}
  p.walk+=Math.abs(p.vx)*k*.07;
  for(const e of S.enemies){
    if(e.dead){e.dead+=k;continue;}
    e.x+=e.v*k;if(e.x<e.min){e.x=e.min;e.v*=-1;}if(e.x+e.w>e.max){e.x=e.max-e.w;e.v*=-1;}
    if(e.t==='orange'){e.vy+=.34*k;e.y+=e.vy*k;if(e.sq>0)e.sq-=k;if(e.y+e.h>=G){e.y=G-e.h;e.vy=-8.6;e.sq=8;}}
    if(ov(p,e)){
      if(p.vy>0&&prevB-e.y<16){e.dead=1;p.vy=-6.8;S.kills++;pop(e.x+e.w/2,e.y-8,'200');e.t==='bear'?SFX.bear():SFX.orange();}
      else if(p.inv<=0){SFX.hurt();hurt(false,e);if(S.state!=='play')return;}
    }
  }
  const cx=p.x+p.w/2,cy=p.y+p.h/2;
  for(const it of S.items){if(it.got)continue;const r=it.t==='lime'?22:16;
    if(Math.abs(it.x-cx)<r&&Math.abs(it.y-cy)<r+22){it.got=true;if(it.t==='cap'){S.caps++;pop(it.x,it.y-16,S.caps+'/7');SFX.lime();}else{S.limes++;SFX.cap();}}}
  S.pops.forEach(q=>q.t+=k);S.pops=S.pops.filter(q=>q.t<50);
  S.cam+=(p.x-LW*.38-S.cam)*Math.min(1,.12*k);S.cam=Math.max(0,Math.min(LEVEL_W-LW,S.cam));
  if(S.warnT>0)S.warnT-=k;
  S.inSubte=subteZone();if(S.inSubte&&keys.down){S.state='warp';S.warpT=0;S.warped=0;keys.down=false;SFX.subte();return;}
  for(const b of S.birds){if(b.st===0){if(Math.abs(p.x+p.w/2-b.x)<70&&Math.abs(p.y+p.h-G)<80){b.st=1;const sg=b.x>p.x?1:-1;b.vx=sg*(1.4+Math.random()*1.2);b.vy=-(1.8+Math.random()*1.2);if(!S.flapT||S.flapT<=0){SFX.flap();S.flapT=20;}}}
    else if(b.y>-30){b.x+=b.vx*k;b.y+=b.vy*k;b.vy-=.015*k;}}
  if(S.flapT>0)S.flapT-=k;
  if(S.greetT>0)S.greetT-=k;
  if(S.floT>0)S.floT-=k;
  if(p.x>GOAL_X-150&&!S.greeted){S.greeted=1;S.greetT=220;SFX.talk();}
  if(p.x>GOAL_X+30){
    if(S.caps>=7){startDrink();return;}
    if(S.warnT<=0){S.warnT=150;S.greetT=150;SFX.nope();}
  }
}
function wasOnPrev(p){return p.on;}
function subteZone(){const p=S.p;if(!solids.some(s2=>s2.k==='subte'&&s2.st!=='PERU'))return null;for(const s2 of solids){if(s2.k!=='subte'||s2.st!=='PERU')continue;const cx=p.x+p.w/2;if(cx>s2.x+22&&cx<s2.x+s2.w-22&&p.on&&p.y+p.h>=G-1)return s2;}return null;}
function updateWarp(k){const p=S.p;S.f+=k;S.warpT+=k;
  if(S.warpT>=34&&!S.warped){S.warped=1;const t=solids.find(s2=>s2.k==='subte'&&s2.st!=='PERU');p.x=t.x+t.w/2-p.w/2;p.y=G-p.h;p.vx=0;p.vy=0;p.dir=1;S.cam=Math.max(0,Math.min(LEVEL_W-LW,p.x-LW*.38));}
  if(S.warpT>=70){S.state='play';S.warpT=0;S.warped=0;}}
function startDrink(){S.greetT=9999;S.state='drink';S.drinkT=0;S.p.vx=0;S.p.dir=1;SFX.drink();}
function updateDrink(k){S.f+=k;const t0=S.drinkT;S.drinkT+=k/60;const t=S.drinkT;const p=S.p;
  if(p.y+p.h<G){p.vy=Math.min(10,(p.vy>0?p.vy:0)+.42*k);p.y=Math.min(G-p.h,p.y+p.vy*k);}else p.vy=0;
  let nsay=0;const say=(at,txt,dx)=>{if(t0<at&&t>=at)S.pops.push({x:p.x+10+(dx||0),y:p.y-24,txt,t:0,big:1});};
  
  S.pops.forEach(q=>q.t+=k*.7);S.pops=S.pops.filter(q=>q.t<50);
  if(t>4.1)finish(true);}
function score(win){return S.limes*10+S.caps*500+S.kills*200+(win?Math.max(0,Math.round((150-S.t)*20)):0);}
function finish(win){
  S.state='end';const sc=score(win);if(!win)SFX.over();
  document.getElementById('endTitle').textContent=win?'¡RECETA COMPLETA!':'GAME OVER';
  const m=Math.floor(S.t/60),s=String(Math.floor(S.t%60)).padStart(2,'0');
  document.getElementById('endStats').innerHTML=`Tapitas ${S.caps}/7<br>Limas ${S.limes}/${S.totalLimes}<br>Rivales ${S.kills}<br>Tiempo ${m}:${s}<br><span style="color:#F8D030">Puntaje ${String(sc).padStart(6,'0')}</span>`;
  document.getElementById('end').hidden=false;document.getElementById('again').focus();
}

// ---------- render ----------
function flipDraw(img,x,y,flip,w,h){w=w||img.width;h=h||img.height;if(!flip){g.drawImage(img,x,y,w,h);return;}g.save();g.translate(x+w,y);g.scale(-1,1);g.drawImage(img,0,0,w,h);g.restore();}
const SLOT={truck:null,bill:null,stand:null},slotCache={};
function slotImg(key,w,h,cover){const img=SLOT[key];if(!img||!img.naturalWidth)return null;const ck=key+w+'x'+h;if(slotCache[ck])return slotCache[ck];
  let dw,dh,sx=0,sy=0,sw=img.naturalWidth,sh=img.naturalHeight;
  if(cover){const r=Math.max(w/sw,h/sh);dw=w;dh=h;const cw=w/r,ch=h/r;sx=(sw-cw)/2;sy=(sh-ch)/2;sw=cw;sh=ch;}
  else{const r=Math.min(w/sw,h/sh);dw=Math.max(1,Math.round(sw*r));dh=Math.max(1,Math.round(sh*r));}
  const c=mk(dw,dh),x=c.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(img,sx,sy,sw,sh,0,0,dw,dh);
  const d=x.getImageData(0,0,dw,dh);for(let i=3;i<d.data.length;i+=4)d.data[i]=d.data[i]<110?0:255;x.putImageData(d,0,0);
  return slotCache[ck]=c;}
function setSlot(key,url,save){Object.keys(slotCache).forEach(k=>{if(k.startsWith(key))delete slotCache[k];});
  const pv=document.getElementById('adm_'+key);
  if(!url){SLOT[key]=null;if(pv)pv.getContext('2d').clearRect(0,0,pv.width,pv.height);if(save)store('u7-'+key,null);return;}
  const img=new Image();img.onload=()=>{SLOT[key]=img;if(pv){const h=40,w=Math.max(1,Math.round(img.naturalWidth*h/img.naturalHeight));pv.width=w;pv.height=h;pv.getContext('2d').drawImage(img,0,0,w,h);}
    if(save&&!url.startsWith('/_blob/')&&!store('u7-'+key,url))alert('La imagen es muy pesada para guardarla. Probá con un PNG más chico.');};img.src=url;}
let FLORIST_T=0;
function drawFlorist(fx,gy){
  const near=Math.abs(S.p.x-(fx-40))<130&&S.state==='play';
  if(near&&!S.floGreet){S.floGreet=1;S.floT=160;SFX.talk();}
  const wave=S.floT>0?1+Math.floor(S.f/8)%2:0;
  // reposera
  R(g,fx-2,gy-12,26,2,'#6A4A2A');R(g,fx,gy-10,2,10,'#6A4A2A');R(g,fx+20,gy-10,2,10,'#6A4A2A');R(g,fx+18,gy-30,2,20,'#6A4A2A');
  for(let i=0;i<6;i++)R(g,fx+2+i*3,gy-18+Math.floor(i/2),3,4,i%2?'#F4F4F0':'#E03040');for(let j=0;j<5;j++)R(g,fx+15,gy-30+j*4,3,4,j%2?'#F4F4F0':'#E03040');
  // señora
  const K='#101010',Sk='#E8B08A',Dr='#7A3A8A',Dl='#9A5AAA',Hr='#D8D8DC';
  R(g,fx+4,gy-22,13,9,K);R(g,fx+5,gy-21,11,7,Dr);R(g,fx+5,gy-21,11,2,Dl);
  R(g,fx+2,gy-14,10,4,K);R(g,fx+3,gy-13,8,2,Dr);R(g,fx+1,gy-10,3,9,K);R(g,fx+2,gy-10,1,8,Sk);R(g,fx,gy-2,5,2,K);
  R(g,fx+6,gy-32,11,12,K);R(g,fx+7,gy-31,9,10,Dr);R(g,fx+7,gy-31,2,10,Dl);
  if(wave){R(g,fx+4,gy-40-(wave===2?2:0),3,11,K);R(g,fx+5,gy-39-(wave===2?2:0),1,9,Sk);R(g,fx+3,gy-43-(wave===2?2:0),4,4,Sk);}
  else{R(g,fx+4,gy-28,3,8,K);R(g,fx+5,gy-27,1,6,Sk);}
  ell(g,fx+11,gy-37,5,5,K);ell(g,fx+11,gy-37,4,4,Sk);ell(g,fx+11,gy-41,5,3,Hr);R(g,fx+6,gy-40,2,4,Hr);ell(g,fx+15,gy-43,2,2,Hr);
  R(g,fx+8,gy-38,1,1,K);R(g,fx+12,gy-38,1,1,K);R(g,fx+9,gy-35,3,1,'#B04040');ell(g,fx+8,gy-36,1,1,'#F09A8A');
  if(S.floT>0)floBubble={x:fx+11+Math.round(S.cam),y:gy-46};
}
let floBubble=null,FLORIST_TXT='¡HOLA, QUERIDO!';
function topEdge(x,y,w){R(g,x,y-1,w,1,'#101010');R(g,x,y,w,3,'#F8D830');R(g,x,y+3,w,1,'#101010');for(let i=2;i<w-2;i+=8)R(g,x+i,y,4,1,'#FFF6C0');}
function drawPlatform(s,x){
  const y=s.y,w=s.w;
  if(s.k==='roof'){topEdge(x,y,w);return;}
  if(s.k==='cabina')return;
  if(s.k==='and'){
    // andamio de obra apoyado en el piso
    const posts=[];for(let px=x+4;px<x+w-4;px+=Math.max(30,Math.floor((w-8)/3)))posts.push(px);posts.push(x+w-8);
    for(const px of posts){R(g,px,y+12,4,G-y-12,'#3A3E48');R(g,px+1,y+12,1,G-y-12,'#A8ACB8');R(g,px-3,G-3,10,3,'#2A2A30');}
    for(let yy=y+34;yy<G-8;yy+=34){R(g,x+4,yy,w-8,3,'#4A4E58');R(g,x+4,yy,w-8,1,'#9CA0AA');
      for(let k=0;k<posts.length-1;k++){const x0=posts[k]+4,x1=posts[k+1],h=Math.min(34,G-8-yy);for(let i=0;i<x1-x0;i+=2)R(g,x0+i,yy+3+Math.floor(i*(h-4)/(x1-x0)),2,2,'#5A5E68');}}
    // red verde de obra
    for(let i=0;i<w-8;i+=2){const hgt=16+((i*7)%9);for(let j=0;j<hgt;j+=2)if(((i+j)/2)%2===0)R(g,x+4+i,y+12+j,1,1,'rgba(40,140,70,.55)');}
    R(g,x-1,y-1,w+2,14,'#101010');R(g,x,y,w,12,'#9A6430');R(g,x,y+4,w,1,'#6A3E18');R(g,x,y+8,w,1,'#6A3E18');
    for(let i=12;i<w;i+=26)R(g,x+i,y,1,12,'#6A3E18');
    topEdge(x,y,w);return;}
  if(s.k==='refugio'){
    // refugio de colectivo: techo sobre dos columnas, vidrio y banco
    R(g,x+6,y+12,4,G-y-12,'#2A2E38');R(g,x+w-10,y+12,4,G-y-12,'#2A2E38');R(g,x+7,y+12,1,G-y-12,'#8C909C');R(g,x+w-9,y+12,1,G-y-12,'#8C909C');
    R(g,x+10,y+16,w-20,G-y-40,'rgba(170,210,230,.35)');R(g,x+14,y+20,3,G-y-50,'rgba(255,255,255,.45)');R(g,x+22,y+20,1,G-y-60,'rgba(255,255,255,.35)');
    R(g,x+10,y+16,w-20,1,'#2A2E38');R(g,x+10,G-24,w-20,1,'#2A2E38');
    R(g,x+18,G-18,w-36,4,'#6A4A2A');R(g,x+18,G-18,w-36,1,'#9A6A42');R(g,x+22,G-14,2,14,'#2A2E38');R(g,x+w-24,G-14,2,14,'#2A2E38');
    R(g,x+w-40,y+22,22,16,'#1E4EA0');R(g,x+w-40,y+22,22,5,'#F0F0F0');ptext(g,'60',x+w-35,y+29,'#FFFFFF',1);
    R(g,x-4,y-1,w+8,14,'#101010');R(g,x-3,y,w+6,12,'#1E5A8A');R(g,x-3,y+8,w+6,4,'#143E60');R(g,x-3,y,w+6,2,'#4A8ACA');
    topEdge(x-3,y,w+6);return;}
  if(s.k==='camion'){
    // camión antiguo de reparto de gaseosas, con cajones a la vista
    const bot=G,X=x,Y=y,W=w;
    // paragolpes / escalón trasero
    R(g,X-19,G-27,20,28,'#101010');R(g,X-18,G-26,18,26,'#1E7B34');R(g,X-18,G-26,18,2,'#3E9A56');for(let i=0;i<18;i+=3)R(g,X-18+i,G-14,2,2,'#12521F');
    // carrocería
    R(g,X-1,Y-1,W+2,bot-Y+1,'#101010');R(g,X,Y,W,bot-Y,'#F4F4EE');R(g,X,Y,3,bot-Y,'#D8D8D0');
    // cartel superior liso
    R(g,X+6,Y+3,W-12,12,'#101010');R(g,X+7,Y+4,W-14,10,'#FBF8EE');R(g,X+7,Y+4,W-14,1,'#D82828');R(g,X+7,Y+13,W-14,1,'#D82828');
    // estantes con cajones de madera
    const ry=Y+18,rh=bot-26-ry;R(g,X+5,ry,W-10,rh,'#2A1E14');
    const rows=3,chh=Math.floor((rh-6)/rows);
    for(let r=0;r<rows;r++){const yy=ry+2+r*chh;R(g,X+5,yy+chh-2,W-10,2,'#E8E4DA');
      for(let cx=X+7;cx+11<X+W-6;cx+=12){R(g,cx,yy,11,chh-3,'#6A3E18');R(g,cx+1,yy+1,9,chh-5,'#D8A050');R(g,cx+1,yy+1,9,1,'#F0C070');R(g,cx+1,yy+chh-6,9,1,'#A8702C');
        R(g,cx+3,yy+Math.floor(chh/2)-2,5,3,'#D83020');R(g,cx+4,yy+Math.floor(chh/2)-1,3,1,'#F5EEDC');}}
    // zócalo verde con filete blanco
    R(g,X,bot-24,W,24,'#101010');R(g,X+1,bot-23,W-2,22,'#1E7B34');R(g,X+1,bot-23,W-2,2,'#3E9A56');R(g,X+1,bot-15,W-2,2,'#F4F4EE');R(g,X+1,bot-4,W-2,3,'#12521F');
    // guardabarros trasero
    const rw=X+Math.round(W*.58);ell(g,rw,bot-12,17,15,'#101010');ell(g,rw,bot-12,16,14,'#1E7B34');ell(g,rw-4,bot-18,9,5,'#3E9A56');
    // cabina blanca
    const cx=X+W,cy=Y+8;
    R(g,cx-1,cy-1,38,bot-cy+1,'#101010');R(g,cx,cy,36,bot-cy,'#F4F4EE');R(g,cx,cy,36,2,'#FFFFFF');R(g,cx,cy,3,bot-cy,'#D8D8D0');
    R(g,cx+14,cy+5,19,16,'#101010');R(g,cx+15,cy+6,17,14,'#2A3A58');R(g,cx+16,cy+7,5,8,'#7A98C8');R(g,cx+24,cy+7,2,5,'#7A98C8');
    R(g,cx+34,cy+4,4,2,'#303038');R(g,cx+37,cy+2,2,10,'#303038');
    R(g,cx+4,cy+24,30,1,'#B8B8B0');R(g,cx+4,bot-26,30,1,'#B8B8B0');R(g,cx+30,cy+30,4,2,'#707070');
    // lugar para el logo en la puerta
    const sl={x:cx+6,y:cy+27,w:24,h:Math.max(10,bot-26-(cy+27)-2)};
    const lg=slotImg('truck',sl.w,sl.h);if(lg)g.drawImage(lg,sl.x+Math.round((sl.w-lg.width)/2),sl.y+Math.round((sl.h-lg.height)/2));
    // capot y guardabarros delantero verde
    const hx=cx+36,hy=Y+40;
    R(g,hx-1,hy-1,31,bot-hy-12,'#101010');R(g,hx,hy,29,bot-hy-14,'#F4F4EE');R(g,hx,hy,29,2,'#FFFFFF');for(let i=4;i<24;i+=4)R(g,hx+i,hy+5,2,1,'#A8A8A0');
    R(g,hx+26,hy+3,3,10,'#C0C4CC');R(g,hx+24,hy+2,4,3,'#F8F0B0');
    const fw=hx+12;ell(g,fw,bot-12,19,16,'#101010');ell(g,fw,bot-12,18,15,'#1E7B34');ell(g,fw-4,bot-19,10,5,'#3E9A56');
    R(g,hx+28,bot-12,5,6,'#101010');R(g,hx+29,bot-11,3,4,'#6A6E78');
    // ruedas con llanta roja
    for(const wx of [rw,fw]){ell(g,wx,G-11,12,12,'#0A0A0E');ell(g,wx,G-11,7,7,'#E8502A');ell(g,wx,G-11,3,3,'#8A2A10');R(g,wx-5,G-15,2,2,'#F88060');
      for(let k=0;k<5;k++){const an=k/5*Math.PI*2;R(g,Math.round(wx+Math.cos(an)*5),Math.round(G-11+Math.sin(an)*5),1,1,'#A83818');}}
    topEdge(X-18,G-26,18);topEdge(X,Y,W);topEdge(cx,cy,36);topEdge(hx,hy,30);return;}
  if(s.k==='volquete'){
    // volquete de obra, lleno de escombros
    const h=G-y;R(g,x-1,y-1,w+2,h+1,'#101010');
    for(let yy=0;yy<h;yy++){const inset=Math.round(yy*10/h);R(g,x+10-inset,y+yy,w-20+inset*2,1,yy<3?'#F8C040':'#E8A020');}
    for(let i=0;i<w-12;i+=18)R(g,x+10+i,y+8,3,h-12,'#C07818');R(g,x+2,y+h-6,w-4,3,'#8A5010');
    R(g,x+w/2-24,y+18,48,11,'#101010');R(g,x+w/2-23,y+19,46,9,'#F5EEDC');ptext(g,'OBRAS',x+Math.round(w/2)-14,y+20,'#101010',1);
    for(let i=0;i<14;i++){const bx=x+14+((i*29)%(w-28)),by=y+3+((i*7)%4);R(g,bx,by,5,3,['#A84830','#C8C0B0','#8A8A90','#6A4A2A'][i%4]);}
    ell(g,x+14,G-3,4,3,'#2A2A30');ell(g,x+w-14,G-3,4,3,'#2A2A30');
    topEdge(x,y,w);return;}
  if(s.k==='flores'){x=s.rx-S.cam|0;x=Math.round(s.rx-S.cam);const w=s.rw;
    // puesto de flores: techo negro, pared de rejilla con ramos y baldes en la vereda
    R(g,x+6,y+12,3,G-y-12,'#1A1A1E');R(g,x+w-9,y+12,3,G-y-12,'#1A1A1E');
    const wy=y+18;R(g,x+10,wy,w-20,G-wy-4,'#2A2E2C');for(let yy=wy;yy<G-4;yy+=4)R(g,x+10,yy,w-20,1,'#1E2220');for(let xx=x+10;xx<x+w-10;xx+=4)R(g,xx,wy,1,G-wy-4,'#1E2220');
    const cols=['#F5F5F0','#F8D030','#E03040','#F070B0','#E86020','#B070E0','#FFFFFF','#F8E060'];
    for(let r=0;r<5;r++)for(let i=0;i<Math.floor((w-24)/12);i++){const fx=x+14+i*12+(r%2)*5,fy=wy+4+r*15;if(fx>x+w-18)continue;const col=cols[(i*3+r*5)%cols.length];
      R(g,fx+2,fy+8,5,6,'#3A5A3A');R(g,fx+3,fy+9,3,5,'#2E4A2E');ell(g,fx+4,fy+4,5,4,'#2E6A2A');
      for(let k=0;k<6;k++)R(g,fx+((k*5)%9),fy+((k*3)%6),2,2,col);R(g,fx+4,fy+2,1,1,'#FFFFFF');}
    for(let i=0;i<Math.floor((w+10)/13);i++){const bx=x-6+i*13,big=i%3===0;const bh=big?14:10,bw=big?11:9;R(g,bx,G-bh,bw,bh,'#101010');R(g,bx+1,G-bh+1,bw-2,bh-1,big?'#F4F4F0':'#E8E0D0');R(g,bx+1,G-bh+1,bw-2,1,'#FFFFFF');
      if(!big){R(g,bx+2,G-bh+4,bw-4,3,['#C83030','#1E7B34','#2A5AB0'][i%3]);}
      const col=cols[(i*5+1)%cols.length];ell(g,bx+Math.floor(bw/2),G-bh-4,5,4,'#2E6A2A');for(let k=0;k<5;k++)R(g,bx+1+((k*4)%(bw-1)),G-bh-8+((k*3)%5),2,2,col);}
    R(g,x-8,y+3,w+16,12,'#101010');R(g,x-7,y+4,w+14,10,'#26262A');
    const sq=Math.round((s.sq||0)/2),ay=y+sq;
    R(g,x-9,ay-1,w+18,12,'#101010');for(let i=0;i<w+16;i+=8){const c1=(i/8)%2?'#F4F0E4':'#1E8A3A';R(g,x-8+i,ay,Math.min(8,w+16-i),10,c1);R(g,x-7+i,ay+10,Math.min(6,w+15-i),2,c1);R(g,x-6+i,ay+12,Math.min(4,w+14-i),1,'#101010');}
    R(g,x-8,ay,w+16,2,'#FFFFFF');
    // florista en reposera
    drawFlorist(x+w+12,G);
    topEdge(x-8,ay,w+16);return;}
  if(s.k==='mesatop'||s.k==='sombrilla')return;
  if(s.k==='mesa'){
    // mesita de plástico con sombrilla y dos jóvenes tomando gaseosa lima-limón
    const cx=x+w/2,K='#101010',Wp='#F4F4F0',Wd='#C8C8C0';
    const near=Math.abs(S.p.x+S.p.w/2-(s.x+w/2))<110;
    // sombrilla
    R(g,cx-1,G-104,3,66,'#8A8A92');
    const uy=G-112;for(let i=0;i<14;i++){const hw=12+i*3.1;R(g,Math.round(cx-hw),uy-12+i,Math.round(hw*2),1,K);}
    for(let i=1;i<13;i++){const hw=12+i*3.1-1;for(let xx=Math.round(cx-hw);xx<cx+hw;xx++){const seg=Math.floor((xx-(cx-hw))/12)%2;R(g,xx,uy-12+i,1,1,seg?'#F4F0E4':'#1E8A3A');}}
    R(g,x+12,uy+1,96,2,K);for(let i=0;i<96;i+=8)R(g,x+13+i,uy+3,6,2,(i/8)%2?'#F4F0E4':'#1E8A3A');
    // sillas (detrás de las personas)
    const chairBack=(ax,d)=>{const bxx=d>0?ax-5:ax+2;R(g,bxx,G-56,4,56,K);R(g,bxx+1,G-55,2,54,Wp);R(g,bxx+1,G-55,1,54,'#FFFFFF');};
    const chairSeat=(ax,d)=>{const sx=d>0?ax-4:ax-20;R(g,sx,G-23,24,4,K);R(g,sx+1,G-22,22,2,Wp);R(g,sx+2,G-19,2,19,K);R(g,sx+20,G-19,2,19,K);R(g,sx+2,G-19,1,18,Wd);R(g,sx+20,G-19,1,18,Wd);};
    chairBack(x+10,1);chairBack(x+110,-1);
    // mesa
    R(g,x+32,G-39,56,6,K);R(g,x+33,G-38,54,4,Wp);R(g,x+33,G-35,54,1,Wd);R(g,cx-5,G-33,3,33,K);R(g,cx-4,G-33,1,33,Wp);R(g,cx+3,G-33,3,33,K);R(g,cx+4,G-33,1,33,Wp);
    R(g,cx-2,G-48,5,10,'#0A3A1C');R(g,cx-1,G-47,3,9,'#2A9A46');R(g,cx-1,G-51,3,3,'#2A9A46');R(g,cx-1,G-46,1,6,'#8AE09A');
    const person=(ax,d,st,ph)=>{
      const M=(ox,oy,ww,hh,c)=>R(g,d>0?ax+ox:ax-ox-ww,G+oy,ww,hh,c);
      const sipping=near||Math.floor(S.f*.012+ph)%3===0;const bob=Math.round(Math.sin(S.f*.05+ph)*.6);
      // zapatillas y piernas
      M(14,-7,12,7,K);M(15,-6,10,4,st.shoe);M(15,-2,11,1,st.sole);M(22,-6,3,2,st.shoe2);
      M(14,-24,7,18,K);M(15,-23,5,17,st.pant);M(19,-23,1,17,st.pantD);
      M(0,-31,22,9,K);M(1,-30,20,7,st.pant);M(1,-24,20,1,st.pantD);M(3,-29,15,1,st.pantL);
      if(st.rip){M(16,-28,4,3,'#E8E8F0');M(17,-27,2,1,st.pantD);}
      // torso
      M(1,-56+bob,14,27,K);M(2,-55+bob,12,25,st.top);
      if(st.id==='a'){M(2,-55+bob,4,25,st.shirt);M(10,-55+bob,4,25,st.shirt);for(let yy=-54;yy<-31;yy+=4){M(2,yy+bob,4,1,st.shirtD);M(10,yy+bob,4,1,st.shirtD);}M(4,-55+bob,1,25,st.shirtD);M(11,-55+bob,1,25,st.shirtD);M(7,-50+bob,2,2,'#303848');}
      else{M(2,-55+bob,12,12,st.shirt);M(2,-44+bob,12,2,st.shirtD);M(7,-55+bob,2,12,st.shirtD);M(3,-52+bob,2,2,'#C8C8D0');M(2,-43+bob,12,13,st.top);M(2,-35+bob,12,1,'#C8A020');}
      // cuello y cabeza
      M(6,-59+bob,4,4,st.skin);
      const hx=d>0?ax+8:ax-8,hy=G-66+bob;ell(g,hx,hy,7,8,K);ell(g,hx,hy,6,7,st.skin);ell(g,hx-d*2,hy+2,3,4,st.skinD);
      M(12,-67+bob,1,3,K);M(11,-69+bob,3,1,st.hair);M(15,-64+bob,2,2,st.skinD);M(12,-61+bob,3,1,'#A04040');M(4,-66+bob,2,3,st.skinD);
      if(st.id==='a'){ell(g,hx-d,hy-6,7,3,st.hair);M(-1,-72+bob,6,17,st.hair);M(0,-71+bob,2,15,st.hairD);M(8,-73+bob,6,3,st.hair);M(13,-71+bob,2,2,st.hair);M(2,-58+bob,1,2,st.hairD);}
      else{ell(g,hx-d,hy-6,7,3,st.hair);M(-5,-72+bob,5,13,st.hair);M(-4,-71+bob,2,11,st.hairD);M(-1,-72+bob,3,3,'#E060A0');M(4,-61+bob,2,2,'#F8D030');M(9,-73+bob,6,2,st.hair);}
      // brazo con botella
      M(7,-53+bob,5,11,K);M(8,-52+bob,3,10,st.arm);
      if(sipping){M(10,-60+bob,4,11,K);M(11,-59+bob,2,9,st.arm);M(11,-63+bob,4,4,K);M(12,-62+bob,2,2,st.skin);
        for(let i=0;i<8;i++)M(13+i,-66+bob-i,3,3,i<2?'#0A3A1C':'#2A9A46');M(20,-74+bob,3,2,'#C8C8D0');}
      else{M(10,-44+bob,16,5,K);M(11,-43+bob,14,3,st.arm);M(24,-44+bob,4,4,st.skin);M(25,-52+bob,4,11,'#0A3A1C');M(26,-51+bob,2,9,'#2A9A46');M(26,-55+bob,2,3,'#2A9A46');M(26,-50+bob,1,6,'#8AE09A');}
    };
    const A={id:'a',skin:'#E0A880',skinD:'#B87C58',hair:'#6A4428',hairD:'#4A2E18',top:'#F0F0EA',shirt:'#C0282C',shirtD:'#5A1010',arm:'#C0282C',pant:'#6A8CC0',pantD:'#4A6A9A',pantL:'#8AAAD8',rip:1,shoe:'#202028',shoe2:'#F4F4F0',sole:'#F4F4F0'};
    const B={id:'b',skin:'#C88A64',skinD:'#9A6444',hair:'#1A1418',hairD:'#3A3038',top:'#F8D030',shirt:'#5A7AB8',shirtD:'#3A5A98',arm:'#5A7AB8',pant:'#2A2A34',pantD:'#18181E',pantL:'#44444E',rip:0,shoe:'#F4F4F0',shoe2:'#E060A0',sole:'#C8C8C0'};
    person(x+10,1,A,0);person(x+110,-1,B,1.7);
    chairSeat(x+10,1);chairSeat(x+110,-1);
    if(near&&Math.floor(S.f/20)%2===0){ /* brindis */ }
    topEdge(x+33,G-38,54);topEdge(x+12,uy+1,96);return;}
  if(s.k==='fuente'){
    // fuente de plaza con agua
    const cx=x+w/2;R(g,x-1,G-23,w+2,23,'#101010');R(g,x,G-22,w,22,'#B8B0A0');R(g,x,G-22,w,3,'#D8D0C0');for(let i=6;i<w;i+=12)R(g,x+i,G-19,1,18,'#8C8478');
    R(g,x+3,G-24,w-6,3,'#5A9AC8');for(let i=0;i<w-6;i+=5)R(g,x+3+i+(Math.floor(S.f/6)%3),G-24,2,1,'#C8E8F8');
    R(g,cx-13,G-63,26,41,'#101010');R(g,cx-12,G-62,24,40,'#C8C0B0');R(g,cx-12,G-62,24,3,'#E8E0D0');R(g,cx-12,G-44,24,2,'#A8A090');R(g,cx-8,G-40,16,16,'#B8B0A0');
    for(let i=0;i<14;i++){const t=((S.f*.05+i/14)%1),dx=(i%2?1:-1)*(4+t*22),dy=-t*28+t*t*40;R(g,Math.round(cx+dx),Math.round(G-66+dy),2,2,`rgba(200,232,248,${1-t*.6})`);}
    R(g,cx-1,G-70,2,8,'#C8E8F8');
    topEdge(x,G-22,w);topEdge(cx-12,G-62,24);return;}
  if(s.k==='hoist'){
    // montacargas de obra que sube y baja
    const mx=x+w+2;R(g,mx,110,8,G-110,'#101010');R(g,mx+1,110,6,G-110,'#F0B020');for(let yy=112;yy<G;yy+=8){R(g,mx+1,yy,6,1,'#101010');R(g,mx+1,yy,1,8,'#101010');R(g,mx+6,yy+4,1,4,'#101010');}
    R(g,mx-2,104,12,6,'#101010');R(g,mx-1,105,10,4,'#F0B020');
    R(g,x+w/2,110,1,y-110,'#303038');
    R(g,x-1,y-1,w+2,12,'#101010');R(g,x,y,w,10,'#6A6E78');for(let i=2;i<w;i+=4)R(g,x+i,y+3,2,5,'#2A2E38');
    for(let i=0;i<w;i+=6){R(g,x+i,y-14,1,14,'#F0B020');}R(g,x,y-15,w,2,'#F0B020');R(g,x,y-15,w,1,'#101010');
    R(g,x-2,G-4,w+4,4,'#2A2A30');
    topEdge(x,y,w);return;}
  if(s.k==='taxi'){
    // taxi estacionado: se usa de escalón
    const by=s.ty;R(g,x-1,by+10,w+2,G-by-18,'#101010');R(g,x,by+11,w,G-by-20,'#1C1C24');R(g,x,by+11,w,2,'#3A3A4A');
    R(g,x+16,by-1,w-34,13,'#101010');R(g,x+17,by,w-36,12,'#F0C020');R(g,x+17,by,w-36,2,'#FFE070');R(g,x+20,by+3,(w-42)/2,7,'#98B8D8');R(g,x+22+(w-42)/2,by+3,(w-42)/2-2,7,'#88A8C8');
    R(g,x+30,by-8,24,8,'#101010');R(g,x+31,by-7,22,6,'#F8F8F0');ptext(g,'TAXI',x+31,by-8,'#101010',1);
    R(g,x-2,G-14,6,4,'#C8C8D0');R(g,x+w-4,G-14,6,4,'#C8C8D0');R(g,x+w-3,by+14,3,3,'#F8E8A0');R(g,x,by+14,3,3,'#D02020');
    for(const wx of [x+16,x+w-16]){ell(g,wx,G-7,7,7,'#0A0A0E');ell(g,wx,G-7,3,3,'#A8A8B4');}
    topEdge(x+17,by,w-36);topEdge(x,by+11,16);topEdge(x+w-18,by+11,18);return;}
  if(s.k==='subte'){
    // boca de subte: columnas verdes, baranda, cartel y escaleras mecánicas
    const gc='#2E7A6A',gd='#1E5448',gl='#5AA898';
    const col=(px)=>{R(g,px-1,y-1,10,G-y+1,'#101010');R(g,px,y,8,G-y,gc);R(g,px+1,y,2,G-y,gl);R(g,px+6,y,2,G-y,gd);for(let yy=y+14;yy<G;yy+=18)R(g,px-1,yy,10,3,gd);R(g,px-3,y-6,14,6,gd);R(g,px-2,y-8,12,3,gl);};
    const ex=x+14,ew=w-28,top2=G-44;
    R(g,ex,top2,ew,44,'#0C0C10');
    for(const sx of [ex+6,ex+ew/2+4]){const sw=ew/2-12;R(g,sx-1,top2+4,sw+2,40,'#101010');R(g,sx,top2+5,sw,39,'#8A8E98');R(g,sx+2,top2+5,sw-4,4,'#C8CCD4');
      for(let yy=top2+12;yy<G;yy+=5)R(g,sx+2,yy,sw-4,2,'#5A5E68');R(g,sx+2,top2+10,2,34,'#2A2A30');R(g,sx+sw-4,top2+10,2,34,'#2A2A30');}
    for(let i=0;i<ew;i+=4)R(g,ex+i,top2-12,1,12,gd);R(g,ex,top2-13,ew,2,gc);R(g,ex,top2-1,ew,2,gc);
    col(x+2);col(x+w-10);
    R(g,x-1,y-1,w+2,34,'#101010');R(g,x,y,w,32,'#F0E8D4');R(g,x,y,w,2,'#FFFFFF');R(g,x+3,y+3,1,26,'#101010');R(g,x+w-4,y+3,1,26,'#101010');
    ptext(g,'SUBTE',x+8,y+6,'#101010',1);ptext(g,'A',x+14,y+16,'#101010',2);
    R(g,x+42,y+4,1,24,'#101010');ptext(g,'ESTACION',x+48,y+5,'#101010',1);{const nm=s.st||'PERU',sc2=tw(nm,2)<=w-54?2:1;ptext(g,nm,x+48,y+(sc2===2?14:17),'#101010',sc2);}
    R(g,x,y+32,w,4,gd);
    topEdge(x,y,w);return;}

  if(s.k==='cajones'){
    // pila de cajones de botellas
    const cw=24,ch=16;for(let row=0;;row++){const yy=G-(row+1)*ch;if(yy<y-1)break;
      for(let col=0;col<Math.ceil(w/cw);col++){const xx=x+col*cw,ww=Math.min(cw,x+w-xx);R(g,xx,yy,ww,ch,'#101010');R(g,xx+1,yy+1,ww-2,ch-2,'#D02828');R(g,xx+1,yy+1,ww-2,2,'#F05858');R(g,xx+3,yy+6,ww-6,3,'#8E1414');
        for(let b=0;b<3;b++){const bx=xx+4+b*6;if(bx+3<xx+ww)R(g,bx,yy-3,3,4,'#1E8A3A');}}}
    R(g,x,y,w,G-y,'rgba(0,0,0,0)');topEdge(x,y,w);return;}
  if(s.k==='cartel'){
    // cartel publicitario con pasarela
    for(const px of [x+14,x+w-18]){R(g,px,y+10,5,G-y-10,'#2A2E38');R(g,px+1,y+10,1,G-y-10,'#8C909C');R(g,px-3,G-3,11,3,'#1A1A20');}
    for(let yy=y+40;yy<G-10;yy+=40){R(g,x+16,yy,w-32,2,'#4A4E58');}
    const py=y-66,pw=w+20,pxx=x-10;
    R(g,pxx-1,py-1,pw+2,62,'#101010');R(g,pxx,py,pw,60,'#F5EEDC');
    const bi=slotImg('bill',pw-6,54,true);
    if(bi)g.drawImage(bi,pxx+3,py+3);
    else{R(g,pxx+3,py+3,pw-6,54,'#1E7B34');dith(g,pxx+3,py+30,pw-6,27,null,'#12521F');
      for(let i=0;i<18;i++){const bx=pxx+8+((i*37)%(pw-16)),by=py+8+((i*23)%44),r=1+(i%3);ell(g,bx,by,r,r,'#F5EEDC');if(r>1)ell(g,bx,by,r-1,r-1,'#1E7B34');}}
    R(g,pxx+8,py+60,3,6,'#2A2E38');R(g,pxx+pw-11,py+60,3,6,'#2A2E38');
    R(g,x-1,y-1,w+2,11,'#101010');R(g,x,y,w,9,'#5A5E68');for(let i=2;i<w;i+=4)R(g,x+i,y+3,2,4,'#2A2E38');
    topEdge(x,y,w);return;}
}
function toBW(img){
  const H1=420,W1=Math.max(10,Math.round(img.width*H1/img.height));
  const c1=mk(W1,H1),x1=c1.getContext('2d');x1.imageSmoothingEnabled=true;x1.imageSmoothingQuality='high';x1.drawImage(img,0,0,W1,H1);
  const d=x1.getImageData(0,0,W1,H1).data,N=W1*H1,dark=new Uint8Array(N),bar=new Uint8Array(N),bg=new Uint8Array(N);
  for(let i=0;i<N;i++){const al=d[i*4+3];if(al<90)continue;const l=.3*d[i*4]+.59*d[i*4+1]+.11*d[i*4+2];if(l<150)dark[i]=1;}
  const r=2;for(let y=0;y<H1;y++)for(let x=0;x<W1;x++){if(!dark[y*W1+x])continue;for(let j=-r;j<=r;j++){const yy=y+j;if(yy<0||yy>=H1)continue;for(let k=-r;k<=r;k++){const x2=xx+k;if(x2>=0&&x2<W1)bar[yy*W1+xx]=1;}}}
  const st=[];for(let x=0;x<W1;x++){st.push(x,(H1-1)*W1+x);}for(let y=0;y<H1;y++){st.push(y*W1,y*W1+W1-1);}
  while(st.length){const i=st.pop();if(bg[i]||bar[i])continue;bg[i]=1;const px=i%W1,py=(i/W1)|0;if(px>0)st.push(i-1);if(px<W1-1)st.push(i+1);if(py>0)st.push(i-W1);if(py<H1-1)st.push(i+W1);}
  // los bordes dilatados que tocan el fondo también son fondo, salvo la línea
  for(let i=0;i<N;i++)if(bar[i]&&!dark[i]){const px=i%W1;if((px>0&&bg[i-1])||(px<W1-1&&bg[i+1])||(i>=W1&&bg[i-W1])||(i<N-W1&&bg[i+W1]))bg[i]=2;}
  const c=mk(W1,H1),x=c.getContext('2d'),out=x.createImageData(W1,H1),o=out.data;
  for(let i=0;i<N;i++){const q=i*4,l=.3*d[q]+.59*d[q+1]+.11*d[q+2],al=d[q+3];
    if(dark[i]){const v=Math.max(10,Math.min(60,l*.35));o[q]=o[q+1]=o[q+2]=v;o[q+3]=255;}
    else if(al<90){o[q+3]=0;}
    else if(bg[i]){if(bar[i]&&al>=90&&l<200){o[q]=o[q+1]=o[q+2]=16;o[q+3]=Math.round((200-l)/200*255);}else o[q+3]=0;}
    else{const v=al<90?250:Math.max(200,Math.min(250,l));o[q]=o[q+1]=o[q+2]=v;o[q+3]=255;}}
  x.putImageData(out,0,0);return c;
}
function drawSprite(sp,bx,by,p){
  const w=sp.width,h=sp.height,cut=Math.round(h*.64),lh=h-cut,half=w>>1;
  const moving=p.on&&Math.abs(p.vx)>.3,ph=p.walk*2.2;
  let bodyDy=0,sx=1,sy=1,lA=[0,0],rA=[0,0],lean=0;
  if(!p.on){if(p.vy<0){sy=1.07;sx=.94;lA=[-2,-6];rA=[3,-3];}else{sy=1.02;lA=[-1,-2];rA=[2,-4];}}
  else if(moving){const sn=Math.sin(ph);bodyDy=-Math.round(Math.abs(Math.cos(ph))*3);lA=[Math.round(sn*4),-Math.round(Math.max(0,sn)*5)];rA=[Math.round(-sn*4),-Math.round(Math.max(0,-sn)*5)];lean=Math.min(3,Math.round(Math.abs(p.vx)*.7));}
  else bodyDy=Math.round(Math.sin(S.f*.07)*1);
  if(p.land>0){const q=p.land/8;sy=1-q*.14;sx=1+q*.1;}
  g.save();g.translate(bx,by);if(p.dir<0)g.scale(-1,1);
  g.drawImage(sp,0,cut,half,lh,-half+lA[0],-lh+lA[1],half,lh);
  g.drawImage(sp,half,cut,w-half,lh,rA[0],-lh+rA[1],w-half,lh);
  const bw=Math.round(w*sx),bh=Math.round(cut*sy);
  g.drawImage(sp,0,0,w,cut+2,-(bw>>1)+lean,-lh-bh+bodyDy+2,bw,bh+2);
  g.restore();
}

const CPX = [null, null, null, null];
const SET = STYLES.map(() => ({ mode: "walk" }));
function store(k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); return true; } catch(e) { return false; } }
function loadStore(k) { try { return localStorage.getItem(k); } catch(e) { return null; } }

function drawBottle(bx, by, c) {
  c = c || g;
  const t = S.drinkT;
  const up = t > 0.85 && t < 2.5;
  const x = bx + (up ? 9 : 12), y = up ? by - 78 : by - 52;
  c.save();
  c.translate(x, y);
  if (up) c.rotate(-0.9);
  R(c, -3, -2, 7, 20, "#0A3A1C");
  R(c, -2, -1, 5, 18, "#1E8A3A");
  R(c, -1, 0, 1, 16, "#8AE09A");
  c.restore();
}

function speechBubble(txt, bx, by) {
  const w = tw(txt, 1) + 16, h = 18, x = Math.round(bx - w / 2), y = Math.round(by - h);
  R(g, x - 1, y - 1, w + 2, h + 2, "#101010");
  R(g, x, y, w, h, "#FAF8E8");
  R(g, bx - 3, y + h, 6, 4, "#101010");
  R(g, bx - 2, y + h, 4, 3, "#FAF8E8");
  ptext(g, txt, x + 8, y + 5, "#101010", 1);
}

function drawLo() {
  const cam = Math.round(S.cam);
  g.drawImage(sky, 0, 0);
  const fx = -Math.round(cam * 0.12) % 960;
  g.drawImage(far, fx, 0);
  g.drawImage(far, fx + 960, 0);
  const mx = -Math.round(cam * 0.45) % 1280;
  g.drawImage(mid, mx, 0);
  g.drawImage(mid, mx + 1280, 0);
  g.fillStyle = "rgba(10,40,24,.30)";
  g.fillRect(0, 0, LW, 272);
  const sc = Math.round(cam * 0.7);
  R(g, 0, 272, LW, 34, "#4A4654");
  R(g, 0, 272, LW, 2, "#8C8478");
  for (let x = -(sc % 48); x < LW; x += 48) R(g, x, 288, 26, 2, "#E8E4D8");
  for (const c of S.traffic) {
    const x = Math.round(c.x - cam * 0.7);
    if (x < -c.spr.width || x > LW) continue;
    const by = c.lane ? 296 : 306;
    flipDraw(c.spr, x, by - c.spr.height, c.v < 0);
  }
  R(g, 0, G + 2, LW, LH - G, "#2A1C14");
  for (const [px, t] of props) {
    const x = px - cam;
    if (x < -130 || x > LW + 20) continue;
    if (t === "arbol") g.drawImage(ARBOL, x, G - 170 + 2);
    else if (t === "puesto") g.drawImage(PUESTO, x, G - 84);
    else if (t === "cabina") g.drawImage(CABINA, x, G - 104);
    else if (t === "buzon") g.drawImage(BUZON, x, G - 46);
    else if (t === "parada") g.drawImage(PARADA, x, G - 96);
    else if (t === "tacho") g.drawImage(TACHO, x, G - 32);
  }
  for (const [a] of gaps) {
    const x = a - 44 - cam;
    if (x > -50 && x < LW) g.drawImage(VALLA, x, G - 30);
  }
  const kx = GOAL_X - 20 - cam;
  if (kx > -180 && kx < LW) {
    const stImg = slotImg("stand", 164, 28);
    g.drawImage(STAND, kx, G - 150);
    if (stImg) g.drawImage(stImg, kx + 8, G - 150 + 12);
    const near = S.p.x > GOAL_X - 150 || S.state === "drink";
    const wv = near && S.greetT > 0 ? 1 + Math.floor(S.f / 8) % 3 : 0;
    g.drawImage(VENDOR[wv], kx + 86, G - 150 + 72);
    if (S.greetT > 0 && near) {
      const msg = S.caps >= 7 ? ((greetIn && greetIn.value) || "¡ACÁ TENÉS BIEN HELADA!") : "¡TRAEME LAS 7 TAPITAS!";
      speechBubble(msg, kx + 108, G - 150 + 64);
    }
  }
  for (const s of solids) {
    if (s.g) continue;
    const x = s.x - cam;
    if (x + s.w < 0 || x > LW) continue;
    drawPlatform(s, x);
  }
  for (const s of solids) {
    if (!s.g) continue;
    const x = s.x - cam;
    if (x + s.w < 0 || x > LW) continue;
    const x0 = Math.max(0, x), x1 = Math.min(LW, x + s.w);
    R(g, x0, G, x1 - x0, 18, "#E2CE94");
    R(g, x0, G, x1 - x0, 1, "#F4E6B8");
    R(g, x0, G + 18, x1 - x0, 10, "#A09888");
  }
  for (const it of S.items) {
    if (it.got) continue;
    const x = Math.round(it.x - cam);
    if (x < -20 || x > LW + 20) continue;
    const y = Math.round(it.y + (reduce ? 0 : Math.sin(S.f * 0.08 + it.b) * 3));
    const sp = it.t === "lime" ? LIME : CAP;
    g.drawImage(sp, x - (sp.width >> 1), y - (sp.height >> 1));
  }
  for (const e of S.enemies) {
    const x = Math.round(e.x - cam);
    if (x < -60 || x > LW + 60) continue;
    if (e.t === "bear") {
      const flip = e.v < 0;
      if (e.dead) {
        if (e.dead < 40) flipDraw(BEARSQ, x - 11, Math.round(e.y + e.h) - 56, flip);
        continue;
      }
      flipDraw(BEAR[Math.floor(S.f / 9) % 4], x - 11, Math.round(e.y + e.h) - 56, flip);
    } else {
      if (e.dead) continue;
      const sq = e.sq > 0 ? e.sq / 8 : 0;
      const w = Math.round(32 * (1 + sq * 0.3)), h = Math.round(34 * (1 - sq * 0.3));
      g.drawImage(ORANGE, x, Math.round(e.y + e.h) - h, w, h);
    }
  }
  if (floBubble && S.floT > 0) {
    speechBubble(FLORIST_TXT, floBubble.x - cam, floBubble.y);
  }
  const p = S.p;
  if (!(p.inv > 0 && Math.floor(p.inv / 5) % 2)) {
    const bx = Math.round(p.x + p.w / 2 - cam), by = Math.round(p.y + p.h);
    if (CPX[CHOSEN]) {
      drawSprite(CPX[CHOSEN], bx, by, p);
    } else {
      const moving = p.on && Math.abs(p.vx) > 0.3;
      let img = !p.on ? CHAR.jump : (moving ? CHAR.walk[Math.floor(p.walk) % 4] : CHAR.idle);
      if (S.state === "drink") img = CHAR.idle;
      flipDraw(img, bx - 23, by - 76, p.dir < 0);
    }
    if (S.state === "drink") drawBottle(bx, by);
  }
  if (TR.active) drawTrans();
}

function txt(s, x, y, col, size, align) {
  ctx.font = size + "px \"Press Start 2P\", monospace";
  ctx.textAlign = align || "left";
  ctx.lineJoin = "round";
  ctx.lineWidth = size * 0.45;
  ctx.strokeStyle = "#0A2416";
  ctx.strokeText(s, x, y);
  ctx.fillStyle = col;
  ctx.fillText(s, x, y);
}

function draw() {
  drawLo();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(lo, 0, 0, cv.width, cv.height);
  const u = U, fs = Math.max(8, Math.round(13 * u));
  txt(String(score(false)).padStart(6, "0"), 14 * u, 28 * u, "#F8D030", fs);
  ctx.drawImage(CAP, 12 * u, 38 * u, 24 * u, 24 * u);
  txt(S.caps + "/7", 42 * u, 56 * u, S.caps >= 7 ? "#F8D030" : "#FFFFFF", fs);
  ctx.drawImage(LIME, 122 * u, 38 * u, 22 * u, 22 * u);
  txt(String(S.limes), 150 * u, 56 * u, "#FFFFFF", fs);
  const m = Math.floor(S.t / 60), s = String(Math.floor(S.t % 60)).padStart(2, "0");
  txt(m + ":" + s, LW * u / 2, 28 * u, "#F8D030", fs, "center");
  for (let i = 0; i < S.maxLives; i++) {
    const x = (LW - 60 - S.maxLives * 26 + i * 26 + 26) * u, y = 14 * u, q = 2 * u;
    ctx.fillStyle = "#000";
    ctx.fillRect(x - q, y - q, 11 * q, 10 * q);
    const hp = i < S.lives;
    ctx.fillStyle = hp ? "#E02828" : "#303040";
    ctx.fillRect(x, y + q, 3 * q, 3 * q);
    ctx.fillRect(x + 5 * q, y + q, 3 * q, 3 * q);
    ctx.fillRect(x, y + 2 * q, 9 * q, 3 * q);
    ctx.fillRect(x + q, y + 5 * q, 7 * q, 2 * q);
    ctx.fillRect(x + 3 * q, y + 7 * q, 3 * q, q);
  }
  for (const q of S.pops) {
    txt(q.txt, (q.x - S.cam) * u, (q.y - q.t * 0.6) * u, q.big ? "#F8D030" : "#FFFFFF", Math.max(7, Math.round((q.big ? 15 : 11) * u)), "center");
  }
}

const TR = { active: false, t: 0, did: false };
function startTrans() { ac(); SFX.splash(); TR.active = true; TR.t = 0; TR.did = false; }
function updateTrans(dt, k) {
  TR.t += dt / 1000;
  if (!TR.did && TR.t >= 1.05) { TR.did = true; reset(); S.state = "trans"; }
  if (TR.t >= 2.2) { TR.active = false; if (S.state === "trans") S.state = "play"; }
}
function drawTrans() { g.fillStyle = "rgba(15,107,58,0.7)"; g.fillRect(0, 0, LW, LH); }

const charsEl = document.getElementById("chars");
let SELF = [];
STYLES.forEach((st, i) => {
  const fr = buildChar(st);
  SELF.push(fr);
  const b = document.createElement("button");
  b.className = "ch";
  b.type = "button";
  b.setAttribute("aria-pressed", i === CHOSEN ? "true" : "false");
  const cv2 = mk(48, 82);
  cv2.getContext("2d").drawImage(fr.idle, 0, 0);
  b.appendChild(cv2);
  const nm = document.createElement("b");
  nm.className = "nm";
  nm.textContent = st.name;
  b.appendChild(nm);
  const ds = document.createElement("span");
  ds.className = "ds";
  ds.textContent = st.desc;
  b.appendChild(ds);
  const bars = document.createElement("div");
  bars.className = "bars";
  ["Velocidad", "Salto", "Aguante"].forEach((lab, k) => {
    const l = document.createElement("span");
    l.textContent = lab;
    const br = document.createElement("span");
    br.className = "bar";
    for (let q = 0; q < 5; q++) {
      const it = document.createElement("i");
      if (q < st.stats[k]) it.className = "on";
      br.appendChild(it);
    }
    bars.appendChild(l);
    bars.appendChild(br);
  });
  b.appendChild(bars);
  b.addEventListener("click", () => choose(i));
  charsEl.appendChild(b);
});

function mark(i) {
  CHOSEN = i;
  [...charsEl.children].forEach((el, k) => el.setAttribute("aria-pressed", k === i ? "true" : "false"));
}
function choose(i) {
  mark(i);
  CHAR = SELF[i];
  document.getElementById("select").hidden = true;
  ac();
  reset();
  S.state = "play";
}
CHAR = SELF[0];

const logoSlot = document.getElementById("logoSlot"), logoCv = document.getElementById("logoCv");
const logoImg = new Image();
logoImg.onload = () => {
  const h = 72, w = Math.max(1, Math.round(logoImg.width * h / logoImg.height));
  logoCv.width = w; logoCv.height = h;
  const lx = logoCv.getContext("2d");
  lx.drawImage(logoImg, 0, 0, w, h);
  logoSlot.classList.add("has");
};
logoImg.src = "/7up-logo-transparent.png";

const greetIn = document.getElementById("greetIn");
if (greetIn) {
  greetIn.value = loadStore("u7-greet") || "¡ACÁ TENÉS BIEN HELADA!";
  greetIn.addEventListener("input", () => store("u7-greet", greetIn.value));
}
const floIn = document.getElementById("floIn");
if (floIn) {
  floIn.value = loadStore("u7-flo") || "¡HOLA, QUERIDO!";
  FLORIST_TXT = floIn.value;
  floIn.addEventListener("input", () => { FLORIST_TXT = floIn.value; store("u7-flo", floIn.value); });
}

["truck", "bill", "stand"].forEach(k => {
  const u = loadStore("u7-" + k);
  if (u) setSlot(k, u, false);
});

const OV = ["menu", "select", "end", "pause", "admin"].map(id => document.getElementById(id));
function pauseGame() {
  if (S.state !== "play" || TR.active) return;
  S.state = "paused";
  document.getElementById("pause").hidden = false;
  document.getElementById("resume").focus();
}
function resumeGame() {
  document.getElementById("pause").hidden = true;
  if (S.state === "paused") S.state = "play";
}
function goMenu() {
  TR.active = false;
  OV.forEach(o => o.hidden = true);
  Object.keys(keys).forEach(k => keys[k] = false);
  reset();
  S.state = "menu";
  document.getElementById("menu").hidden = false;
  document.getElementById("play").focus();
}

document.getElementById("pauseBtn").addEventListener("click", () => {
  if (S.state === "play") pauseGame();
  else if (S.state === "paused" && !document.getElementById("pause").hidden) resumeGame();
  else goMenu();
});
document.getElementById("resume").addEventListener("click", resumeGame);
document.getElementById("restart").addEventListener("click", () => {
  document.getElementById("pause").hidden = true;
  startTrans();
});
document.getElementById("toMenu").addEventListener("click", goMenu);
document.getElementById("endMenu").addEventListener("click", goMenu);
addEventListener("keydown", e => { if (e.code === "KeyP") pauseGame(); });

document.querySelectorAll(".touch button").forEach(b => {
  const k = b.dataset.k;
  const press = (e) => {
    e.preventDefault();
    ac();
    if (k === "jump") { keys.jump = true; if (S.p.on) S.p.vy = -10.8; }
    else if (k === "left") keys.left = true;
    else if (k === "right") keys.right = true;
    else if (k === "down") keys.down = true;
  };
  const release = (e) => {
    e.preventDefault();
    if (k === "jump") keys.jump = false;
    else if (k === "left") keys.left = false;
    else if (k === "right") keys.right = false;
    else if (k === "down") keys.down = false;
  };
  b.addEventListener("pointerdown", press);
  b.addEventListener("pointerup", release);
  b.addEventListener("pointercancel", release);
  b.addEventListener("pointerleave", release);
});

const secretBtn = document.getElementById("secret");
if (secretBtn) secretBtn.addEventListener("click", () => { document.getElementById("admin").hidden = false; });
const admCloseBtn = document.getElementById("admClose");
if (admCloseBtn) admCloseBtn.addEventListener("click", () => { document.getElementById("admin").hidden = true; });

let last = 0;
function loop(ts) {
  const dt = Math.min(50, ts - (last || ts));
  last = ts;
  const k = dt / 16.667;
  updateTraffic(k);
  if (S.state === "play") update(k);
  else if (S.state === "drink") updateDrink(k);
  else if (S.state === "warp") updateWarp(k);
  else S.f += k;
  if (TR.active) updateTrans(dt, k);
  draw();
  requestAnimationFrame(loop);
}

document.getElementById("play").addEventListener("click", () => {
  ac();
  document.getElementById("menu").hidden = true;
  document.getElementById("select").hidden = false;
  charsEl.children[CHOSEN].focus();
});
document.getElementById("again").addEventListener("click", () => {
  document.getElementById("end").hidden = true;
  startTrans();
});
document.getElementById("change").addEventListener("click", () => {
  document.getElementById("end").hidden = true;
  document.getElementById("select").hidden = false;
  charsEl.children[CHOSEN].focus();
});

reset();
requestAnimationFrame(loop);
})();
