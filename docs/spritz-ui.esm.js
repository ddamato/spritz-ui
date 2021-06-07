const t=Object.assign({'"':'"',"“":"”","«":"»"},{"(":")","[":"]","{":"}"});function e(t){return"\\u"+t.charCodeAt(0).toString(16).padStart(4,"0")}const s=function(){const s=Object.keys(t).map(e).join("");return new RegExp(`^[${s}]+`,"g")}(),n=function(){const s=Object.values(t).map(e).join("");return new RegExp(`[${s}]+$`,"g")}(),i=function(){const s=Object.keys(t).map(e).join(""),n=Object.values(t).map(e).join("");return new RegExp(`[${s+n}]+`,"g")}();class r{constructor(){this.start=[],this.end=[]}check(t){return o.call(this,function(t){return t.replace(/[.?!,;:]/g,"")}(t))}}function a(t,e){const[s]=t.match(e)||[""];return s.split("")}function o(e){const i=a(e,s),r=a(e,n),o=i.filter(e=>!r.includes(t[e])),d={start:this.start.slice(),end:this.end.slice()};return i.length&&!o.length?{start:i,end:r}:(r.length&&r.forEach(e=>{const s=this.end.indexOf(e);let n=this.start.length-1-s;if(!t[this.start[n]]===e){const s=Object.entries(t).reduce((t,[s,n])=>n===e?s:t,null);n=this.start.indexOf(s)}this.end.splice(s,1),this.start.splice(n,1)}),i.length&&(i.forEach(e=>{d.start.push(e),d.end.unshift(t[e])}),this.start=d.start.slice(),this.end=d.end.slice()),d)}const d=["ave.","blvd.","ct.","dr.","eg.","etc.","ie.","mr.","mrs.","mo.","rd.","sr.","st.","ste.","tpk."],c={clause:t=>/[,:;]$/.test(t)?1.5:1,number:t=>/\d+[^,:;.!?]{0,}$/.test(t)?1.5:1,sentence:t=>/[.?!]$/.test(t)&&!d.includes(t.toLowerCase())?3:1},h=/((?=\w{15,})(\w{7})|(?!^\w{1,14})$)/g,u=/[^\s-]+-?/g;function l(t){const e=Math.ceil((t.length-1)/4);return/\W/.test(t[e])?e-1:e}function p(t,e){return Math.max(Math.min(t,e.length-1),0)}function f({elem:t,key:e,value:s,check:n}){(n=n||Boolean)(s=function(t){return"boolean"==typeof t?"":Array.isArray(t)?t.join(""):t}(s))?t.setAttribute(e,s):t.removeAttribute(e)}const m={STATUS_STOPPED:"stopped",STATUS_PAUSED:"paused",STATUS_PLAYING:"playing"};class _ extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML='<style>:host{display:inline-block;font-size:2em;--verticalPadding:1ch}:host([start]):before{padding:var(--verticalPadding) 0;content:attr(start)}:host([end]):after{content:attr(end)}#redicle,:host([end]):after{padding:var(--verticalPadding) 0}#redicle{--orpPercent:calc(var(--orpOffset, 38)/100*100%);position:relative;border-top:4px solid;border-bottom:4px solid;width:10em;background-repeat:no-repeat;background-position:var(--orpPercent) 0;background-size:100%;display:inline-flex;align-items:center;line-height:1}:host([status=playing]) #redicle{background-image:linear-gradient(90deg,hsla(0,0%,50.2%,.3) 100%,transparent 0);animation:fade calc(var(--msDuration, 240)*6ms) linear forwards}@keyframes fade{to{background-size:0}}#redicle:after,#redicle:before{content:"";border:2px solid;position:absolute;height:calc(var(--verticalPadding)/2);left:var(--orpPercent)}#redicle:before{top:0}#redicle:after{bottom:0}#word{transform:translatex(var(--wordOffset));min-height:2.2ex;flex:1}#word b{font-weight:inherit;color:var(--spritz-orp-accent,red)}</style><div id="redicle">\n  <span id="word"></span>\n</div>',this._$redicle=this.shadowRoot.getElementById("redicle"),this._$word=this.shadowRoot.getElementById("word")}static get observedAttributes(){return["content","index","status","wpm"]}connectedCallback(){this._$redicle.addEventListener("animationend",()=>this._play())}attributeChangedCallback(t,e,s){e!==s&&("index"===t&&this._render(),"wpm"===t&&this._$redicle.style.setProperty("--msDuration",this.duration),"status"===t&&this._handleStatusChange(s),"content"===t&&this._processById(s))}get duration(){return 6e4/this.wpm}get estimatedMinutes(){return this._words.length/this.wpm}get content(){return this.getAttribute("content")}set content(t){f({elem:this,key:"content",value:t})}get index(){return parseInt(this.getAttribute("index"))}set index(t){let e=-1;isNaN(t)||(e=parseInt(t),p(e,this._words)!==e&&-1!==e||this.setAttribute("index",e))}get status(){return this.getAttribute("status")}set status(t){const e=Object.values(m).includes(t)?t:m.STATUS_STOPPED;this.setAttribute("status",e)}get wpm(){return Number(this.getAttribute("wpm"))}set wpm(t){f({elem:this,key:"wpm",value:t,check:t=>!isNaN(t)&&parseInt(t,10)>0})}fastbackward(){return this.pause(),this.index=this._jumpBackward(),this._emitEvent("fastbackward"),this}fastforward(){return this.pause(),this.index=this._jumpForward(),this._emitEvent("fastforward"),this}pause(){return this.status="paused",this}play(){return this.status="playing",this}process(t){return this._init(),this._words=function(t,e){if(!t)return;const s=new r;return t.replace(h,"$1- ").match(u).filter(t=>/[\w]/.test(t)).map((t,n,r)=>(/[.?!]/.test(t)&&r[n+1]&&e.push(n+1),{content:t.replace(i,""),orp:l(t),...s.check(t)}))}(t,this._sentenceIndices),this._words.length&&this._emitEvent("ready"),this}stepbackward(){return this.pause(),this.index--,this._emitEvent("stepbackward"),this}stepforward(){return this.pause(),this.index++,this._emitEvent("stepforward"),this}stop(){return this.status="stopped",this}_emitEvent(t){this.dispatchEvent(new CustomEvent(t))}_getSentenceIndex(){const t=this._sentenceIndices.find(t=>t>=this.index),e=this._sentenceIndices.indexOf(t);return t!==this.index?p(e-1,this._sentenceIndices):e}_handleStatusChange(t){t===m.STATUS_PAUSED&&this._pause&&this._pause(),t===m.STATUS_STOPPED&&(this._pause&&this._pause(),this.index=-1),this._emitEvent(t)}_init(){this._orpOffset=38,this._sentenceIndices=[0],this._words=[],this.index=-1,this.wpm=250}_jumpBackward(){const t=p(this._getSentenceIndex()-1,this._sentenceIndices);return this._sentenceIndices[t]}_jumpForward(){const t=p(this._getSentenceIndex()+1,this._sentenceIndices);return this._sentenceIndices[t]}_play(){if(!this._words.length||!this._words[this.index+1])return this.stop();this.index+=1;const t=function(t,e){if(!e)return t;const{content:s}=e;return t*=c.clause(s),t*=c.number(s),t*=c.sentence(s)}(this.duration,this._words[this.index]);this._pause=function(t,e){let s;const n=()=>window.cancelAnimationFrame(s),i=(new Date).getTime(),r=()=>(new Date).getTime()-i>=e?(t(),void n()):(s=window.requestAnimationFrame(r),n);return r()}(()=>this._play(),t)}_processById(t){if("complete"!==document.readyState)return document.addEventListener("readystatechange",()=>this._processById(t),{once:!0});const e=document.getElementById(t);e&&this.process(e.textContent)}_render(){if(!~this.index)return this._reset();const t=this._words[this.index];this._$word.innerHTML=function({content:t,orp:e}){return t.replace(/./g,(t,s)=>s===e?`<b>${t}</b>`:t)}(t);const e=function(t,e){return 100*(t.offsetLeft+Math.ceil(t.offsetWidth/2)-2)/e.offsetWidth}(this._$word.querySelector("b"),this._$redicle);this._$word.style.setProperty("--wordOffset",this._orpOffset-e+"%"),f({elem:this,key:"start",value:t.start}),f({elem:this,key:"end",value:t.end})}_reset(){this._$word.innerHTML="",this._$word.removeAttribute("style"),f({elem:this,key:"start",value:!1}),f({elem:this,key:"end",value:!1})}get _orpOffset(){return this._$redicle.style.getPropertyValue("--orpOffset")}set _orpOffset(t){this._$redicle.style.setProperty("--orpOffset",t)}}window.customElements.define("spritz-ui",_);export default _;