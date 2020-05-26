!function(e,t){for(var r in t)e[r]=t[r]}(exports,function(e){var t={};function r(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(o,n,function(t){return e[t]}.bind(null,n));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=11)}([function(e,t){e.exports=require("stream")},function(e,t){e.exports=require("zlib")},function(e,t){e.exports=require("http")},function(e,t){e.exports=require("https")},function(e,t,r){"use strict";const o=(this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}})(r(10));e.exports=function(e){if(!/^data:/i.test(e))throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');const t=(e=e.replace(/\r?\n/g,"")).indexOf(",");if(-1===t||t<=4)throw new TypeError("malformed data: URI");const r=e.substring(5,t).split(";");let n="",s=!1;const i=r[0]||"text/plain";let a=i;for(let e=1;e<r.length;e++)"base64"===r[e]?s=!0:(a+=";"+r[e],0===r[e].indexOf("charset=")&&(n=r[e].substring(8)));r[0]||n.length||(a+=";charset=US-ASCII",n="US-ASCII");const u=s?"base64":"ascii",l=unescape(e.substring(t+1)),c=o.default(l,u);return c.type=i,c.typeFull=a,c.charset=n,c}},function(e,t,r){const{Readable:o}=r(0),n=Symbol("buffer"),s=Symbol("type");class i{constructor(...e){this[s]="";const t=e[0],r=e[1],o=[];let a=0;t&&t.forEach(e=>{let t;t=e instanceof Buffer?e:ArrayBuffer.isView(e)?Buffer.from(e.buffer,e.byteOffset,e.byteLength):e instanceof ArrayBuffer?Buffer.from(e):e instanceof i?e[n]:Buffer.from("string"==typeof e?e:String(e)),a+=t.length,o.push(t)}),this[n]=Buffer.concat(o);const u=r&&void 0!==r.type&&String(r.type).toLowerCase();u&&!/[^\u0020-\u007E]/.test(u)&&(this[s]=u),r&&Buffer.isBuffer(r.buffer)&&(this[n]=r.buffer)}get size(){return this[n].length}get type(){return this[s]}text(){return Promise.resolve(this[n].toString())}arrayBuffer(){const e=this[n],t=e.buffer.slice(e.byteOffset,e.byteOffset+e.byteLength);return Promise.resolve(t)}stream(){const e=new o;return e._read=()=>{},e.push(this[n]),e.push(null),e}toString(){return"[object Blob]"}slice(...e){const{size:t}=this,r=e[0],o=e[1];let s,a;s=void 0===r?0:r<0?Math.max(t+r,0):Math.min(r,t),a=void 0===o?t:o<0?Math.max(t+o,0):Math.min(o,t);const u=Math.max(a-s,0),l=this[n].slice(s,s+u),c=new i([],{type:e[2]});return c[n]=l,c}}Object.defineProperties(i.prototype,{size:{enumerable:!0},type:{enumerable:!0},slice:{enumerable:!0}}),Object.defineProperty(i.prototype,Symbol.toStringTag,{value:"Blob",writable:!1,enumerable:!1,configurable:!0}),e.exports=i},function(e,t){e.exports=require("url")},function(e,t,r){const o=r(8),n=r(9);function s(e){console.log("[dotenv][DEBUG] "+e)}const i=/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/,a=/\\n/g,u=/\n|\r|\r\n/;function l(e,t){const r=Boolean(t&&t.debug),o={};return e.toString().split(u).forEach((function(e,t){const n=e.match(i);if(null!=n){const e=n[1];let t=n[2]||"";const r=t.length-1,s='"'===t[0]&&'"'===t[r];"'"===t[0]&&"'"===t[r]||s?(t=t.substring(1,r),s&&(t=t.replace(a,"\n"))):t=t.trim(),o[e]=t}else r&&s(`did not match key and value when parsing line ${t+1}: ${e}`)})),o}e.exports.config=function(e){let t=n.resolve(process.cwd(),".env"),r="utf8",i=!1;e&&(null!=e.path&&(t=e.path),null!=e.encoding&&(r=e.encoding),null!=e.debug&&(i=!0));try{const e=l(o.readFileSync(t,{encoding:r}),{debug:i});return Object.keys(e).forEach((function(t){Object.prototype.hasOwnProperty.call(process.env,t)?i&&s(`"${t}" is already defined in \`process.env\` and will not be overwritten`):process.env[t]=e[t]})),{parsed:e}}catch(e){return{error:e}}},e.exports.parse=l},function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("path")},function(e,t){var r=Object.prototype.toString,o="function"==typeof Buffer.alloc&&"function"==typeof Buffer.allocUnsafe&&"function"==typeof Buffer.from;e.exports=function(e,t,n){if("number"==typeof e)throw new TypeError('"value" argument must not be a number');return s=e,"ArrayBuffer"===r.call(s).slice(8,-1)?function(e,t,r){t>>>=0;var n=e.byteLength-t;if(n<0)throw new RangeError("'offset' is out of bounds");if(void 0===r)r=n;else if((r>>>=0)>n)throw new RangeError("'length' is out of bounds");return o?Buffer.from(e.slice(t,t+r)):new Buffer(new Uint8Array(e.slice(t,t+r)))}(e,t,n):"string"==typeof e?function(e,t){if("string"==typeof t&&""!==t||(t="utf8"),!Buffer.isEncoding(t))throw new TypeError('"encoding" must be a valid string encoding');return o?Buffer.from(e,t):new Buffer(e,t)}(e,t):o?Buffer.from(e):new Buffer(e);var s}},function(e,t,r){"use strict";r.r(t);var o=r(2),n=r.n(o),s=r(3),i=r.n(s),a=r(1),u=r.n(a),l=r(0),c=r.n(l),f=r(4),h=r.n(f),p=r(5),d=r.n(p);class b extends Error{constructor(e,t,r){super(e),this.message=e,this.type=t,this.name="FetchError",this[Symbol.toStringTag]="FetchError",r&&(this.code=this.errno=r.code,this.erroredSysCall=r),Error.captureStackTrace(this,this.constructor)}}const y=Symbol.toStringTag;function m(e){return"object"==typeof e&&"function"==typeof e.append&&"function"==typeof e.delete&&"function"==typeof e.get&&"function"==typeof e.getAll&&"function"==typeof e.has&&"function"==typeof e.set&&"function"==typeof e.sort&&"URLSearchParams"===e[y]}function g(e){return"object"==typeof e&&"function"==typeof e.arrayBuffer&&"string"==typeof e.type&&"function"==typeof e.stream&&"function"==typeof e.constructor&&/^(Blob|File)$/.test(e[y])}function w(e){return"ArrayBuffer"===e[y]}function v(e){return"AbortError"===e[y]}const O=Symbol("Body internals");function S(e,{size:t=0,timeout:r=0}={}){null===e?e=null:m(e)?e=Buffer.from(e.toString()):g(e)||Buffer.isBuffer(e)||(w(e)?e=Buffer.from(e):ArrayBuffer.isView(e)?e=Buffer.from(e.buffer,e.byteOffset,e.byteLength):e instanceof c.a||(e=Buffer.from(String(e)))),this[O]={body:e,disturbed:!1,error:null},this.size=t,this.timeout=r,e instanceof c.a&&e.on("error",e=>{const t=v(e)?e:new b(`Invalid response body while trying to fetch ${this.url}: ${e.message}`,"system",e);this[O].error=t})}function j(){if(this[O].disturbed)return S.Promise.reject(new TypeError("body used already for: "+this.url));if(this[O].disturbed=!0,this[O].error)return S.Promise.reject(this[O].error);let{body:e}=this;if(null===e)return S.Promise.resolve(Buffer.alloc(0));if(g(e)&&(e=e.stream()),Buffer.isBuffer(e))return S.Promise.resolve(e);if(!(e instanceof c.a))return S.Promise.resolve(Buffer.alloc(0));const t=[];let r=0,o=!1;return new S.Promise((n,s)=>{let i;this.timeout&&(i=setTimeout(()=>{o=!0,s(new b(`Response timeout while trying to fetch ${this.url} (over ${this.timeout}ms)`,"body-timeout"))},this.timeout)),e.on("error",e=>{v(e)?(o=!0,s(e)):s(new b(`Invalid response body while trying to fetch ${this.url}: ${e.message}`,"system",e))}),e.on("data",e=>{if(!o&&null!==e){if(this.size&&r+e.length>this.size)return o=!0,void s(new b(`content size at ${this.url} over limit: ${this.size}`,"max-size"));r+=e.length,t.push(e)}}),e.on("end",()=>{if(!o){clearTimeout(i);try{n(Buffer.concat(t,r))}catch(e){s(new b(`Could not create Buffer from response body for ${this.url}: ${e.message}`,"system",e))}}})})}function T(e,t){let r,o,{body:n}=e;if(e.bodyUsed)throw new Error("cannot clone body after it is used");return n instanceof c.a&&"function"!=typeof n.getBoundary&&(r=new l.PassThrough({highWaterMark:t}),o=new l.PassThrough({highWaterMark:t}),n.pipe(r),n.pipe(o),e[O].body=r,n=o),n}function E(e){return null===e?null:"string"==typeof e?"text/plain;charset=UTF-8":m(e)?"application/x-www-form-urlencoded;charset=UTF-8":g(e)?e.type||null:Buffer.isBuffer(e)||w(e)||ArrayBuffer.isView(e)?null:e&&"function"==typeof e.getBoundary?"multipart/form-data;boundary="+e.getBoundary():e instanceof c.a?null:"text/plain;charset=UTF-8"}function P({body:e}){return null===e?0:g(e)?e.size:Buffer.isBuffer(e)?e.length:e&&"function"==typeof e.getLengthSync&&e.hasKnownLength&&e.hasKnownLength()?e.getLengthSync():null}S.prototype={get body(){return this[O].body},get bodyUsed(){return this[O].disturbed},arrayBuffer(){return j.call(this).then(({buffer:e,byteOffset:t,byteLength:r})=>e.slice(t,t+r))},blob(){const e=this.headers&&this.headers.get("content-type")||this[O].body&&this[O].body.type||"";return j.call(this).then(t=>new d.a([],{type:e.toLowerCase(),buffer:t}))},json(){return j.call(this).then(e=>JSON.parse(e.toString()))},text(){return j.call(this).then(e=>e.toString())},buffer(){return j.call(this)}},Object.defineProperties(S.prototype,{body:{enumerable:!0},bodyUsed:{enumerable:!0},arrayBuffer:{enumerable:!0},blob:{enumerable:!0},json:{enumerable:!0},text:{enumerable:!0}}),S.mixIn=e=>{for(const t of Object.getOwnPropertyNames(S.prototype))if(!Object.prototype.hasOwnProperty.call(e,t)){const r=Object.getOwnPropertyDescriptor(S.prototype,t);Object.defineProperty(e,t,r)}},S.Promise=global.Promise;const x=/[^`\-\w!#$%&'*+.|~]/,B=/[^\t\u0020-\u007E\u0080-\u00FF]/;function k(e){if(e=""+e,x.test(e)||""===e)throw new TypeError(e+" is not a legal HTTP header name")}function C(e){if(e=""+e,B.test(e))throw new TypeError(e+" is not a legal HTTP header value")}function L(e,t){t=t.toLowerCase();for(const r in e)if(r.toLowerCase()===t)return r}const z=Symbol("map");class R{constructor(e){if(this[z]=Object.create(null),e instanceof R){const t=e.raw(),r=Object.keys(t);for(const e of r)for(const r of t[e])this.append(e,r)}else if(null==e);else{if("object"!=typeof e)throw new TypeError("Provided initializer must be an object");{const t=e[Symbol.iterator];if(null!=t){if("function"!=typeof t)throw new TypeError("Header pairs must be iterable");const r=[];for(const t of e){if("object"!=typeof t||"function"!=typeof t[Symbol.iterator])throw new TypeError("Each header pair must be iterable");r.push([...t])}for(const e of r){if(2!==e.length)throw new TypeError("Each header pair must be a name/value tuple");this.append(e[0],e[1])}}else for(const t of Object.keys(e)){const r=e[t];this.append(t,r)}}}}get(e){k(e=""+e);const t=L(this[z],e);if(void 0===t)return null;let r=this[z][t].join(", ");return"content-encoding"===e.toLowerCase()&&(r=r.toLowerCase()),r}forEach(e,t){let r=A(this),o=0;for(;o<r.length;){const[n,s]=r[o];e.call(t,s,n,this),r=A(this),o++}}set(e,t){t=""+t,k(e=""+e),C(t);const r=L(this[z],e);this[z][void 0!==r?r:e]=[t]}append(e,t){t=""+t,k(e=""+e),C(t);const r=L(this[z],e);void 0!==r?this[z][r].push(t):this[z][e]=[t]}has(e){return k(e=""+e),void 0!==L(this[z],e)}delete(e){k(e=""+e);const t=L(this[z],e);void 0!==t&&delete this[z][t]}raw(){return this[z]}keys(){return $(this,"key")}values(){return $(this,"value")}[Symbol.iterator](){return $(this,"key+value")}}function A(e,t="key+value"){return Object.keys(e[z]).sort().map("key"===t?e=>e.toLowerCase():"value"===t?t=>e[z][t].join(", "):t=>[t.toLowerCase(),e[z][t].join(", ")])}R.prototype.entries=R.prototype[Symbol.iterator],Object.defineProperty(R.prototype,Symbol.toStringTag,{value:"Headers",writable:!1,enumerable:!1,configurable:!0}),Object.defineProperties(R.prototype,{get:{enumerable:!0},forEach:{enumerable:!0},set:{enumerable:!0},append:{enumerable:!0},has:{enumerable:!0},delete:{enumerable:!0},keys:{enumerable:!0},values:{enumerable:!0},entries:{enumerable:!0}});const U=Symbol("internal");function $(e,t){const r=Object.create(M);return r[U]={target:e,kind:t,index:0},r}const M=Object.setPrototypeOf({next(){if(!this||Object.getPrototypeOf(this)!==M)throw new TypeError("Value of `this` is not a HeadersIterator");const{target:e,kind:t,index:r}=this[U],o=A(e,t);return r>=o.length?{value:void 0,done:!0}:(this[U].index=r+1,{value:o[r],done:!1})}},Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));function _(e){const t={__proto__:null,...e[z]},r=L(e[z],"Host");return void 0!==r&&(t[r]=t[r][0]),t}Object.defineProperty(M,Symbol.toStringTag,{value:"HeadersIterator",writable:!1,enumerable:!1,configurable:!0});const q=Symbol("Response internals");class I{constructor(e=null,t={}){S.call(this,e,t);const r=t.status||200,o=new R(t.headers);if(null!==e&&!o.has("Content-Type")){const t=E(e);t&&o.append("Content-Type",t)}this[q]={url:t.url,status:r,statusText:t.statusText||"",headers:o,counter:t.counter,highWaterMark:t.highWaterMark}}get url(){return this[q].url||""}get status(){return this[q].status}get ok(){return this[q].status>=200&&this[q].status<300}get redirected(){return this[q].counter>0}get statusText(){return this[q].statusText}get headers(){return this[q].headers}get highWaterMark(){return this[q].highWaterMark}clone(){return new I(T(this,this.highWaterMark),{url:this.url,status:this.status,statusText:this.statusText,headers:this.headers,ok:this.ok,redirected:this.redirected,size:this.size,timeout:this.timeout})}static redirect(e,t=302){if(![301,302,303,307,308].includes(t))throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');return new I(null,{headers:{location:new URL(e).toString()},status:t})}}S.mixIn(I.prototype),Object.defineProperties(I.prototype,{url:{enumerable:!0},status:{enumerable:!0},ok:{enumerable:!0},redirected:{enumerable:!0},statusText:{enumerable:!0},headers:{enumerable:!0},clone:{enumerable:!0}}),Object.defineProperty(I.prototype,Symbol.toStringTag,{value:"Response",writable:!1,enumerable:!1,configurable:!0});var F=r(6);const H=Symbol("Request internals"),D="destroy"in c.a.Readable.prototype;function W(e){return"object"==typeof e&&"object"==typeof e[H]}function N(e){if(/^[a-zA-Z][a-zA-Z\d+\-.]*:/.exec(e))return new URL(e);throw new TypeError("Only absolute URLs are supported")}class G{constructor(e,t={}){let r;W(e)?r=N(e.url):(r=e&&e.href?N(e.href):N(""+e),e={});let o=t.method||e.method||"GET";if(o=o.toUpperCase(),(null!=t.body||W(e)&&null!==e.body)&&("GET"===o||"HEAD"===o))throw new TypeError("Request with GET/HEAD method cannot have body");const n=null!=t.body?t.body:W(e)&&null!==e.body?T(e):null;S.call(this,n,{timeout:t.timeout||e.timeout||0,size:t.size||e.size||0});const s=new R(t.headers||e.headers||{});if(null!==n&&!s.has("Content-Type")){const e=E(n);e&&s.append("Content-Type",e)}let i=W(e)?e.signal:null;if("signal"in t&&(i=t.signal),null!==i&&("object"!=typeof(a=i)||"AbortSignal"!==a[y]))throw new TypeError("Expected signal to be an instanceof AbortSignal");var a;this[H]={method:o,redirect:t.redirect||e.redirect||"follow",headers:s,parsedURL:r,signal:i},this.follow=void 0!==t.follow?t.follow:void 0!==e.follow?e.follow:20,this.compress=void 0!==t.compress?t.compress:void 0===e.compress||e.compress,this.counter=t.counter||e.counter||0,this.agent=t.agent||e.agent,this.highWaterMark=t.highWaterMark||e.highWaterMark}get method(){return this[H].method}get url(){return Object(F.format)(this[H].parsedURL)}get headers(){return this[H].headers}get redirect(){return this[H].redirect}get signal(){return this[H].signal}clone(){return new G(this)}}S.mixIn(G.prototype),Object.defineProperty(G.prototype,Symbol.toStringTag,{value:"Request",writable:!1,enumerable:!1,configurable:!0}),Object.defineProperties(G.prototype,{method:{enumerable:!0},url:{enumerable:!0},headers:{enumerable:!0},redirect:{enumerable:!0},clone:{enumerable:!0},signal:{enumerable:!0}});class J extends Error{constructor(e){super(e),this.type="aborted",this.message=e,this.name="AbortError",this[Symbol.toStringTag]="AbortError",Error.captureStackTrace(this,this.constructor)}}function V(e,t){if(!V.Promise)throw new Error("native promise missing, set fetch.Promise to your favorite alternative");if(/^\s*data:([a-z]+\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[\w!$&',()*+;=\-.~:@/?%\s]*\s*$/i.test(e)){const t=h()(e),r=new I(t,{headers:{"Content-Type":t.type}});return V.Promise.resolve(r)}if(e.toString().startsWith("data:")){const r=new G(e,t);return V.Promise.reject(new b(`[${r.method}] ${r.url} invalid URL`,"system"))}return S.Promise=V.Promise,new V.Promise((r,o)=>{const s=new G(e,t),a=function(e){const{parsedURL:t}=e[H],r=new R(e[H].headers);if(r.has("Accept")||r.set("Accept","*/*"),!t.protocol||!t.hostname)throw new TypeError("Only absolute URLs are supported");if(!/^https?:$/.test(t.protocol))throw new TypeError("Only HTTP(S) protocols are supported");if(e.signal&&e.body instanceof c.a.Readable&&!D)throw new Error("Cancellation of streamed requests with AbortSignal is not supported");let o=null;if(null===e.body&&/^(post|put)$/i.test(e.method)&&(o="0"),null!==e.body){const t=P(e);"number"==typeof t&&(o=String(t))}o&&r.set("Content-Length",o),r.has("User-Agent")||r.set("User-Agent","node-fetch/1.0 (+https://github.com/bitinn/node-fetch)"),e.compress&&!r.has("Accept-Encoding")&&r.set("Accept-Encoding","gzip,deflate");let{agent:n}=e;"function"==typeof n&&(n=n(t)),r.has("Connection")||n||r.set("Connection","close");const s=function(e){if(e.search)return e.search;const t=e.href.length-1,r=e.hash||("#"===e.href[t]?"#":"");return"?"===e.href[t-r.length]?"?":""}(t);return{path:t.pathname+s,pathname:t.pathname,hostname:t.hostname,protocol:t.protocol,port:t.port,hash:t.hash,search:t.search,query:t.query,href:t.href,method:e.method,headers:_(r),agent:n}}(s),f=("https:"===a.protocol?i.a:n.a).request,{signal:h}=s;let p=null;const d=()=>{const e=new J("The operation was aborted.");o(e),s.body&&s.body instanceof c.a.Readable&&s.body.destroy(e),p&&p.body&&p.body.emit("error",e)};if(h&&h.aborted)return void d();const y=()=>{d(),w()},m=f(a);function w(){m.abort(),h&&h.removeEventListener("abort",y)}h&&h.addEventListener("abort",y),s.timeout&&m.setTimeout(s.timeout,()=>{w(),o(new b("network timeout at: "+s.url,"request-timeout"))}),m.on("error",e=>{o(new b(`request to ${s.url} failed, reason: ${e.message}`,"system",e)),w()}),m.on("response",e=>{const t=function(e){const t=new R;for(const r of Object.keys(e))if(!x.test(r))if(Array.isArray(e[r]))for(const o of e[r])B.test(o)||(void 0===t[z][r]?t[z][r]=[o]:t[z][r].push(o));else B.test(e[r])||(t[z][r]=[e[r]]);return t}(e.headers);if(V.isRedirect(e.statusCode)){const n=t.get("Location"),i=null===n?null:new URL(n,s.url);switch(s.redirect){case"error":return o(new b("uri requested responds with a redirect, redirect mode is set to error: "+s.url,"no-redirect")),void w();case"manual":if(null!==i)try{t.set("Location",i)}catch(e){o(e)}break;case"follow":{if(null===i)break;if(s.counter>=s.follow)return o(new b("maximum redirect reached at: "+s.url,"max-redirect")),void w();const t={headers:new R(s.headers),follow:s.follow,counter:s.counter+1,agent:s.agent,compress:s.compress,method:s.method,body:s.body,signal:s.signal,timeout:s.timeout};return 303!==e.statusCode&&s.body&&null===P(s)?(o(new b("Cannot follow redirect with body being a readable stream","unsupported-redirect")),void w()):(303!==e.statusCode&&(301!==e.statusCode&&302!==e.statusCode||"POST"!==s.method)||(t.method="GET",t.body=void 0,t.headers.delete("content-length")),r(V(new G(i,t))),void w())}}}e.once("end",()=>{h&&h.removeEventListener("abort",y)});let n=Object(l.pipeline)(e,new l.PassThrough,e=>{o(e)});const i={url:s.url,status:e.statusCode,statusText:e.statusMessage,headers:t,size:s.size,timeout:s.timeout,counter:s.counter,highWaterMark:s.highWaterMark},a=t.get("Content-Encoding");if(!s.compress||"HEAD"===s.method||null===a||204===e.statusCode||304===e.statusCode)return p=new I(n,i),void r(p);const c={flush:u.a.Z_SYNC_FLUSH,finishFlush:u.a.Z_SYNC_FLUSH};if("gzip"===a||"x-gzip"===a)return n=Object(l.pipeline)(n,u.a.createGunzip(c),e=>{o(e)}),p=new I(n,i),void r(p);if("deflate"!==a&&"x-deflate"!==a){if("br"===a&&"function"==typeof u.a.createBrotliDecompress)return n=Object(l.pipeline)(n,u.a.createBrotliDecompress(),e=>{o(e)}),p=new I(n,i),void r(p);p=new I(n,i),r(p)}else{Object(l.pipeline)(e,new l.PassThrough,e=>{o(e)}).once("data",e=>{n=8==(15&e[0])?Object(l.pipeline)(n,u.a.createInflate(),e=>{o(e)}):Object(l.pipeline)(n,u.a.createInflateRaw(),e=>{o(e)}),p=new I(n,i),r(p)})}}),function(e,{body:t}){null===t?e.end():g(t)?t.stream().pipe(e):Buffer.isBuffer(t)?(e.write(t),e.end()):t.pipe(e)}(m,s)})}function Z(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function K(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Z(Object(r),!0).forEach((function(t){Y(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Z(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function Y(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}V.isRedirect=e=>[301,302,303,307,308].includes(e),V.Promise=global.Promise,V.Headers=R,V.Request=G,V.Response=I,V.FetchError=b,r(7).config();const Q=process.env.REQUEST_TOKEN;exports.handler=async function(e){const t=await e.body,r=JSON.parse(t);let o;try{const e=await(n=9e4,s=V("https://gpt-tfsma6beea-ez.a.run.app/",{method:"POST",body:JSON.stringify(K({token:Q},r))}),new Promise((e,t)=>{const r=setTimeout(()=>{t(new Error("request timeout :—)"))},n);s.then(t=>{clearTimeout(r),e(t)},e=>{clearTimeout(r),t(e)})})),t=await e.json(),i=await t.text;o=JSON.stringify(i)}catch(e){o="I'm literally actually having an error right now: "+e}var n,s;return{statusCode:200,body:o}}}]));