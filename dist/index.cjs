"use strict";var T=Object.create;var o=Object.defineProperty;var x=Object.getOwnPropertyDescriptor;var y=Object.getOwnPropertyNames;var C=Object.getPrototypeOf,I=Object.prototype.hasOwnProperty;var O=(i,t,e)=>t in i?o(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var a=(i,t)=>o(i,"name",{value:t,configurable:!0});var S=(i,t)=>{for(var e in t)o(i,e,{get:t[e],enumerable:!0})},p=(i,t,e,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of y(t))!I.call(i,r)&&r!==e&&o(i,r,{get:()=>t[r],enumerable:!(s=x(t,r))||s.enumerable});return i};var R=(i,t,e)=>(e=i!=null?T(C(i)):{},p(t||!i||!i.__esModule?o(e,"default",{value:i,enumerable:!0}):e,i)),j=i=>p(o({},"__esModule",{value:!0}),i);var n=(i,t,e)=>O(i,typeof t!="symbol"?t+"":t,e);var P={};S(P,{ChartDimensionError:()=>l,ChartError:()=>h,createChart:()=>L,createChartImage:()=>b,createChartImgSrc:()=>U,createChartSvg:()=>k,default:()=>A});module.exports=j(P);var v=R(require("echarts"),1);var d=class d extends Error{constructor(t){super(t),this.name="ChartError"}};a(d,"ChartError");var h=d,u=class u extends h{constructor(t){super(t),this.name="ChartDimensionError"}};a(u,"ChartDimensionError");var l=u,c,f=(c=class{constructor(t=!1){n(this,"startTime",0);n(this,"endTime",0);n(this,"verbose",!1);n(this,"call",a((t,...e)=>{this.verbose&&t(e)},"call"));this.verbose=t}start(){return this.call(()=>this.startTime=performance.now()),this}end(){return this.call(()=>this.endTime=performance.now()),this}get duration(){return this.endTime-this.startTime}log(t){this.call(()=>{this.startTime>0&&this.endTime===0&&this.end(),console.log(`%c\u23F1\uFE0F ${t} took ${this.duration.toPrecision(4)}ms`,"color: lightblue; font-weight: bold"),this.startTime=0,this.endTime=0})}},a(c,"Timing"),c);function D(i){switch(i){case"png":return"image/png";case"jpeg":return"image/jpeg";case"svg":return"image/svg+xml";case"webp":return"image/webp";default:throw new h("Invalid image type")}}a(D,"chartImageTypeToMime");var g,m=(g=class{constructor(t){n(this,"chart");n(this,"option");n(this,"canvas");n(this,"timing");this.timing=new f(t.debug||!0),this.timing.start(),this.validateOptions(t),this.option=t,this.canvas=document.createElement("canvas"),this.setDimensions({width:t.width||800,height:t.height||600}),this.chart=v.init(this.canvas),this.update(t),this.timing.log("initialization")}update(t){this.timing.start(),(t.width||t.height)&&this.setDimensions({width:t.width||this.canvas.width,height:t.height||this.canvas.height});let e={...t};return delete e.width,delete e.height,Array.isArray(e.series)?e.series?.forEach(s=>{s.animation=!1}):e.series&&(e.series.animation=!1),this.option={...this.option,...e},this.chart.setOption(this.option),this.timing.log("update"),this}setDimensions({width:t,height:e}){return this.validateOptions({width:t,height:e}),this.canvas.width=t,this.canvas.height=e,this}generateImage({type:t,quality:e}){if(e&&(e<0||e>3))throw new h("Quality must be between 0 and 3");return this.timing.start(),new Promise((s,r)=>{this.canvas.toBlob(w=>{this.timing.log("image generation"),w?s(w):r(new h("Failed to generate image"))},D(t),e)})}generateSvg(t){return this.chart.getConnectedDataURL({type:"svg",backgroundColor:"transparent",pixelRatio:t})}getChart(){return this.chart}on(t,e){this.chart.on(t,e)}getCanvas(){return this.canvas}dispose(){this.chart.dispose()}validateOptions(t){if(t.width&&t.width<=0)throw new l("Width must be positive");if(t.height&&t.height<=0)throw new l("Height must be positive")}},a(g,"Chart"),g),L=a(i=>new m(i),"createChart"),b=a(async({option:i,type:t,quality:e})=>{let s=new m(i);try{return await s.generateImage({type:t,quality:e})}finally{s.dispose()}},"createChartImage"),U=a(async({option:i,type:t,quality:e})=>{let s=await b({option:i,type:t,quality:e});return URL.createObjectURL(s)},"createChartImgSrc"),k=a((i,t)=>{let e=new f(!0);e.start();let s=new m(i);try{let r=s.generateSvg(t);return e.log("SVG generation"),r}finally{s.dispose()}},"createChartSvg"),A=m;0&&(module.exports={ChartDimensionError,ChartError,createChart,createChartImage,createChartImgSrc,createChartSvg});
