import{t as he}from"./vendor.357e20de.js";const ye=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function r(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerpolicy&&(o.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?o.credentials="include":t.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(t){if(t.ep)return;t.ep=!0;const o=r(t);fetch(t.href,o)}};ye();let R,D;async function $(){if(D)return{adapter:R,device:D};try{R=await navigator.gpu.requestAdapter(),D=await R.requestDevice()}catch{alert("your browser don\u2018t support webgpu")}return{adapter:R,device:D}}function U(n,e,r=GPUBufferUsage.STORAGE){const a={size:e.byteLength+3&-4,usage:r,mappedAtCreation:!0},t=n.createBuffer(a),o=t.getMappedRange();return(e instanceof Uint32Array?new Uint32Array(o):new Float32Array(o)).set(e),t.unmap(),t}function M({device:n,code:e,fragCode:r,layout:a,format:t,vertexEntryPoint:o,vertexBuffers:s,fragEntryPoint:v,primitive:u}){const c={layout:a,vertex:{module:n.createShaderModule({code:e}),entryPoint:o||"vert_main",buffers:s},fragment:{module:n.createShaderModule({code:r||e}),entryPoint:v||"frag_main",targets:[{format:t||"bgra8unorm"}]},primitive:u||{topology:"triangle-list",frontFace:"ccw",cullMode:"none"}};return n.createRenderPipeline(c)}function Z(n,e=1,r=1,a="rgba8unorm",t=GPUTextureUsage.COPY_DST|GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT){return n.createTexture({size:{width:e,height:r},format:a,usage:t})}function q(n,e){return n.beginRenderPass({colorAttachments:[{view:e.getCurrentTexture().createView(),loadValue:"load",loadOp:"load",storeOp:"store"}]})}function I(n){n.end?n.end():n.endPass()}var L=`@group(0) @binding(0) var mySampler: sampler;
@group(0) @binding(1) var myTexture: texture_2d<f32>;

struct VertexOutput {
    @builtin(position) Position: vec4<f32>;
    @location(0) fragUV: vec2<f32>;
};

let pos = array<vec2<f32>, 6>(
    vec2<f32>( 1.0,  1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 1.0,  1.0),
    vec2<f32>(-1.0, -1.0),
    vec2<f32>(-1.0,  1.0)
);

let uv = array<vec2<f32>, 6>(
    vec2<f32>(1.0, 1.0),
    vec2<f32>(1.0, 0.0),
    vec2<f32>(0.0, 0.0),
    vec2<f32>(1.0, 1.0),
    vec2<f32>(0.0, 0.0),
    vec2<f32>(0.0, 1.0)
);

@stage(vertex)
fn vert_main(@builtin(vertex_index) VertexIndex:u32) -> VertexOutput {
    var output: VertexOutput;
    output.Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
    output.fragUV = uv[VertexIndex];
    return output;
}

@stage(fragment)
fn frag_main(@location(0) fragUV: vec2<f32>) -> @location(0) vec4<f32> {
    let rgba = textureSample(myTexture, mySampler, fragUV);
    return rgba;
}

`;const J=new Float32Array([1,1,0,1,1,1,-1,1,0,1,0,1,-1,-1,0,1,0,0,1,-1,0,1,1,0,1,1,0,1,1,1,-1,-1,0,1,0,0]);var xe=`struct Unifroms{
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
}`;let T,z,ne,d,te,j;async function we(){const n=await $();T=document.createElement("canvas"),z=T.getContext("webgpu"),ne=n.adapter,d=n.device,te=z.getPreferredFormat(ne);const e=M({device:d,code:L,fragCode:xe}),r=d.createSampler({magFilter:"linear",minFilter:"linear"}),a=U(d,J,GPUBufferUsage.VERTEX),t=U(d,new Float32Array([0,0,0,0]),GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST);j=({source:o,value:s,center:v})=>{const{width:u,height:c}=o;T.width=u,T.height=c;const b=Z(d,u,c);d.queue.copyExternalImageToTexture({source:o,flipY:!0},{texture:b},{width:u,height:c});const m=1,x=[T.width*m,T.height*m];z.configure({device:d,format:te,size:x,compositingAlphaMode:"opaque"}),d.queue.writeBuffer(t,0,new Float32Array([s,0,...v]));const B=d.createBindGroup({layout:e.getBindGroupLayout(0),entries:[{binding:0,resource:r},{binding:1,resource:b.createView()}]}),G=d.createBindGroup({layout:e.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:t}}]}),f=d.createCommandEncoder(),p=q(f,z);p.setPipeline(e),p.setBindGroup(0,B),p.setBindGroup(1,G),p.setVertexBuffer(0,a),p.draw(6),I(p),d.queue.submit([f?.finish()])}}async function Ue(n,{value:e,center:r}){return isNaN(e)?n:(j||await we(),j({source:n,value:e*Math.PI/36,center:[r.x/200+.5,r.y/200+.5]}),T)}var Be=`struct Unifroms{
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
}`;let C,_,re,g,ae,X;async function Ge(){const n=await $();C=document.createElement("canvas"),_=C.getContext("webgpu"),re=n.adapter,g=n.device,ae=_.getPreferredFormat(re);const e=M({device:g,code:L,fragCode:Be}),r=g.createSampler({magFilter:"linear",minFilter:"linear"}),a=U(g,J,GPUBufferUsage.VERTEX),t=U(g,new Float32Array(new Array(3)),GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST);X=({source:o,ratio:s,seed:v,granularity:u})=>{const{width:c,height:b}=o;C.width=c,C.height=b;const m=Z(g,c,b);g.queue.copyExternalImageToTexture({source:o,flipY:!0},{texture:m},{width:c,height:b});const x=1,B=[C.width*x,C.height*x];_.configure({device:g,format:ae,size:B,compositingAlphaMode:"opaque"}),g.queue.writeBuffer(t,0,new Float32Array([s,v,u]));const G=g.createBindGroup({layout:e.getBindGroupLayout(0),entries:[{binding:0,resource:r},{binding:1,resource:m.createView()}]}),f=g.createBindGroup({layout:e.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:t}}]}),p=g.createCommandEncoder(),w=q(p,_);w.setPipeline(e),w.setBindGroup(0,G),w.setBindGroup(1,f),w.setVertexBuffer(0,a),w.draw(6),I(w),g.queue.submit([p?.finish()])}}async function Pe(n,{value:e=0,seed:r=0,granularity:a=50}){return isNaN(e)?n:(X||await Ge(),X({source:n,ratio:e,seed:r,granularity:a}),C)}var Te=`struct Unifroms{
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
}`;let E,k,oe,i,N,H;async function Ce(){const n=await $();E=document.createElement("canvas"),k=E.getContext("webgpu"),oe=n.adapter,i=n.device,N=k.getPreferredFormat(oe);const e=M({device:i,code:L,fragCode:Te}),r=i.createSampler({magFilter:"linear",minFilter:"linear"}),a=U(i,new Float32Array(new Array(4)),GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST),t=U(i,new Float32Array([1,0,0,0]),GPUBufferUsage.UNIFORM),o=U(i,new Float32Array([0,1,0,0]),GPUBufferUsage.UNIFORM),s=i.createBindGroup({layout:e.getBindGroupLayout(2),entries:[{binding:0,resource:{buffer:t}}]}),v=i.createBindGroup({layout:e.getBindGroupLayout(2),entries:[{binding:0,resource:{buffer:o}}]}),u=U(i,J,GPUBufferUsage.VERTEX);H=({source:c,blur:b})=>{const{width:m,height:x}=c;E.width=m,E.height=x;const B=1,G=[E.width*B,E.height*B],f={width:m,height:x},p=i.createTexture({size:f,format:N,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC|GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING}),w=i.createTexture({size:f,format:N,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC|GPUTextureUsage.TEXTURE_BINDING});i.queue.copyExternalImageToTexture({source:c,flipY:!0},{texture:p},f),k.configure({device:i,format:N,size:G,compositingAlphaMode:"opaque"});const pe={colorAttachments:[{view:w.createView(),loadValue:"load",loadOp:"load",storeOp:"store"}]};i.queue.writeBuffer(a,0,new Float32Array([b,0,m,x]));const ve=i.createBindGroup({layout:e.getBindGroupLayout(0),entries:[{binding:0,resource:r},{binding:1,resource:p.createView()}]}),be=i.createBindGroup({layout:e.getBindGroupLayout(0),entries:[{binding:0,resource:r},{binding:1,resource:w.createView()}]}),ee=i.createBindGroup({layout:e.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:a}}]}),Y=i.createCommandEncoder();let l=Y.beginRenderPass(pe);l.setPipeline(e),l.setBindGroup(0,ve),l.setBindGroup(1,ee),l.setBindGroup(2,s),l.setVertexBuffer(0,u),l.draw(6),I(l),l=q(Y,k),l.setPipeline(e),l.setBindGroup(0,be),l.setBindGroup(1,ee),l.setBindGroup(2,v),l.setVertexBuffer(0,u),l.draw(6),I(l),i.queue.submit([Y.finish()])}}async function Ee(n,{value:e=0}){return isNaN(e)?n:(H||await Ce(),H({source:n,blur:e}),E)}var Se=`struct Unifroms{
    ratio: f32;
    seed: f32;
    granularity: f32;
};

@group(0) @binding(0) var mySampler: sampler;
@group(0) @binding(1) var myTexture: texture_2d<f32>;
@group(1) @binding(1) var<uniform> uniforms: Unifroms;

fn getHalfAngle(lightPos: vec3<f32>, pos: vec3<f32>) -> vec3<f32>{
    return  normalize(normalize(lightPos - pos) + vec3<f32>(0.,0.,1.));
}

@stage(fragment)
fn frag_main(@location(0) fragUV: vec2<f32>) -> @location(0) vec4<f32> {
    var rgba = textureSample(myTexture, mySampler, fragUV);
    // let lightPos = vec3<f32>(1.,1.,1.);
    // let center = vec3<f32>(0.25,0.75,0.);
    // let vector = fragUV - center.xy;
    // let radius = 0.2;
    // let r = length(vector);
    // let z = sqrt(radius*radius-r*r);
    
    // let pos = vec3<f32>(fragUV, z);
    // let normal = normalize(pos - center);
    // let middleAngle = normalize(normalize(light - pos) + vec3<f32>(0.,0.,1.));
    // let val = pow(dot(normal, middleAngle), 4.);

    // if( r < radius){
    //     rgba = vec4<f32>(val, val, val, 1.);
    // }

    // \u76F4\u7EBF
    // if((fragUV.y - 0.006 * fragUV.x)< 0.197) {
    //     rgba = vec4<f32>(0.,0.,0.,1.);
    // }

    // if((fragUV.y + 0.8 * fragUV.x) < 0.63) {
    //     rgba = vec4<f32>(0.,0.,0.,1.);
    // }

    // kx * x + ky * y + kz * z = 1
    // let kx = 1.;
    // let ky = 1.;
    // let kz = 1.;
    let x = fragUV.x;
    let y = fragUV.y;
    // let z = 1. - x - y;
    // let normal = normalize(vec3<f32>(kx, ky, kz));
    // let pos = vec3<f32>(x,y,z);
    // let middleAngle = getHalfAngle(lightPos, pos);
    // let val = pow(dot(normal, middleAngle), 4.);
    // let dist = distance(pos, lightPos);
    // let lightVal = 1. / (dist * dist);
    // let k = val * lightVal;
    // var shadow: vec4<f32>;
    // if(y<0.5){
    //     shadow = vec4<f32>(k, k, k, 1.);
    // }else{
    //     shadow = vec4<f32>(0.,0.,0.,0.);
    // }
    

    // let rgb = rgba.rgb * rgba.a + (1.-rgba.a) * shadow.rgb;
    // let a = rgba.a + shadow.a - rgba.a * shadow.a;

    // return vec4<f32>(rgb, a);

    // let w = 900.;
    // let h = 1016.;
    // let z = -1;
    // let lightCenter = vec3<f32>(-0.5, 1.5, .5);
    // let lightSize = vec2<f32>(0.2, 0.1);
    // let pos = vec3<f32>(fragUV, .28 - 5.*fragUV.y);
    // let uv = fragUV;
    // let stepCount = 10;
    // let r = stepCount / 2;
    // let texZ = 0.;
    // var valSum = 0.;
    // for (var i: i32 = -r; i < r; i = i + 1) {
    //     for (var j: i32 = -r; j < r; j = j + 1) {
    //         let offset = vec2<f32>(f32(i)/f32(stepCount), f32(j)/f32(stepCount)) * lightSize;
    //         var lightPos = lightCenter + vec3<f32>(offset, 0.);
    //         let ramda = (texZ-pos.z)/(lightPos.z - pos.z);
    //         if(ramda > 0.) {
    //             let texPos = ramda * lightPos + (1.-ramda)*pos;
    //             let val = textureSample(myTexture, mySampler, texPos.xy).a;
    //             valSum = valSum + val;
    //         }
    //     }
    // }
    // valSum = valSum / f32(stepCount * stepCount);
    // let shadow = vec4<f32>(0.,0.,0., valSum);

    // let rgb = rgba.rgb * rgba.a + (1.-rgba.a) * shadow.rgb;
    // let a = rgba.a + shadow.a - rgba.a * shadow.a;

    let a = vec3<f32>(0.5,0.2,0.);
    let b = vec3<f32>(0.5,.8,0.);
    // let val = sdCapsule( vec3<f32>(fragUV, 0.), a, b, .02);
    let val = sdCappedCylinder(vec3<f32>(0., fragUV - vec2<f32>(0.5, 0.5)), 0.3, 0.1);
    if(val<0.){
        rgba = vec4<f32>(vec3<f32>(val), 1.);
    }else{
        rgba = vec4<f32>(0.,0.,0.,0.);
    }
    // return shadow;
    // return vec4<f32>(rgb, a);
    return vec4<f32>(rgba.rgb * rgba.a, rgba.a);
}

fn sdCapsule( p:vec3<f32>,  a:vec3<f32>, b:vec3<f32> , r:f32  )->f32{
  let pa = p - a;
  let ba = b - a;
  let h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
  return length( pa - ba*h ) - r;
}

fn sdCappedCylinder( p:vec3<f32>, h:f32, r:f32 )->f32{
  let d = abs(vec2(length(p.xz),p.y)) - vec2(h,r);
  return min(max(d.x,d.y),0.0) + length(max(d, vec2<f32>(0.0)));
}
`;let S,O,ie,h,ue,K;async function Ae(){const n=await $();S=document.createElement("canvas"),O=S.getContext("webgpu"),ie=n.adapter,h=n.device,ue=O.getPreferredFormat(ie);const e=M({device:h,code:L,fragCode:Se}),r=h.createSampler({magFilter:"linear",minFilter:"linear"}),a=U(h,new Float32Array(new Array(3)),GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST);K=({source:t,ratio:o,seed:s,granularity:v})=>{const{width:u,height:c}=t;S.width=u,S.height=c;const b=Z(h,u,c);h.queue.copyExternalImageToTexture({source:t,flipY:!0},{texture:b},{width:u,height:c});const m=1,x=[S.width*m,S.height*m];O.configure({device:h,format:ue,size:x,compositingAlphaMode:"opaque"}),h.queue.writeBuffer(a,0,new Float32Array([o,s,v]));const B=h.createBindGroup({layout:e.getBindGroupLayout(0),entries:[{binding:0,resource:r},{binding:1,resource:b.createView()}]}),G=h.createCommandEncoder(),f=q(G,O);f.setPipeline(e),f.setBindGroup(0,B),f.draw(6,1,0,0),I(f),h.queue.submit([G?.finish()])}}async function Fe(n,{value:e=0,seed:r=0,granularity:a=50}){return isNaN(e)?n:(K||await Ae(),K({source:n,ratio:e,seed:r,granularity:a}),S)}const se=["\u81EA\u5F3A\u4E0D\u606F","\u539A\u5FB7\u8F7D\u7269","\u7CBE\u76CA\u6C42\u7CBE","\u4E0A\u5584\u82E5\u6C34"];async function Ve(n){if(!n)return;const e=document.createElement("a");n.toBlob(r=>{const a=URL.createObjectURL(r);e.download=`\u5938\u514B${se[Math.floor(Math.random()*se.length)]}.png`,e.href=a,e.click()})}function Ie(n){return new Promise(e=>{const r=new FileReader;r.readAsDataURL(n),r.onload=a=>{const t=a?.target?.result;e({url:t})}})}const Re={blur:Ee,noise:Pe,warp:Ue,shadow:Fe},F=document.getElementById("canvas");F.style.maxWidth="1200px";const De=1200,ze=675;F.width=De;F.height=ze;const y={blur:40,warp:10,seed:0,noise:40,granularity:10,shadow:10,center:{x:0,y:0},backgroundColor:"#88ddff"},V=new he.exports.Pane,le=[],_e=V.addFolder({title:"\u80CC\u666F"});le.push(_e.addInput(y,"backgroundColor",{label:"\u80CC\u666F\u8272",view:"color"}));const A=[],Q=V.addFolder({title:"\u6D88\u878D"}),ke=V.addFolder({title:"\u6A21\u7CCA"}),fe=V.addFolder({title:"\u626D\u66F2"});A.push(Q.addInput(y,"noise",{label:"\u6D88\u878D\u5F3A\u5EA6",min:0,max:100}));A.push(Q.addInput(y,"granularity",{label:"\u6D88\u878D\u7C92\u5EA6",min:0,max:100}));A.push(Q.addInput(y,"seed",{label:"\u6D88\u878D\u79CD\u5B50",min:0,max:1}));A.push(ke.addInput(y,"blur",{label:"\u6A21\u7CCA\u5F3A\u5EA6",min:0,max:200}));A.push(fe.addInput(y,"warp",{label:"\u626D\u66F2\u5F3A\u5EA6",min:-100,max:100}));A.push(fe.addInput(y,"center",{label:"\u626D\u66F2\u4E2D\u5FC3",picker:"inline",expanded:!0,x:{step:1,min:-100,max:100},y:{step:1,min:-100,max:100}}));const Ne=V.addButton({title:"\u4E0A\u4F20\u56FE\u7247"}),Oe=V.addButton({title:"\u4E0B\u8F7D\u56FE\u7247"}),ce=F.getContext("2d");let W;const $e=["https://gd-filems.dancf.com/mcm79j/mcm79j/17215/b3db72af-969f-4992-b391-c873d5995d1d1082759.png","https://gd-filems.dancf.com/mcm79j/mcm79j/08978/c85e0a18-b44f-4ffc-9933-41304752ceea12259573.png","https://st0.dancf.com/gaoding-material/0/images/223463/20191107-203725-leuLE.jpg"];let de=$e[0];const P=document.createElement("input");P.type="file";P.accept="image/png";P.style.display="none";P.addEventListener("change",async()=>{if(P.files.length){const{url:n}=await Ie(P.files[0]);de=n,me()}});document.body.appendChild(P);Ne.on("click",()=>{P.click()});Oe.on("click",()=>{console.log(111),Ve(canvas)});me();async function ge(){const{width:n,height:e}=W;F.width=n,F.height=e;const r=[{type:"noise",enable:!0,params:{value:100-y.noise,seed:y.seed,granularity:y.granularity}}];let a=W;for(let t=0;t<r.length;t++){const{type:o,enable:s,params:v}=r[t];if(console.time(o),s){const u=Re[o];u&&(a=await u(a instanceof ImageBitmap?a:await createImageBitmap(a),v))}console.timeEnd(o)}ce.clearRect(0,0,n,e),ce.drawImage(a,0,0)}async function me(){const e=await(await fetch(de)).blob();W=await createImageBitmap(e),ge()}const Me=document.querySelector("body");le.forEach(n=>{n.on("change",()=>{Me.style.backgroundColor=y.backgroundColor})});A.forEach(n=>{n.on("change",()=>{ge()})});
