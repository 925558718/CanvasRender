(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))e(n);new MutationObserver(n=>{for(const l of n)if(l.type==="childList")for(const r of l.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&e(r)}).observe(document,{childList:!0,subtree:!0});function s(n){const l={};return n.integrity&&(l.integrity=n.integrity),n.referrerpolicy&&(l.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?l.credentials="include":n.crossorigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function e(n){if(n.ep)return;n.ep=!0;const l=s(n);fetch(n.href,l)}})();class b{constructor(t=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]){if(Array.isArray(t)&&t.length!==16)throw Error("please input a array,it's length must be 16");if(this.ncol=4,this.nrow=4,Array.isArray(t))this.ele=t;else{let s=new Array(this.ncol*this.nrow).fill(0);for(let e=0;e<this.nrow;e++)s[e*this.ncol+e]=1;this.ele=s}}find(t,s){return this.ele[s+t*this.ncol]}set(t,s,e){this.ele[s+t*this.ncol]=e}multiplyScalar(t){for(let s=0;s<this.ele.length;s++)this.ele[s]*=t;return this}look(){console.log("--------------");for(let t=0;t<this.nrow;t++){let s="-";for(let e=0;e<this.ncol;e++)s+=this.ele[t*this.ncol+e]+" ";console.log(s)}}add(t){for(let s=0;s<this.ele.length;s++)this.ele[s]+=t.ele[s];return this}minus(t){return this.add(t.multiplyScalar(-1))}multiply(t){if(!(t instanceof b))throw Error("please input a matrix");let s=[];for(let e=0;e<this.nrow;e++)for(let n=0;n<t.ncol;n++){let l=0;for(let r=0;r<this.ncol;r++)l+=t.find(r,n)*this.find(e,r);s.push(l)}return new b(s)}transpose(){if(this.ncol!==1||this.nrow!==1){let t=[];for(let s=0;s<this.ncol;s++)for(let e=0;e<this.nrow;e++)t.push(this.find(e,s));return new b(t)}return new b}translate(t,s=0,e=0){return new b([1,0,0,t,0,1,0,s,0,0,1,e,0,0,0,1]).multiply(this)}scale(t=1,s=1,e=1){return new b([t,0,0,0,0,s,0,0,0,0,e,0,0,0,0,1]).multiply(this)}rotate(t,s="x"){let e=t/180*Math.PI;const n=new b;return s==="x"?(n.set(1,1,+Math.cos(e).toFixed(8)),n.set(1,2,+-Math.sin(e).toFixed(8)),n.set(2,1,+Math.sin(e).toFixed(8)),n.set(2,2,+Math.cos(e).toFixed(8))):s==="y"?(n.set(0,0,+Math.cos(e).toFixed(8)),n.set(0,2,+Math.sin(e).toFixed(8)),n.set(2,0,+-Math.sin(e).toFixed(8)),n.set(2,2,+Math.cos(e).toFixed(8))):(n.set(0,0,+Math.cos(e).toFixed(8)),n.set(0,1,+-Math.sin(e).toFixed(8)),n.set(1,0,+Math.sin(e).toFixed(8)),n.set(1,1,+Math.cos(e).toFixed(8))),n.multiply(this)}reverse(t=1){let s=new b,e=[].concat(this.ele);if(t===1){for(let n=0;n<this.nrow;n++)if(e[n*this.ncol+n]!==0){for(let l=n+1;l<this.nrow;l++)if(e[l*this.ncol+n]!==0){let r=-(e[l*this.ncol+n]/e[n*this.ncol+n]);for(let o=0;o<this.ncol;o++)e[l*this.ncol+o]+=r*e[n*this.ncol+o],s.ele[l*this.ncol+o]+=r*s.ele[n*this.ncol+o]}}else{let l=n+1;for(;l<this.nrow&&e[l*this.ncol+n]===0;l++);if(l===this.nrow)throw Error("this matrix can't be reversed");for(let r=0;r<this.ncol;r++){let o=e[n*this.ncol+r];e[n*this.ncol+r]=e[l*this.ncol+r],e[l*this.ncol+r]=o;let a=s.ele[n*this.ncol+r];s.ele[n*this.ncol+r]=s.ele[l*this.ncol+r],s.ele[l*this.ncol+r]=a}}for(let n=this.nrow-1;n>0;n--)for(let l=n-1;l>=0;l--)if(e[l*this.ncol+n]!==0){let r=-(e[l*this.ncol+n]/e[n*this.ncol+n]);e[l*this.ncol+n]=0;for(let o=0;o<this.ncol;o++)s.ele[l*this.ncol+o]+=r*s.ele[n*this.ncol+o]}for(let n=0;n<this.nrow;n++){let l=1/e[n*this.ncol+n];for(let r=0;r<this.ncol;r++)s.ele[n*this.ncol+r]*=l}}for(let n=0;n<s.ele.length;n++)s.ele[n]=+s.ele[n].toFixed(8);return s}det(t=1){if(t===1){let s=0,e=new Array(this.ncol).fill(!1),n=function(l,r,o,a,c){if(r===l.nrow){let f=0;for(let m=c.length-1;m>0;m--)for(let y=m-1;y>=0;y--)c[y]>c[m]&&f++;f%2!==0&&(a=-a),s+=a;return}for(let f=0;f<l.ncol;f++)o[f]||l.ele[r*l.ncol+f]===0||(o[f]=!0,a*=l.ele[r*l.ncol+f],n(l,r+1,o,a,c.concat(f)),o[f]=!1)};return n(this,0,e,1,[]),s}}}class u{constructor(t=0,s=0,e=0,n=0){this.x=t,this.y=s,this.z=e,this.w=n}dot(t){const{x:s,y:e,z:n,w:l}=t,{x:r,y:o,z:a,w:c}=this;return s*r+e*o+n*a}get(){return[this.x,this.y,this.z,this.w]}cross(t){const{x:s,y:e,z:n,w:l}=this;let r=new b([0,-n,e,0,n,0,-s,0,-e,s,0,0,0,0,0,1]);return t.multiply(r)}multiply(t){let s=[];for(let e=0;e<t.nrow;e++){let n=this.x*t.find(e,0)+this.y*t.find(e,1)+this.z*t.find(e,2)+this.w*t.find(e,3);s.push(n)}return new u(...s)}add(t){return new u(this.x+t.x,this.y+t.y,this.z+t.z,1)}minus(t){return new u(this.x-t.x,this.y-t.y,this.z-t.z,0)}multiplyScalar(t){return new u(this.x*t,this.y*t,this.z*t,this.w)}normalize(){return this.w=1,this.multiplyScalar(1/this.len())}hNormalize(){return new u(this.x/this.w,this.y/this.w,this.z/this.w,1)}len(){return Math.sqrt(this.dot(this))}componentMultiply(t){return new u(this.x*t.x,this.y*t.y,this.z*t.z,1)}}function ct(h,t,s){const[e,n]=h,[l,r]=t,[o,a]=s;return(n-r)*o+(l-e)*a+e*r-l*n}function ft(h,t){const[s,e]=h,[n,l]=t;return(l-e)/(n-s)}function J(h){return[h[1],h[0],h[2]]}function Q(h){return[-h[1],-h[0],h[2]]}function Z(h){return[h[0],-h[1],h[2]]}function Y(h,t,s,e){const n=X(h,t,s);let r=X(h,t,e)/n;if(r<0)return[!1];const o=X(t,s,h);let c=X(t,s,e)/o;if(c<0)return[!1];const f=X(s,h,t);let y=X(s,h,e)/f;return y<0?[!1]:[c,y,r]}function X(h,t,s){return(h.y-t.y)*s.x+(t.x-h.x)*s.y+h.x*t.y-t.x*h.y}function $(h,t,s){return t-h===0?1:(s-h)/(t-h)}function F(h,t,s){return h+s*(t-h)}class ut{constructor(t,s,e){const{height:n,width:l,antialias:r,Z_Buffer:o,mode:a="raster"}=e;this.ctx=t,this.buffer=s,this.height=n,this.width=l,this.antialias=r,this.Z_Buffer=o,this.triangleBuffer=[],this.lineBuffer=[],this.clearBuffer(),this.matertal=new Map,this.lights=[]}clearBuffer(t){this.array=new Array(this.height*this.width).fill([0,0,0,1]),this.depth=new Array(this.height*this.width).fill(Number.MAX_VALUE),this.triangleBuffer=[]}drawEllipse(t,s,e){}drawPoint(t,s,e,n=new u(0,0,0,1)){e<=this.depth[s*this.width+t]&&(this.depth[s*this.width+t]=e,this.array[s*this.width+t]=[+n.x.toFixed(),+n.y.toFixed(),+n.z.toFixed(),+n.w.toFixed()])}renderBuffer(t,s){const e=t.objs,n=t.lights;for(let l=0;l<e.length;l++){const r=e[l];for(let o=0;o<r.faces.length;o++){const a=r.faces[o];let c;const f=e[l].mtls.get(a.Material);if(a[0].length<3){const d=r.vertices[a[2][0]-1].hNormalize(),x=r.vertices[a[1][0]-1].hNormalize(),k=r.vertices[a[0][0]-1].hNormalize(),z=x.minus(k),p=d.minus(k);c=z.cross(p).normalize()}else c=r.normals[a[0][2]-1];let m=[],y=[],S=[];for(let d=0;d<a.length;d++)for(let x=0;x<a[d].length;x++)switch(x){case 0:m.push(r.screenPositions[a[d][0]-1]),y.push(r.vertices[a[d][0]-1].hNormalize());break;case 1:S.push(r.vertices[a[d][1]-1]);break}this.drawMesh(m,c,y,S,f,n)}}for(let l=0;l<this.height;l++)for(let r=0;r<this.width;r++){const[o,a,c,f]=this.array[l*this.height+r];console.log(o,a,c,f),this.ctx.fillStyle=`rgba(${o},${a},${c},${f})`,this.ctx.fillRect(r,l,1,1)}}drawMesh(t,s,e,n,l,r){for(let o=2;o<t.length;o++)this.fillTriangle(t[0],t[o-1],t[o],e[0],e[o-1],e[o],s,l,r,n[0],n[0],n[o-1],n[o])}drawLine(t,s,e=[0,0,0,1]){if(t[0]===s[0]){let S=Math.min(t[1],s[1]),d=Math.max(t[1],s[1]);for(let x=S;x<=d;x++)this.drawPoint([t[0],x,0],e);return}else t[0]>s[0]&&([t,s]=[s,t]);const n=-t[0],l=-t[1],r=ft(t,s);let o=[0,0,0],a=[s[0]+n,s[1]+l,0],c=0,f=ct(o,a,[o[0]+1,o[1]+.5]);r>1?a=J(a):r<=0&&r>=-1?a=Z(a):r<-1&&(a=Z(Q(a)));const m=o[1]-a[1],y=o[0]-a[1]+a[0]-o[0];for(let S=o[0];S<=a[0];S++){f<0?(c++,f+=y):f+=m;let d=[S,c,0];r>1?d=J(d):r<=0&&r>=-1?d=Z(d):r<-1&&(d=Z(Q(d))),this.drawPoint([d[0]-n,d[1]-l,0],e)}}SSAAAntialias(t,s,e,n,l,r,o,a,c,f){const m=[0,0,0,0],y={0:-.5,1:-.5,2:.5,3:.5},S={0:.5,1:-.5,2:.5,3:-.5};for(let d=0;d<f;d++){const x=beInTriangle(t,s,e,[o+y[d],a+S[d],0])||[0,0,0,1],k=x[0]/x[3],z=x[1]/x[3],p=x[2]/x[3],g=[k*n[0]+z*l[0]+p*r[0],k*n[1]+z*l[1]+p*r[1],k*n[2]+z*l[2]+p*r[2],k*n[3]+z*l[3]+p*r[3]];for(let M=0;M<4;M++)m[M]+=g[M]/4}this.drawPoint([o,a,c],m)}fillTriangle(t,s,e,n,l,r,o,a,c,f,m,y){let S=Math.floor(Math.max(Math.min(t.x,s.x,e.x),0)),d=Math.ceil(Math.min(Math.max(t.x,s.x,e.x),this.width)),x=Math.ceil(Math.min(Math.max(t.y,s.y,e.y),this.height)),k=Math.floor(Math.max(Math.min(t.y,s.y,e.y),0));for(let z=k;z<x;z++)for(let p=S;p<d;p++)switch(this.antialias){case"None":const[g,M,v]=Y(t,s,e,new u(p,z,0));if(g){const I=n.multiplyScalar(g).add(l.multiplyScalar(M)).add(r.multiplyScalar(v));let P=new u(1,0,0,1),L=new u(0,0,0,1),T=new u(0,0,1,1);if(a){const[w=g,N=M,A=v,C=g,E=M,D=v]=this.sampleTextureMiniMap(t,s,e,p,z);let K=f.multiplyScalar(g).add(m.multiplyScalar(M)).add(y.multiplyScalar(v)),B=f.multiplyScalar(w).add(m.multiplyScalar(N)).add(y.multiplyScalar(A)),O=f.multiplyScalar(C).add(m.multiplyScalar(E)).add(y.multiplyScalar(D));debugger;P=a.map_Kd.sample(K.x,K.y,B.x,B.y,O.x,O.y)}for(let w=0;w<0;w++)if(c[w].type==="point"){let A=c[w].position.hNormalize().minus(I);const C=A.len();A=A.normalize();const E=A.dot(o),D=T.minus(I).normalize(),K=A.add(D).normalize(),B=c[w].intensity/Math.pow(C,2)*Math.max(0,E),O=P.componentMultiply(c[w].color).multiplyScalar(Math.max(0,o.dot(K)));L=L.add(O.multiplyScalar(B))}else c[w].type==="ambient"&&(L=L.add(P.componentMultiply(c[w].color)));this.drawPoint(p,z,-I.z,new u(1,1,0,1))}break;case"SSAA_4":this.SSAAAntialias(t,s,e,c1,c2,c3,j,i,0,4);break}}sampleTextureMiniMap(t,s,e,n,l){let r=0,o=[];const[a,c,f]=Y(t,s,e,new u(n+1,l,0));if(a!==!1&&(r++,o.push(a,c,f)),r===2)return o;const[m,y,S]=Y(t,s,e,new u(n,l+1,0));if(m!==!1&&(r++,o.push(m,y,S)),r===2)return o;const[d,x,k]=Y(t,s,e,new u(n-1,l,0));if(a!==!1&&(r++,o.push(d,x,k)),r===2)return o;const[z,p,g]=Y(t,s,e,new u(n,l-1,0));return a!==!1&&(r++,o.push(z,p,g)),o}}async function V(h){return new Promise((t,s)=>{const e=new XMLHttpRequest;e.onreadystatechange=function(){e.readyState===4&&e.status!==404&&t(e.responseText)},e.open("GET",h,!0),e.send()})}async function mt(h,t){return new Promise(async(s,e)=>{const n=await V(h+"/"+t),r=await new U(h).parse(n);s(r)})}class dt{constructor(){this.Ks=[],this.Kd=[],this.Ka=[],this.Ke=[],this.Ns=0,this.Ni=0,this.d=0,this.illum=0,this.map_Kd=null}}class wt{constructor(t,s,e){this.data=t,this.width=s,this.height=e,this.miniMap=[this.data],this.getMiniMap()}sample(t,s,e,n,l,r){let o=this.width*t,a=this.width*s,c=new u(o,a,0,0),f=this.width*e,m=this.width*n,y=this.width*l,S=this.width*r,d=new u(y,S,0,0),x=new u(f,m,0,0),k=d.minus(c),z=x.minus(c);const p=k.cross(z).len(),g=Math.floor(o),M=Math.ceil(o),v=Math.floor(a),I=Math.ceil(a);let P=$(g,M,o),L=$(v,I,a),T=0;for(let G=0;G<8;G++)if(Math.pow(4,G)>=p){T=G;break}let w=p<1?this.miniMap[T]:this.miniMap[T-1];const N=Math.sqrt(w.length/4),A=[w[N*I*4+g*4],w[N*I*4+g*4+1],w[N*I*4+g*4+2],w[N*I*4+g*4+3]],C=[w[N*I*4+M*4],w[N*I*4+M*4+1],w[N*I*4+M*4+2],w[N*I*4+M*4+3]],E=[w[N*v*4+g*4],w[N*v*4+g*4+1],w[N*v*4+g*4+2],w[N*v*4+g*4+3]],D=[w[N*v*4+M*4],w[N*v*4+M*4+1],w[N*v*4+M*4+2],w[N*v*4+M*4+3]],K=[F(A[0],C[0],P),F(A[1],C[1],P),F(A[2],C[2],P),F(A[3],C[3],P)],B=[F(E[0],D[0],P),F(E[1],D[1],P),F(E[2],D[2],P),F(E[3],D[3],P)],O=new u(F(K[0],B[0],L),F(K[1],B[1],L),F(K[2],B[2],L),F(K[3],B[3],L));if(p<1)return O;let q=this.miniMap[T],lt=$(Math.pow(4,T-1),Math.pow(4,T),p);const ot=Math.floor(o/2),at=Math.floor(a/2),H=ot*this.width/Math.pow(2,T)*4+at*4,ht=new u(q[H],q[H+1],q[H+2],q[H+3]);return O.add(ht.minus(O).multiplyScalar(lt))}getMiniMap(){let t=this.data;for(let s=0;s<Math.log2(this.height);s++){let e=this.width/Math.pow(2,s),n=new Float32Array(e*e);for(let l=0;l<e;l+=2)for(let r=0;r<e;r+=2){let o=l*e*4+r*4,a=o+4,c=(l+1)*e*4+r*4,f=c+4,m=l*e+r*2;n[m]=(t[o]+t[a]+t[c]+t[f])/4,n[m+1]=(t[o+1]+t[a+1]+t[c+1]+t[f+1])/4,n[m+2]=(t[o+2]+t[a+2]+t[c+2]+t[f+2])/4,n[m+3]=(t[o+3]+t[a+3]+t[c+3]+t[f+3])/4}t=n,this.miniMap.push(n)}}mixColor(){}}class U{constructor(t,s=[],e=[],n=[],l=[]){this.fileName="",this.mtls=new Map,this.vertices=[...s],this.screenPosition=[],this.normals=[...e],this.textures=[...n],this.faces=[...l],this.screenPositions=[],this.path=t,this.matrix=new b,this.currentMaterialName=""}transform(t){for(let s=0;s<this.vertices.length;s++){const e=this.vertices[s];this.vertices[s]=e.multiply(t)}for(let s=0;s<this.normals.length;s++){const e=this.normals[s];this.normals[s]=e.multiply(t.reverse().transpose()).normalize()}return this}scale(t,s,e){this.transform(new b().scale(t,s,e))}setScreenPosition(t){this.vertices.forEach(s=>{this.screenPositions.push(s.hNormalize().multiply(t))})}async parse(t){const s=t.split(`
`);for(let e=0;e<s.length;e++){if(!s[e])continue;const n=s[e].split(" ");switch(n[0]){case"v":this.vertices.push(new u(n[1],n[2],n[3],1));break;case"vt":this.textures.push(new u(+n[1],+n[2],0,0));break;case"vn":this.normals.push(new u(n[1],n[2],n[3]));break;case"f":const l=n.slice(1).map(o=>o.split("/").map(Number));l.Material=this.currentMaterialName,this.faces.push(l);break;case"mtllib":const r=await V(this.path+"/"+n[1]);this.parseMaterialFile(r);break;case"usemtl":this.currentMaterialName=n[1];break;case"o":this.fileName=n[1]}}return this}async parseMaterialFile(t){const s=t.split(`
`);let e=null,n="";for(let l=0;l<s.length;l++){const r=s[l].split(" ");if(r.length!==0)switch(r[0]){case"newmtl":e&&this.mtls.set(n,e),this.currentMaterialName||(this.currentMaterialName=r[1]),e=new dt,n=r[1];break;case"Ka":e.Ka=r.slice(1).map(Number);break;case"Kd":e.Kd=r.slice(1).map(Number);break;case"Ks":e.Ks=r.slice(1).map(Number);break;case"Ke":e.Ke=r.slice(1).map(Number);break;case"Ns":e.Kd=+r[1];break;case"Ni":e.Kd=+r[1];break;case"d":e.d=+r[1];break;case"illum":e.illum=+r[1];break;case"map_Kd":const o=new Image;o.src=this.path+"/"+r[1],o.onload=function(a){const c=document.getElementById("readImg");c.width=o.width,c.height=o.height;const f=c.getContext("2d");f.drawImage(o,0,0);const m=f.getImageData(0,0,this.width,this.height);e.map_Kd=new wt(m.data,m.width,m.height)}}}this.mtls.set(n,e)}}class tt extends U{constructor(t,s,e){super("",[t,s,e],[new u(1,0,0)],[new u(1,0,0)],[[1,2,3,""]])}}class et{constructor(){this.objs=[],this.lights=[]}add(t){t instanceof U?this.objs.push(t):this.lights.push(t)}}class yt{constructor(t,s){const{antialias:e="None",coordinateSystem:n="None",Z_Buffer:l=!1}=s;this.canvas=t,this.ctx=this.canvas.getContext("2d"),this.width=this.canvas.clientWidth,this.height=this.canvas.clientHeight,this.buffer=[],this.ctx.translate(0,this.height),this.ctx.scale(1,-1),this.render=new ut(this.ctx,this.buffer,{height:this.height,width:this.width,antialias:e,Z_Buffer:l}),this.viewPortMatrix=new b([this.width/2,0,0,(this.width-1)/2,0,this.height/2,0,(this.height-1)/2,0,0,1,0,0,0,0,1])}raster(t,s){if(s instanceof et){for(let e=0;e<s.objs.length;e++)s.objs[e].transform(t.getMatrix()),s.objs[e].setScreenPosition(this.viewPortMatrix);for(let e=0;e<s.lights.length;e++)s.lights[e].type!=="ambient"&&s.lights[e].transform(t.getMatrix())}this.render.renderBuffer(s,t)}clear(t){this.render.clearBuffer(t)}Loop(t){requestAnimationFrame(()=>{t(),this.Loop(t)})}}class xt{constructor(t,s,e,n,l,r,o,a,c){const f=new u(t,s,e,1),m=new u(n,l,r,1),y=new u(o,a,c);this.e=new u(t,s,e,1),this.g=m.minus(f),this.t=y,this.w=this.g.normalize().multiplyScalar(-1),this.u=y.cross(this.w).normalize(),this.v=this.w.cross(this.u),this.projectMatrix=new b;const[S,d,x]=this.u.get(),[k,z,p]=this.w.get(),[g,M,v]=this.v.get(),[I,P,L,T]=this.e.get();this.cameraMatrix=new b([S,g,k,I,d,M,z,P,x,v,p,L,0,0,0,1]).reverse(),this.transformMatrix=new b}setOrtho(t=1,s=1,e=1,n=1,l=1,r=1){this.projectMatrix=new b([2/(n-e),0,0,-(e+n)/(n-e),0,2/(t-s),0,-(t+s)/(t-s),0,0,2/(l-r),-(l+r)/(l-r),0,0,0,1]).multiply(this.projectMatrix)}setPerspective(t,s,e,n){this.projectMatrix=new b([e,0,0,0,0,e,0,0,0,0,e+n,-e*n,0,0,1,0]),this.perspectiveMatrix=new b([e,0,0,0,0,e,0,0,0,0,e+n,-e*n,0,0,1,0]);const l=Math.tan(t/360*Math.PI).toFixed(8)*Math.abs(e),r=l*s;this.setOrtho(l,-l,-r,r,e,n)}rotate(t,s){this.transformMatrix=this.transformMatrix.rotate(t,s)}translate(t,s,e){this.transformMatrix=this.transformMatrix.translate(t,s,e)}getMatrix(){return this.projectMatrix.multiply(this.cameraMatrix.multiply(this.transformMatrix))}}class it{constructor(t,s,e){this.position=e,this.intensity=t,this.type=s,this.tag="light"}}const st={POINT_LIGHT:"point",AMBIENT_LIGHT:"ambient",DIRECTIONAL_LIGHT:"direction"};class nt extends it{constructor(t,s,e){super(t,st.POINT_LIGHT,s),this.color=e,this.position=s}transform(t){this.position=this.position.multiply(t)}}class pt extends it{constructor(t){super(1,st.AMBIENT_LIGHT),this.color=t}transform(t){this.position=this.position.multiply(t)}}const W={Vector:u,Engine:yt,Matrix:b,Camera:xt,Triangle:tt,Scene:et,PointLight:nt},_=document.getElementById("canvas"),gt=new W.Engine(_,{antialias:"None",coordinateSystem:"3D",Z_Buffer:!0}),rt=new W.Camera(0,0,3,0,0,0,0,1,0);rt.setPerspective(90,_.width/_.height,-1,-100);const R=new W.Scene,Mt=new nt(1,new u(2,2,2,1),new u(1,1,1,1));R.add(Mt);const bt=new pt(new u(.1,.1,.1,1));R.add(bt);new tt(new u(0,0,-10,1),new u(5,0,-10,1),new u(2.5,5,-10,1));async function Nt(){const h=await mt("model","cow.obj");console.log(h),R.add(h)}Nt();setTimeout(()=>{gt.raster(rt,R)},100);