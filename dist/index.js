var d=Object.defineProperty;var f=(s,e,t)=>e in s?d(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var i=(s,e)=>d(s,"name",{value:e,configurable:!0});var c=(s,e,t)=>(f(s,typeof e!="symbol"?e+"":e,t),t);import*as l from"echarts";var m=class m extends Error{constructor(e){super(e),this.name="ChartError"}};i(m,"ChartError");var r=m,g=class g extends r{constructor(e){super(e),this.name="ChartDimensionError"}};i(g,"ChartDimensionError");var o=g;function v(s){switch(s){case"png":return"image/png";case"jpeg":return"image/jpeg";case"svg":return"image/svg+xml";case"webp":return"image/webp";default:throw new r("Invalid image type")}}i(v,"chartImageTypeToMime");var n,p=(n=class{constructor(e){c(this,"chart");c(this,"option");c(this,"canvas");let t=performance.now();this.validateOptions(e),this.option=e,this.canvas=document.createElement("canvas"),this.setDimensions({width:e.width||800,height:e.height||600}),this.chart=l.init(this.canvas),this.update(e),this.logPerformance("initialization",t)}update(e){let t=performance.now();(e.width||e.height)&&this.setDimensions({width:e.width||this.canvas.width,height:e.height||this.canvas.height});let a={...e};return delete a.width,delete a.height,Array.isArray(a.series)?a.series?.forEach(h=>{h.animation=!1}):a.series&&(a.series.animation=!1),this.option={...this.option,...a},this.chart.setOption(this.option),this.logPerformance("update",t),this}setDimensions({width:e,height:t}){return this.validateOptions({width:e,height:t}),this.canvas.width=e,this.canvas.height=t,this}generateImage({type:e,quality:t}){if(t&&(t<0||t>3))throw new r("Quality must be between 0 and 3");let a=performance.now();return new Promise((h,u)=>{this.canvas.toBlob(w=>{this.logPerformance("image generation",a),w?h(w):u(new r("Failed to generate image"))},v(e),t)})}getChart(){return this.chart}getCanvas(){return this.canvas}dispose(){this.chart.dispose()}validateOptions(e){if(e.width&&e.width<=0)throw new o("Width must be positive");if(e.height&&e.height<=0)throw new o("Height must be positive")}logPerformance(e,t){console.debug(`%c\u{1F680} Chart ${e} completed in ${performance.now()-t}ms`,"color: coral; font-weight: bold")}},i(n,"Chart"),n),y=i(s=>new p(s),"createChart"),b=i(async({option:s,type:e,quality:t})=>{let a=new p(s);try{return await a.generateImage({type:e,quality:t})}finally{a.dispose()}},"createChartImage"),I=i(async({option:s,type:e,quality:t})=>{let a=await b({option:s,type:e,quality:t});return URL.createObjectURL(a)},"createChartImgSrc");export{o as ChartDimensionError,r as ChartError,y as createChart,b as createChartImage,I as createChartImgSrc};
