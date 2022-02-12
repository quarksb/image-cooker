import{t as se}from"./vendor.eab43d9c.js";const le=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerpolicy&&(o.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?o.credentials="include":n.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}};le();let F,P;async function L(){if(P)return{adapter:F,device:P};try{F=await navigator.gpu.requestAdapter(),P=await F.requestDevice()}catch{alert("your browser don\u2018t support webgpu")}return{adapter:F,device:P}}function C(t,e,r=GPUBufferUsage.STORAGE){const a={size:e.byteLength+3&-4,usage:r,mappedAtCreation:!0},n=t.createBuffer(a),o=n.getMappedRange();return(e instanceof Uint32Array?new Uint32Array(o):new Float32Array(o)).set(e),n.unmap(),n}function M({device:t,code:e,fragCode:r,layout:a,format:n,vertexEntryPoint:o,vertexBuffers:s,fragEntryPoint:g,primitive:c}){const p={layout:a,vertex:{module:t.createShaderModule({code:e}),entryPoint:o||"vert_main",buffers:s},fragment:{module:t.createShaderModule({code:r||e}),entryPoint:g||"frag_main",targets:[{format:n||"bgra8unorm"}]},primitive:c||{topology:"triangle-list",frontFace:"ccw",cullMode:"none"}};return t.createRenderPipeline(p)}function ee(t,e=1,r=1,a="rgba8unorm",n=GPUTextureUsage.COPY_DST|GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT){return t.createTexture({size:{width:e,height:r},format:a,usage:n})}function q(t,e){return t.beginRenderPass({colorAttachments:[{view:e.getCurrentTexture().createView(),loadOp:"load",storeOp:"store"}]})}var z=`[[group(0), binding(0)]] var mySampler: sampler;
[[group(0), binding(1)]] var myTexture: texture_2d<f32>;

[[block]] struct VertexOutput {
    [[builtin(position)]] Position: vec4<f32>;
    [[location(0)]] fragUV: vec2<f32>;
};

let pos = array<vec2<f32>, 6>(
    vec2<f32>(1.0, 1.0),
    vec2<f32>(1.0, -1.0),
    vec2<f32>(-1.0, -1.0),
    vec2<f32>(1.0, 1.0),
    vec2<f32>(-1.0, -1.0),
    vec2<f32>(-1.0, 1.0)
);

let uv = array<vec2<f32>, 6>(
    vec2<f32>(1.0, 0.0),
    vec2<f32>(1.0, 1.0),
    vec2<f32>(0.0, 1.0),
    vec2<f32>(1.0, 0.0),
    vec2<f32>(0.0, 1.0),
    vec2<f32>(0.0, 0.0)
);

[[stage(vertex)]]
fn vert_main([[builtin(vertex_index)]] VertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
    output.Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
    output.fragUV = uv[VertexIndex];
    return output;
}

[[stage(fragment)]]
fn frag_main([[location(0)]] fragUV: vec2<f32>) -> [[location(0)]] vec4<f32> {
    let rgba = textureSample(myTexture, mySampler, fragUV);
    return rgba;
}

`,de=`[[block]] struct Unifroms{
    angle: f32;
    center: vec2<f32>;
};

[[group(0) ,binding(0)]] var mySampler: sampler;
[[group(0) ,binding(1)]] var myTexture: texture_2d<f32>;
[[group(1) ,binding(0)]] var<uniform> uniforms: Unifroms;
[[stage(fragment)]]
fn frag_main([[location(0)]] fragUV: vec2<f32>) -> [[location(0)]] vec4<f32> {
    let center = uniforms.center;
    // let center = vec2<f32>(0.5, 0.5);
    let uv0 = fragUV - center;
    var l = length(uv0);
    l = clamp(1. - l, 0., 1.);
    let theta = l * uniforms.angle;
    let s = sin(theta);
    let c = cos(theta);
    let matrix2 = mat2x2<f32>(c, s, -s, c);
    let uv = matrix2 * uv0 + center;
    let rgba = textureSample(myTexture, mySampler, uv);
    // wgpu bug ?
    return vec4(rgba.rgb * rgba.a, rgba.a);
}`;let h,I,H,d,K,V;async function fe(){const t=await L();h=document.createElement("canvas"),I=h.getContext("webgpu"),H=t.adapter,d=t.device,K=I.getPreferredFormat(H);const e=M({device:d,code:z,fragCode:de}),r=d.createSampler({magFilter:"linear",minFilter:"linear"}),a=C(d,new Float32Array([0,0,0,0]),GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST);V=({source:n,value:o,center:s})=>{const{width:g,height:c}=n;h.width=g,h.height=c;const p=ee(d,g,c);d.queue.copyExternalImageToTexture({source:n},{texture:p},{width:g,height:c});const v=1,y=[h.width*v,h.height*v];I.configure({device:d,format:K,size:y}),d.queue.writeBuffer(a,0,new Float32Array([o,0,...s]));const T=d.createBindGroup({layout:e.getBindGroupLayout(0),entries:[{binding:0,resource:r},{binding:1,resource:p.createView()}]}),A=d.createBindGroup({layout:e.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:a}}]}),b=d.createCommandEncoder(),m=q(b,I);m.setPipeline(e),m.setBindGroup(0,T),m.setBindGroup(1,A),m.draw(6),m.end(),d.queue.submit([b?.finish()])}}async function ge(t,{value:e,center:r}){return isNaN(e)?t:(V||await fe(),V({source:t,value:e*Math.PI/36,center:[r.x/200+.5,r.y/200+.5]}),h)}var me=`[[block]] struct Unifroms{
    ratio: f32;
    seed: f32;
    granularity: f32;
};

[[group(0) ,binding(0)]] var mySampler: sampler;
[[group(0) ,binding(1)]] var myTexture: texture_2d<f32>;
[[group(1) ,binding(0)]] var<uniform> uniforms: Unifroms;

fn random(st:vec2<f32>)->f32 {
    return fract(sin(uniforms.seed + dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
fn noise(st:vec2<f32>)->f32 {
    let i = floor(st);
    let f = fract(st);

    // Four corners in 2D of a tile
    let a = random(i);
    let b = random(i + vec2(1.0, 0.0));
    let c = random(i + vec2(0.0, 1.0));
    let d = random(i + vec2(1.0, 1.0));

    let u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

let OCTAVES = 6u;
fn fbm(st:vec2<f32>)->f32 {
    // Initial values
    var value = 0.0;
    var amplitude = .5;
    let frequency = 0.;
    var uv = st;
    // Loop of octaves
    for(var i = 0u; i < OCTAVES; i = i + 1u) {
        value = value + amplitude * noise(uv);
        uv = uv * 2.;
        amplitude = amplitude * .5;
    }
    return value;
}

[[stage(fragment)]]
fn frag_main([[location(0)]] fragUV: vec2<f32>) -> [[location(0)]] vec4<f32> {
    let uv = fragUV;
    let rgba = textureSample(myTexture, mySampler, uv);

    let p = uv * uniforms.granularity;
    let value = fbm(p);

    let k = 1. - (1. - value) * 0.01 * uniforms.ratio;
    if(value > uniforms.ratio * 0.01) {
        return vec4(0.);
    }
    return vec4(rgba.rgb, rgba.a);
}`;let B,R,j,f,W,_;async function pe(){const t=await L();B=document.createElement("canvas"),R=B.getContext("webgpu"),j=t.adapter,f=t.device,W=R.getPreferredFormat(j);const e=M({device:f,code:z,fragCode:me}),r=f.createSampler({magFilter:"linear",minFilter:"linear"}),a=C(f,new Float32Array(new Array(3)),GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST);_=({source:n,ratio:o,seed:s,granularity:g})=>{const{width:c,height:p}=n;B.width=c,B.height=p;const v=ee(f,c,p);f.queue.copyExternalImageToTexture({source:n},{texture:v},{width:c,height:p});const y=1,T=[B.width*y,B.height*y];R.configure({device:f,format:W,size:T}),f.queue.writeBuffer(a,0,new Float32Array([o,s,g]));const A=f.createBindGroup({layout:e.getBindGroupLayout(0),entries:[{binding:0,resource:r},{binding:1,resource:v.createView()}]}),b=f.createBindGroup({layout:e.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:a}}]}),m=f.createCommandEncoder(),x=q(m,R);x.setPipeline(e),x.setBindGroup(0,A),x.setBindGroup(1,b),x.draw(6),x.end(),f.queue.submit([m?.finish()])}}async function ve(t,{value:e=0,seed:r=0,granularity:a=50}){return isNaN(e)?t:(_||await pe(),_({source:t,ratio:e,seed:r,granularity:a}),B)}var ye=`[[block]] struct Unifroms{
    sigma: f32;
    canvasSize: vec2<f32>; // \u56FE\u7247\u5927\u5C0F
};


// \u5377\u79EF\u8303\u56F4 k \u4E3A\u6807\u51C6\u5DEE\u7CFB\u6570 r = k * sigma, \u533A\u95F4\uFF08\u03BC-3\u03C3, \u03BC+3\u03C3\uFF09\u5185\u7684\u9762\u79EF\u4E3A99.73%, \u6240\u4EE5\u5377\u79EF\u8303\u56F4\u4E00\u822C\u53D6 3
let k = 3.0;
let maxKernelSize = 1000.0;
[[group(0), binding(0)]] var mySampler: sampler;
[[group(0), binding(1)]] var myTexture: texture_2d<f32>;
[[group(1), binding(0)]] var<uniform> uniforms: Unifroms;
[[group(2), binding(0)]] var<uniform> direction: vec2<f32>;
[[stage(fragment)]]
fn frag_main([[location(0)]] fragUV: vec2<f32>) -> [[location(0)]] vec4<f32> {
    let uv = fragUV;
    let kernelRadius = uniforms.sigma * k;
    let scale2X = -0.5 / (uniforms.sigma * uniforms.sigma); // \u540E\u7EED\u9AD8\u65AF\u8868\u8FBE\u5F0F\u4E2D\u4F7F\u7528

    // \u4E2D\u5FC3\u70B9\u989C\u8272\u548C\u6743\u91CD
    var rgba = textureSample(myTexture, mySampler, uv);
    var weightSum:f32 = 1.0;
    // \u5145\u5206\u5229\u7528\u7EBF\u6027\u91C7\u6837 https://www.rastergrid.com/blog/2010/09/efficient-gaussian-blur-with-linear-sampling/
    for(var y:f32 = 0.; y < maxKernelSize; y = y + 2.) {
        if(y >= kernelRadius) { break; }
        let offset1 = y + 1.;
        let offset2 = y + 2.;
        let x1 = scale2X * offset1 * offset1;
        let x2 = scale2X * offset2 * offset2;
        let weight1 = exp(x1);
        let weight2 = exp(x2);

        let weight = weight1 + weight2;
        let offset = (weight1 * offset1 + weight2 * offset2) / weight;
        let offsetVec = direction * offset;

        var srcTmp = textureSample(myTexture, mySampler, uv + offsetVec/uniforms.canvasSize);
        weightSum = weightSum + weight;
        rgba = rgba + srcTmp * weight;

        // \u7531\u4E8E\u9AD8\u65AF\u51FD\u6570\u5BF9\u79F0\u6027\uFF0C\u504F\u79FB\u76F8\u53CD\u7684\u4F4D\u7F6E\u6743\u91CD\u76F8\u7B49
        srcTmp = textureSample(myTexture, mySampler, uv - offsetVec/uniforms.canvasSize);
        weightSum = weightSum + weight;
        rgba = rgba + srcTmp * weight;
    }

    let sb = textureSample(myTexture, mySampler, uv);
    // let color = sb;
    let color = clamp(rgba / weightSum, vec4(0.), vec4(1.));
    return color;
}`;let U,D,J,i,N,k;async function be(){const t=await L();U=document.createElement("canvas"),D=U.getContext("webgpu"),J=t.adapter,i=t.device,N=D.getPreferredFormat(J);const e=M({device:i,code:z,fragCode:ye}),r=i.createSampler({magFilter:"linear",minFilter:"linear"}),a=C(i,new Float32Array(new Array(4)),GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST),n=C(i,new Float32Array([1,0,0,0]),GPUBufferUsage.UNIFORM),o=C(i,new Float32Array([0,1,0,0]),GPUBufferUsage.UNIFORM),s=i.createBindGroup({layout:e.getBindGroupLayout(2),entries:[{binding:0,resource:{buffer:n}}]}),g=i.createBindGroup({layout:e.getBindGroupLayout(2),entries:[{binding:0,resource:{buffer:o}}]});k=({source:c,blur:p})=>{const{width:v,height:y}=c;U.width=v,U.height=y;const T=1,A=[U.width*T,U.height*T],b={width:v,height:y},m=i.createTexture({size:b,format:N,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC|GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING}),x=i.createTexture({size:b,format:N,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC|GPUTextureUsage.TEXTURE_BINDING});i.queue.copyExternalImageToTexture({source:c},{texture:m},b),D.configure({device:i,format:N,size:A});const ie={colorAttachments:[{view:x.createView(),loadOp:"load",storeOp:"store"}]};i.queue.writeBuffer(a,0,new Float32Array([p,0,v,y]));const ue=i.createBindGroup({layout:e.getBindGroupLayout(0),entries:[{binding:0,resource:r},{binding:1,resource:m.createView()}]}),ce=i.createBindGroup({layout:e.getBindGroupLayout(0),entries:[{binding:0,resource:r},{binding:1,resource:x.createView()}]}),X=i.createBindGroup({layout:e.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:a}}]}),O=i.createCommandEncoder();let l=O.beginRenderPass(ie);l.setPipeline(e),l.setBindGroup(0,ue),l.setBindGroup(1,X),l.setBindGroup(2,s),l.draw(6),l.end(),l=q(O,D),l.setPipeline(e),l.setBindGroup(0,ce),l.setBindGroup(1,X),l.setBindGroup(2,g),l.draw(6),l.end(),i.queue.submit([O.finish()])}}async function xe(t,{value:e=0}){return isNaN(e)?t:(k||await be(),k({source:t,blur:e}),U)}const Q=["\u81EA\u5F3A\u4E0D\u606F","\u539A\u5FB7\u8F7D\u7269","\u7CBE\u76CA\u6C42\u7CBE","\u4E0A\u5584\u82E5\u6C34"];async function we(t){if(!t)return;const e=document.createElement("a");t.toBlob(r=>{const a=URL.createObjectURL(r);e.download=`\u5938\u514B${Q[Math.floor(Math.random()*Q.length)]}.png`,e.href=a,e.click()})}function he(t){return new Promise(e=>{const r=new FileReader;r.readAsDataURL(t),r.onload=a=>{const n=a?.target?.result;e({url:n})}})}const Be={blur:xe,noise:ve,warp:ge},E=document.getElementById("canvas");E.style.maxWidth="1200px";const Ue=1200,Ge=675;E.width=Ue;E.height=Ge;const u={blur:40,warp:100,seed:0,noise:40,granularity:10,center:{x:0,y:0},backgroundColor:"#88ddff"},S=new se.exports.Pane,te=[],Te=S.addFolder({title:"\u80CC\u666F"});te.push(Te.addInput(u,"backgroundColor",{label:"\u80CC\u666F\u8272",view:"color"}));const G=[],Y=S.addFolder({title:"\u6D88\u878D"}),Ee=S.addFolder({title:"\u6A21\u7CCA"}),ne=S.addFolder({title:"\u626D\u66F2"});G.push(Y.addInput(u,"noise",{label:"\u6D88\u878D\u5F3A\u5EA6",min:0,max:100}));G.push(Y.addInput(u,"granularity",{label:"\u6D88\u878D\u7C92\u5EA6",min:0,max:100}));G.push(Y.addInput(u,"seed",{label:"\u6D88\u878D\u79CD\u5B50",min:0,max:1}));G.push(Ee.addInput(u,"blur",{label:"\u6A21\u7CCA\u5F3A\u5EA6",min:0,max:200}));G.push(ne.addInput(u,"warp",{label:"\u626D\u66F2\u5F3A\u5EA6",min:-100,max:100}));G.push(ne.addInput(u,"center",{label:"\u626D\u66F2\u4E2D\u5FC3",picker:"inline",expanded:!0,x:{step:1,min:-100,max:100},y:{step:1,min:-100,max:100}}));const Se=S.addButton({title:"\u4E0A\u4F20\u56FE\u7247"}),Ae=S.addButton({title:"\u4E0B\u8F7D\u56FE\u7247"}),Z=E.getContext("2d");let $,re="https://st0.dancf.com/gaoding-material/0/images/223463/20191107-203725-leuLE.jpg";const w=document.createElement("input");w.type="file";w.accept="image/png";w.style.display="none";w.addEventListener("change",async()=>{if(w.files.length){const{url:t}=await he(w.files[0]);re=t,oe()}});document.body.appendChild(w);Se.on("click",()=>{w.click()});Ae.on("click",()=>{console.log(111),we(canvas)});oe();async function ae(){const{width:t,height:e}=$;E.width=t,E.height=e;const r=[{type:"noise",enable:u.noise>0,params:{value:100-u.noise,seed:u.seed,granularity:u.granularity}},{type:"blur",enable:u.blur>0,params:{value:u.blur,k:0}},{type:"warp",enable:u.warp>0||u.warp<0,params:{value:u.warp,center:u.center}}];let a=$;for(let n=0;n<r.length;n++){const{type:o,enable:s,params:g}=r[n];if(console.time(o),s){const c=Be[o];c&&(a=await c(a,g))}console.timeEnd(o)}Z.clearRect(0,0,t,e),Z.drawImage(a,0,0)}async function oe(){const e=await(await fetch(re)).blob();$=await createImageBitmap(e),ae()}const Ce=document.querySelector("body");te.forEach(t=>{t.on("change",()=>{Ce.style.backgroundColor=u.backgroundColor})});G.forEach(t=>{t.on("change",()=>{ae()})});
