import{t as pe}from"./vendor.eab43d9c.js";const ve=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function a(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerpolicy&&(r.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?r.credentials="include":n.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(n){if(n.ep)return;n.ep=!0;const r=a(n);fetch(n.href,r)}};ve();let C,V;async function q(){if(V)return{adapter:C,device:V};try{C=await navigator.gpu.requestAdapter(),V=await C.requestDevice()}catch{alert("your browser don\u2018t support webgpu")}return{adapter:C,device:V}}function w(t,e,a=GPUBufferUsage.STORAGE){const o={size:e.byteLength+3&-4,usage:a,mappedAtCreation:!0},n=t.createBuffer(o),r=n.getMappedRange();return(e instanceof Uint32Array?new Uint32Array(r):new Float32Array(r)).set(e),n.unmap(),n}function z({device:t,code:e,fragCode:a,layout:o,format:n,vertexEntryPoint:r,vertexBuffers:s,fragEntryPoint:p,primitive:f}){const g={layout:o,vertex:{module:t.createShaderModule({code:e}),entryPoint:r||"vert_main",buffers:s},fragment:{module:t.createShaderModule({code:a||e}),entryPoint:p||"frag_main",targets:[{format:n||"bgra8unorm"}]},primitive:f||{topology:"triangle-list",frontFace:"ccw",cullMode:"none"}};return t.createRenderPipeline(g)}function ue(t,e=1,a=1,o="rgba8unorm",n=GPUTextureUsage.COPY_DST|GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT){return t.createTexture({size:{width:e,height:a},format:o,usage:n})}function X(t,e){return t.beginRenderPass({colorAttachments:[{view:e.getCurrentTexture().createView(),loadValue:"load",loadOp:"load",storeOp:"store"}]})}function N(t){t.end?t.end():t.endPass()}var Y=`@group(0) @binding(0) var mySampler: sampler;
@group(0) @binding(1) var myTexture: texture_2d<f32>;

struct VertexOutput {
    @builtin(position) Position: vec4<f32>;
    @location(0) fragUV: vec2<f32>;
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

// @stage(vertex)
// fn vert_main(@builtin(vertex_index) VertexIndex: u32) -> VertexOutput {
//     var output: VertexOutput;
//     // let index:u32 = VertexIndex;
//     var index:u32 = VertexIndex + 0u;
//     // var index:u32 = 
//     let sb = pos[u32(0u+1u)];
//     output.Position = vec4<f32>(pos[index], 0.0, 1.0);
//     output.fragUV = uv[index];
//     return output;
// }

@stage(vertex)
fn vert_main(@location(0) position : vec4<f32>,
        @location(1) uv : vec2<f32>) -> VertexOutput {
    var output : VertexOutput;
    output.Position =  position;
    output.fragUV = uv;
  return output;
}

@stage(fragment)
fn frag_main(@location(0) fragUV: vec2<f32>) -> @location(0) vec4<f32> {
    let rgba = textureSample(myTexture, mySampler, fragUV);
    return rgba;
}

`;const H=4*6,K=0,j=4*4,W=new Float32Array([1,1,0,1,1,1,-1,1,0,1,0,1,-1,-1,0,1,0,0,1,-1,0,1,1,0,1,1,0,1,1,1,-1,-1,0,1,0,0]);var xe=`struct Unifroms{
    angle: f32;
    center: vec2<f32>;
};

@group(0) @binding(0) var mySampler: sampler;
@group(0) @binding(1) var myTexture: texture_2d<f32>;
@group(1) @binding(0) var<uniform> uniforms: Unifroms;
@stage(fragment)
fn frag_main(@location(0) fragUV: vec2<f32>) -> @location(0) vec4<f32> {
    let center = uniforms.center;
    // let center = vec2<f32>(0.5, 0.5);
    let uv0 = fragUV - center;
    var l = length(uv0) * 2.;
    l = clamp(1. - l, 0., 1.);
    let theta = l * uniforms.angle;
    let s = sin(theta);
    let c = cos(theta);
    let matrix2 = mat2x2<f32>(c, s, -s, c);
    let uv = matrix2 * uv0 + center;
    let rgba = textureSample(myTexture, mySampler, uv);
    // wgpu bug ?
    return vec4<f32>(rgba.rgb * rgba.a, rgba.a);
}`;let U,I,Z,l,ee,_;async function ye(){const t=await q();U=document.createElement("canvas"),I=U.getContext("webgpu"),Z=t.adapter,l=t.device,ee=I.getPreferredFormat(Z);const e=z({device:l,code:Y,fragCode:xe,vertexBuffers:[{arrayStride:H,attributes:[{shaderLocation:0,offset:K,format:"float32x4"},{shaderLocation:1,offset:j,format:"float32x2"}]}]}),a=l.createSampler({magFilter:"linear",minFilter:"linear"}),o=w(l,W,GPUBufferUsage.VERTEX),n=w(l,new Float32Array([0,0,0,0]),GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST);_=({source:r,value:s,center:p})=>{const{width:f,height:g}=r;U.width=f,U.height=g;const y=ue(l,f,g);l.queue.copyExternalImageToTexture({source:r,flipY:!0},{texture:y},{width:f,height:g});const v=1,b=[U.width*v,U.height*v];I.configure({device:l,format:ee,size:b}),l.queue.writeBuffer(n,0,new Float32Array([s,0,...p]));const P=l.createBindGroup({layout:e.getBindGroupLayout(0),entries:[{binding:0,resource:a},{binding:1,resource:y.createView()}]}),F=l.createBindGroup({layout:e.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:n}}]}),h=l.createCommandEncoder(),m=X(h,I);m.setPipeline(e),m.setBindGroup(0,P),m.setBindGroup(1,F),m.setVertexBuffer(0,o),m.draw(6),N(m),l.queue.submit([h?.finish()])}}async function be(t,{value:e,center:a}){return isNaN(e)?t:(_||await ye(),_({source:t,value:e*Math.PI/36,center:[a.x/200+.5,a.y/200+.5]}),U)}var he=`struct Unifroms{
    ratio: f32;
    seed: f32;
    granularity: f32;
};

@group(0) @binding(0) var mySampler: sampler;
@group(0) @binding(1) var myTexture: texture_2d<f32>;
@group(1) @binding(0) var<uniform> uniforms: Unifroms;

fn random(st:vec2<f32>)->f32 {
    return fract(sin(uniforms.seed + dot(st.xy, vec2<f32>(12.9898, 78.233))) * 43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
fn noise(st:vec2<f32>)->f32 {
    let i = floor(st);
    let f = fract(st);

    // Four corners in 2D of a tile
    let a = random(i);
    let b = random(i + vec2<f32>(1.0, 0.0));
    let c = random(i + vec2<f32>(0.0, 1.0));
    let d = random(i + vec2<f32>(1.0, 1.0));

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

@stage(fragment)
fn frag_main(@location(0) fragUV: vec2<f32>) -> @location(0) vec4<f32> {
    let uv = fragUV;
    let rgba = textureSample(myTexture, mySampler, uv);

    let p = uv * uniforms.granularity;
    let value = fbm(p);

    let k = 1. - (1. - value) * 0.01 * uniforms.ratio;
    if(value > uniforms.ratio * 0.01) {
        return vec4<f32>(0.);
    }
    return vec4<f32>(rgba.rgb, rgba.a);
}`;let G,R,te,d,ne,$;async function we(){const t=await q();G=document.createElement("canvas"),R=G.getContext("webgpu"),te=t.adapter,d=t.device,ne=R.getPreferredFormat(te);const e=z({device:d,code:Y,fragCode:he,vertexBuffers:[{arrayStride:H,attributes:[{shaderLocation:0,offset:K,format:"float32x4"},{shaderLocation:1,offset:j,format:"float32x2"}]}]}),a=d.createSampler({magFilter:"linear",minFilter:"linear"}),o=w(d,W,GPUBufferUsage.VERTEX),n=w(d,new Float32Array(new Array(3)),GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST);$=({source:r,ratio:s,seed:p,granularity:f})=>{const{width:g,height:y}=r;G.width=g,G.height=y;const v=ue(d,g,y);d.queue.copyExternalImageToTexture({source:r},{texture:v},{width:g,height:y});const b=1,P=[G.width*b,G.height*b];R.configure({device:d,format:ne,size:P}),d.queue.writeBuffer(n,0,new Float32Array([s,p,f]));const F=d.createBindGroup({layout:e.getBindGroupLayout(0),entries:[{binding:0,resource:a},{binding:1,resource:v.createView()}]}),h=d.createBindGroup({layout:e.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:n}}]}),m=d.createCommandEncoder(),x=X(m,R);x.setPipeline(e),x.setBindGroup(0,F),x.setBindGroup(1,h),x.setVertexBuffer(0,o),x.draw(6),N(x),d.queue.submit([m?.finish()])}}async function Be(t,{value:e=0,seed:a=0,granularity:o=50}){return isNaN(e)?t:($||await we(),$({source:t,ratio:e,seed:a,granularity:o}),G)}var Ue=`struct Unifroms{
    sigma: f32;
    canvasSize: vec2<f32>; // \u56FE\u7247\u5927\u5C0F
};
struct Direction{
    value: vec2<f32>; // \u56FE\u7247\u5927\u5C0F
};

// \u5377\u79EF\u8303\u56F4 k \u4E3A\u6807\u51C6\u5DEE\u7CFB\u6570 r = k * sigma, \u533A\u95F4\uFF08\u03BC-3\u03C3, \u03BC+3\u03C3\uFF09\u5185\u7684\u9762\u79EF\u4E3A99.73%, \u6240\u4EE5\u5377\u79EF\u8303\u56F4\u4E00\u822C\u53D6 3
let k = 3.0;
let maxKernelSize = 1000.0;
@group(0) @binding(0) var mySampler: sampler;
@group(0) @binding(1) var myTexture: texture_2d<f32>;
@group(1) @binding(0) var<uniform> uniforms: Unifroms;
@group(2) @binding(0) var<uniform> direction: Direction;
@stage(fragment)
fn frag_main(@location(0) fragUV: vec2<f32>) -> @location(0) vec4<f32> {
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
        let offsetVec = direction.value * offset;

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
    let color = clamp(rgba / weightSum, vec4<f32>(0.), vec4<f32>(1.));
    return color;
}`;let E,D,re,u,O,k;async function Ge(){const t=await q();E=document.createElement("canvas"),D=E.getContext("webgpu"),re=t.adapter,u=t.device,O=D.getPreferredFormat(re);const e=z({device:u,code:Y,fragCode:Ue,vertexBuffers:[{arrayStride:H,attributes:[{shaderLocation:0,offset:K,format:"float32x4"},{shaderLocation:1,offset:j,format:"float32x2"}]}]}),a=u.createSampler({magFilter:"linear",minFilter:"linear"}),o=w(u,new Float32Array(new Array(4)),GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST),n=w(u,new Float32Array([1,0,0,0]),GPUBufferUsage.UNIFORM),r=w(u,new Float32Array([0,1,0,0]),GPUBufferUsage.UNIFORM),s=u.createBindGroup({layout:e.getBindGroupLayout(2),entries:[{binding:0,resource:{buffer:n}}]}),p=u.createBindGroup({layout:e.getBindGroupLayout(2),entries:[{binding:0,resource:{buffer:r}}]}),f=w(u,W,GPUBufferUsage.VERTEX);k=({source:g,blur:y})=>{const{width:v,height:b}=g;E.width=v,E.height=b;const P=1,F=[E.width*P,E.height*P],h={width:v,height:b},m=u.createTexture({size:h,format:O,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC|GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING}),x=u.createTexture({size:h,format:O,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC|GPUTextureUsage.TEXTURE_BINDING});u.queue.copyExternalImageToTexture({source:g},{texture:m},h),D.configure({device:u,format:O,size:F});const de={colorAttachments:[{view:x.createView(),loadValue:"load",loadOp:"load",storeOp:"store"}]};u.queue.writeBuffer(o,0,new Float32Array([y,0,v,b]));const ge=u.createBindGroup({layout:e.getBindGroupLayout(0),entries:[{binding:0,resource:a},{binding:1,resource:m.createView()}]}),me=u.createBindGroup({layout:e.getBindGroupLayout(0),entries:[{binding:0,resource:a},{binding:1,resource:x.createView()}]}),Q=u.createBindGroup({layout:e.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:o}}]}),L=u.createCommandEncoder();let i=L.beginRenderPass(de);i.setPipeline(e),i.setBindGroup(0,ge),i.setBindGroup(1,Q),i.setBindGroup(2,s),i.setVertexBuffer(0,f),i.draw(6),N(i),i=X(L,D),i.setPipeline(e),i.setBindGroup(0,me),i.setBindGroup(1,Q),i.setBindGroup(2,p),i.setVertexBuffer(0,f),i.draw(6),N(i),u.queue.submit([L.finish()])}}async function Ee(t,{value:e=0}){return isNaN(e)?t:(k||await Ge(),k({source:t,blur:e}),E)}const ae=["\u81EA\u5F3A\u4E0D\u606F","\u539A\u5FB7\u8F7D\u7269","\u7CBE\u76CA\u6C42\u7CBE","\u4E0A\u5584\u82E5\u6C34"];async function Te(t){if(!t)return;const e=document.createElement("a");t.toBlob(a=>{const o=URL.createObjectURL(a);e.download=`\u5938\u514B${ae[Math.floor(Math.random()*ae.length)]}.png`,e.href=o,e.click()})}function Pe(t){return new Promise(e=>{const a=new FileReader;a.readAsDataURL(t),a.onload=o=>{const n=o?.target?.result;e({url:n})}})}const Se={blur:Ee,noise:Be,warp:be},S=document.getElementById("canvas");S.style.maxWidth="1200px";const Ae=1200,Fe=675;S.width=Ae;S.height=Fe;const c={blur:40,warp:10,seed:0,noise:40,granularity:10,center:{x:0,y:0},backgroundColor:"#88ddff"},A=new pe.exports.Pane,ie=[],Ce=A.addFolder({title:"\u80CC\u666F"});ie.push(Ce.addInput(c,"backgroundColor",{label:"\u80CC\u666F\u8272",view:"color"}));const T=[],J=A.addFolder({title:"\u6D88\u878D"}),Ve=A.addFolder({title:"\u6A21\u7CCA"}),se=A.addFolder({title:"\u626D\u66F2"});T.push(J.addInput(c,"noise",{label:"\u6D88\u878D\u5F3A\u5EA6",min:0,max:100}));T.push(J.addInput(c,"granularity",{label:"\u6D88\u878D\u7C92\u5EA6",min:0,max:100}));T.push(J.addInput(c,"seed",{label:"\u6D88\u878D\u79CD\u5B50",min:0,max:1}));T.push(Ve.addInput(c,"blur",{label:"\u6A21\u7CCA\u5F3A\u5EA6",min:0,max:200}));T.push(se.addInput(c,"warp",{label:"\u626D\u66F2\u5F3A\u5EA6",min:-100,max:100}));T.push(se.addInput(c,"center",{label:"\u626D\u66F2\u4E2D\u5FC3",picker:"inline",expanded:!0,x:{step:1,min:-100,max:100},y:{step:1,min:-100,max:100}}));const Ie=A.addButton({title:"\u4E0A\u4F20\u56FE\u7247"}),Re=A.addButton({title:"\u4E0B\u8F7D\u56FE\u7247"}),oe=S.getContext("2d");let M,ce="https://st0.dancf.com/gaoding-material/0/images/223463/20191107-203725-leuLE.jpg";const B=document.createElement("input");B.type="file";B.accept="image/png";B.style.display="none";B.addEventListener("change",async()=>{if(B.files.length){const{url:t}=await Pe(B.files[0]);ce=t,le()}});document.body.appendChild(B);Ie.on("click",()=>{B.click()});Re.on("click",()=>{console.log(111),Te(canvas)});le();async function fe(){const{width:t,height:e}=M;S.width=t,S.height=e;const a=[{type:"noise",enable:!0,params:{value:100-c.noise,seed:c.seed,granularity:c.granularity}},{type:"blur",enable:!0,params:{value:c.blur,k:0}},{type:"warp",enable:!0,params:{value:c.warp,center:c.center}}];let o=M;for(let n=0;n<a.length;n++){const{type:r,enable:s,params:p}=a[n];if(console.time(r),s){const f=Se[r];f&&(o=await f(o instanceof ImageBitmap?o:await createImageBitmap(o),p))}console.timeEnd(r)}oe.clearRect(0,0,t,e),oe.drawImage(o,0,0)}async function le(){const e=await(await fetch(ce)).blob();M=await createImageBitmap(e),fe()}const De=document.querySelector("body");ie.forEach(t=>{t.on("change",()=>{De.style.backgroundColor=c.backgroundColor})});T.forEach(t=>{t.on("change",()=>{fe()})});
