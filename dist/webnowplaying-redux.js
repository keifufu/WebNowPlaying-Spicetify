var webnowplayingDredux=(()=>{var e,M=Object.create,s=Object.defineProperty,U=Object.defineProperties,W=Object.getOwnPropertyDescriptor,j=Object.getOwnPropertyDescriptors,l=Object.getOwnPropertyNames,n=Object.getOwnPropertySymbols,G=Object.getPrototypeOf,d=Object.prototype.hasOwnProperty,B=Object.prototype.propertyIsEnumerable,o=(e,t,a)=>t in e?s(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a,r=(e,t)=>{for(var a in t=t||{})d.call(t,a)&&o(e,a,t[a]);if(n)for(var a of n(t))B.call(t,a)&&o(e,a,t[a]);return e},i=(e,t)=>U(e,j(t)),t=(e,t)=>function(){return t||(0,e[l(e)[0]])((t={exports:{}}).exports,t),t.exports},a=(e,t,a)=>{a=null!=e?M(G(e)):{};var n=!t&&e&&e.__esModule?a:s(a,"default",{value:e,enumerable:!0}),o=e,r=void 0,i=void 0;if(o&&"object"==typeof o||"function"==typeof o)for(let e of l(o))d.call(n,e)||e===r||s(n,e,{get:()=>o[e],enumerable:!(i=W(o,e))||i.enumerable});return n},c=t({"external-global-plugin:react"(e,t){t.exports=Spicetify.React}}),t=t({"external-global-plugin:react-dom"(e,t){t.exports=Spicetify.ReactDOM}}),H=(t=24)=>{var a="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";let n="";for(let e=0;e<t;e++)n+=a[Math.floor(Math.random()*a.length)];return n},u=(e,t)=>e.toString().padStart(t,"0"),p=e=>{try{var t;return isNaN(e)?"0:00":(t=Math.floor(e/60))<60?t+":"+u(Math.floor(e%60),2):Math.floor(t/60)+":"+u(Math.floor(t%60),2)+":"+u(Math.floor(e%60),2)}catch(e){return"0:00"}},m=(e,t)=>{var[t,a,n]=t.split(".").map(e=>parseInt(e)),[e,o,r]=e.split(".").map(e=>parseInt(e));return e<t||e===t&&o<a||e===t&&o===a&&r<n},V=e=>{Spicetify.showNotification("Copied: "+e),Spicetify.Platform.ClipboardAPI.copy(e)},f=JSON.parse(null!=(e=localStorage.getItem("wnp-redux-gh-cache"))?e:"{}"),z={customAdapters:[],enabledBuiltInAdapters:["Rainmeter Adapter"]},_=()=>{var e=localStorage.getItem("webnowplaying-redux-settings");return e?JSON.parse(e):z},g=[{name:"Rainmeter Adapter",port:8974,gh:"keifufu/WebNowPlaying-Redux-Rainmeter",authors:[{name:"keifufu",link:"https://github.com/keifufu"},{name:"tjhrulz",link:"https://github.com/tjhrulz"}]},{name:"Macro Deck Adapter",port:8698,gh:"jbcarreon123/WebNowPlaying-Redux-Macro-Deck",authors:[{name:"jbcarreon123",link:"https://github.com/jbcarreon123"}]},{name:"OBS Adapter",port:6534,gh:"keifufu/WebNowPlaying-Redux-OBS",authors:[{name:"keifufu",link:"https://github.com/keifufu"}]}],h={version:"0.0.0",isConnected:!1,isConnecting:!1,reconnectAttempts:0,_isPlaceholder:!0},b=class{constructor(e,t){this.ws=null,this.cache=new Map,this.reconnectAttempts=0,this.version="0.0.0",this.communicationRevision=null,this.connectionTimeout=null,this.versionConnectionTimeout=null,this.reconnectTimeout=null,this.isClosed=!1,this.adapter=e,this.executeEvent=t,this.init()}init(){this.isClosed||(this.ws=new WebSocket("ws://localhost:"+this.adapter.port),this.ws.onopen=this.onOpen.bind(this),this.ws.onclose=this.onClose.bind(this),this.ws.onerror=this.onError.bind(this),this.ws.onmessage=this.onMessage.bind(this),this.connectionTimeout&&clearTimeout(this.connectionTimeout),this.connectionTimeout=setTimeout(()=>{this.ws&&(this.ws.onclose=null,this.ws.onerror=null,this.ws.close()),this.retry()},5e3))}get isConnected(){var e;return(null==(e=this.ws)?void 0:e.readyState)===WebSocket.OPEN}get isConnecting(){var e;return!this.isClosed&&(null==(e=this.ws)?void 0:e.readyState)!==WebSocket.OPEN}close(){this.isClosed=!0,this.cleanup()}cleanup(){this.cache=new Map,this.communicationRevision=null,this.version="0.0.0",this.reconnectTimeout&&clearTimeout(this.reconnectTimeout),this.connectionTimeout&&clearTimeout(this.connectionTimeout),this.versionConnectionTimeout&&clearTimeout(this.versionConnectionTimeout),this.ws&&(this.ws.onclose=null,this.ws.close())}retry(){this.isClosed||(this.cleanup(),this.reconnectTimeout=setTimeout(()=>{this.init(),this.reconnectAttempts+=1},Math.min(1e3*(this.reconnectAttempts<=30?1:2**(this.reconnectAttempts-30)),6e4)))}send(e){this.ws&&this.ws.readyState===WebSocket.OPEN&&this.ws.send(e)}onOpen(){this.connectionTimeout&&clearTimeout(this.connectionTimeout),this.reconnectAttempts=0,this.versionConnectionTimeout=setTimeout(()=>{null===this.communicationRevision&&(this.communicationRevision="legacy",this.version="0.5.0")},1e3)}onClose(){this.retry()}onError(){this.retry()}onMessage(e){var t;if(this.communicationRevision)switch(this.communicationRevision){case"legacy":this.executeEvent("legacy",e.data);break;case"1":this.executeEvent("1",e.data)}else!e.data.startsWith("Version:")&&e.data.startsWith("ADAPTER_VERSION ")?(this.communicationRevision=e.data.split(";")[1].split(" ")[1],t=e.data.split(" ")[1].split(";")[0],this.version=t):(this.communicationRevision="legacy",this.version="0.5.0")}sendUpdate(e){if(this.ws&&this.ws.readyState===WebSocket.OPEN)switch(this.communicationRevision){case"legacy":F(this,e);break;case"1":Y(this,e)}}};function Y(e,t){for(const n in t){if("timestamp"===n)return;var a=t[n];null!==a&&a!==e.cache.get(n)&&(e.send(n.toUpperCase()+" "+a),e.cache.set(n,a))}}function F(t,a){for(const n in a){if("timestamp"===n)return;let e=a[n];"state"===n?e="PLAYING"===e?1:"PAUSED"===e?2:0:"repeat"===n?e="ALL"===e?2:"ONE"===e?1:0:"shuffle"===n&&(e=e?1:0),null!==e&&e!==t.cache.get(n)&&(t.send(n.toUpperCase()+":"+e),t.cache.set(n,e))}}var J=class{constructor(){this.mediaInfo={player:"Spotify Desktop",state:"STOPPED",title:"",artist:"",album:"",cover:"",duration:"0:00",position:"0:00",volume:100,rating:0,repeat:"NONE",shuffle:!1,timestamp:0},this.sockets=new Map,this.settings=_(),this.getSocketInfo=()=>{var e,t,a=new Map;for([e,t]of this.sockets.entries())a.set(e,{version:t.version,isConnected:t.isConnected,isConnecting:t.isConnecting,reconnectAttempts:t.reconnectAttempts});for(const n of g)a.has(n.port)||a.set(n.port,i(r({},h),{_isPlaceholder:!1}));for(const o of this.settings.customAdapters)a.has(o.port)||a.set(o.port,i(r({},h),{_isPlaceholder:!1}));return a},this.reloadSockets(),Spicetify.CosmosAsync.sub("sp://player/v2/main",t=>{if(null!=(n=null==t?void 0:t.track)&&n.metadata){var a=t.track.metadata;this.mediaInfo.title=a.title,this.mediaInfo.album=a.album_title,this.mediaInfo.duration=p(Math.round(parseInt(a.duration)/1e3)),this.mediaInfo.state=t.is_paused?"PAUSED":"PLAYING",this.mediaInfo.repeat=t.options.repeating_track?"ONE":t.options.repeating_context?"ALL":"NONE",this.mediaInfo.shuffle=t.options.shuffling_context,this.mediaInfo.artist=a.artist_name;let e=1;for(;a["artist_name:"+e];)this.mediaInfo.artist+=", "+a["artist_name:"+e],e+=1;this.mediaInfo.artist||(this.mediaInfo.artist=a.album_title),Spicetify.Platform.LibraryAPI.contains(t.track.uri).then(([e])=>this.mediaInfo.rating=e?5:0);var n=a.image_xlarge_url;-1===(null==n?void 0:n.indexOf("localfile"))?this.mediaInfo.cover="https://i.scdn.co/image/"+n.substring(n.lastIndexOf(":")+1):this.mediaInfo.cover="",this.updateAll()}}),setInterval(this.updateAll.bind(this),250)}reloadSockets(){this.settings=_();for(var[e,t]of this.sockets.entries())t.close(),this.sockets.delete(e);for(const a of g)this.settings.enabledBuiltInAdapters.includes(a.name)&&this.sockets.set(a.port,new b(a,this.executeEvent.bind(this)));for(const n of this.settings.customAdapters)n.enabled&&0!==n.port&&this.sockets.set(n.port,new b(n,this.executeEvent.bind(this)))}updateAll(){this.mediaInfo.position=p(Math.round(Spicetify.Player.getProgress()/1e3)),this.mediaInfo.volume=Math.round(100*Spicetify.Player.getVolume());for(const e of this.sockets.values())e.sendUpdate(this.mediaInfo)}executeEvent(e,t){switch(e){case"legacy":K(this,t);break;case"1":Z(this,t)}this.updateAll()}connectSocket(t){this.settings=_();let e=g.find(e=>e.port===t);(e=e||this.settings.customAdapters.find(e=>e.port===t))&&!this.sockets.has(t)&&this.sockets.set(e.port,new b(e,this.executeEvent))}disconnectSocket(e){var t=this.sockets.get(e);t&&(t.close(),this.sockets.delete(e))}};function K(e,t){try{var[a,n]=t.toUpperCase().split(" ");switch(a){case"PLAYPAUSE":Spicetify.Player.togglePlay(),e.mediaInfo.state="PLAYING"===e.mediaInfo.state?"PAUSED":"PLAYING";break;case"NEXT":Spicetify.Player.next();break;case"PREVIOUS":Spicetify.Player.back();break;case"SETPOSITION":var[,o]=t.toUpperCase().split(":")[1].split("SETPROGRESS ");Spicetify.Player.seek(parseFloat(o.replace(",",".")));break;case"SETVOLUME":Spicetify.Player.setVolume(parseInt(n)/100),e.mediaInfo.volume=parseInt(n);break;case"REPEAT":Spicetify.Player.toggleRepeat(),e.mediaInfo.repeat="NONE"===e.mediaInfo.repeat?"ALL":"ALL"===e.mediaInfo.repeat?"ONE":"NONE";break;case"SHUFFLE":Spicetify.Player.toggleShuffle(),e.mediaInfo.shuffle=!e.mediaInfo.shuffle;break;case"TOGGLETHUMBSUP":Spicetify.Player.toggleHeart(),e.mediaInfo.rating=5===e.mediaInfo.rating?0:5;break;case"RATING":var r=parseInt(n),i=3<e.mediaInfo.rating;(3<=r&&!i||r<3&&i)&&Spicetify.Player.toggleHeart(),e.mediaInfo.rating=r;break;default:console.warn("WNPReduxSpicetify: Unknown event: "+t)}}catch(e){console.error("WNPReduxSpicetify: Error while executing event: "+e)}}function Z(e,t){var[a,n]=t.split(" ");try{switch(a){case"TOGGLE_PLAYING":Spicetify.Player.togglePlay(),e.mediaInfo.state="PLAYING"===e.mediaInfo.state?"PAUSED":"PLAYING";break;case"NEXT":Spicetify.Player.next();break;case"PREVIOUS":Spicetify.Player.back();break;case"SET_POSITION":var[,o]=n.split(":");Spicetify.Player.seek(parseFloat(o.replace(",",".")));break;case"SET_VOLUME":Spicetify.Player.setVolume(parseInt(n)/100),e.mediaInfo.volume=parseInt(n);break;case"TOGGLE_REPEAT":Spicetify.Player.toggleRepeat(),e.mediaInfo.repeat="NONE"===e.mediaInfo.repeat?"ALL":"ALL"===e.mediaInfo.repeat?"ONE":"NONE";break;case"TOGGLE_SHUFFLE":Spicetify.Player.toggleShuffle(),e.mediaInfo.shuffle=!e.mediaInfo.shuffle;break;case"TOGGLE_THUMBS_UP":Spicetify.Player.toggleHeart(),e.mediaInfo.rating=5===e.mediaInfo.rating?0:5;break;case"SET_RATING":var r=parseInt(n),i=3<e.mediaInfo.rating;(3<=r&&!i||r<3&&i)&&Spicetify.Player.toggleHeart(),e.mediaInfo.rating=r;break;default:console.warn("WNPReduxSpicetify: Unknown event: "+t)}}catch(e){console.error("WNPReduxSpicetify: Error while executing event: "+e)}}var w,y=a(c()),v=a(t()),x=a(c()),E=a(c()),C=E.default.createContext({settings:_(),saveSettingsWrapper:()=>null}),X=({children:e})=>{const[t,a]=E.default.useState(_()),n=E.default.useCallback(e=>{a(e),localStorage.setItem("webnowplaying-redux-settings",JSON.stringify(e))},[a]);var o=E.default.useMemo(()=>({settings:t,saveSettingsWrapper:n}),[t,n]);return E.default.createElement(C.Provider,{value:o},e)},S=()=>{const{settings:e,saveSettingsWrapper:n}=E.default.useContext(C);return{settings:e,toggleAdapter:t=>{const a=g.find(e=>e.port===t);a&&n(i(r({},e),{enabledBuiltInAdapters:e.enabledBuiltInAdapters.includes(a.name)?e.enabledBuiltInAdapters.filter(e=>e!==a.name):[...e.enabledBuiltInAdapters,a.name]})),e.customAdapters.find(e=>e.port===t)&&n(i(r({},e),{customAdapters:e.customAdapters.map(e=>e.port===t?i(r({},e),{enabled:!e.enabled}):e)}))},addCustomAdapter:()=>{e.customAdapters.some(e=>0===e.port)||n(i(r({},e),{customAdapters:[...e.customAdapters,{id:H(),enabled:!0,port:0}]}))},updateCustomAdapter:(t,a)=>{n(i(r({},e),{customAdapters:e.customAdapters.map(e=>e.id===t?i(r({},e),{port:a}):e)}))},removeCustomAdapter:t=>{n(i(r({},e),{customAdapters:e.customAdapters.filter(e=>e.id!==t)}))}}},k=a(c()),P=k.default.createContext({socketInfo:new Map}),$=e=>{const[t,a]=k.default.useState(new Map);return k.default.useEffect(()=>{var e=()=>a(L().getSocketInfo());e();const t=setInterval(e,250);return()=>clearInterval(t)},[]),k.default.createElement(P.Provider,{value:{socketInfo:t}},e.children)},A=a(c()),q=a(c()),I=t=>q.default.createElement("a",{href:t.link,className:t.className,onClick:e=>{e.preventDefault(),window.open(t.link,"_blank")}},t.text),N=a(c()),Q=t=>{const e=N.default.useRef(null);return N.default.useEffect(()=>{e.current&&(t.color?e.current.style.setProperty("background-color",t.color,"important"):e.current.style.removeProperty("background-color"))},[t.color]),N.default.createElement("label",{className:"x-toggle-wrapper x-settings-secondColumn"},N.default.createElement("input",{disabled:t.disabled,className:"x-toggle-input",type:"checkbox",checked:t.checked,onChange:e=>t.onChange(e.target.checked)}),N.default.createElement("span",{ref:e,className:"x-toggle-indicatorWrapper",style:{cursor:t.disabled?"default":"pointer"}},N.default.createElement("span",{className:"x-toggle-indicator"})))},D={name:"Adapter-module__name___9UXAo_webnowplayingDredux",adapter:"Adapter-module__adapter___UbEU9_webnowplayingDredux",authorName:"Adapter-module__authorName___ns2NP_webnowplayingDredux",authors:"Adapter-module__authors___2vGnr_webnowplayingDredux",version:"Adapter-module__version___Vyn0f_webnowplayingDredux",updateAvailable:"Adapter-module__updateAvailable___n4uVL_webnowplayingDredux"},ee=a=>A.default.createElement("div",{className:D.authors},a.adapter.authors.map((e,t)=>A.default.createElement("div",null,0===t&&A.default.createElement("span",{style:{marginRight:"-0.125rem"}},"("),A.default.createElement(I,{text:e.name,link:e.link,className:D.authorName}),t!==a.adapter.authors.length-1&&A.default.createElement("span",{style:{marginLeft:"0.125rem"}},","),t===a.adapter.authors.length-1&&A.default.createElement("span",{style:{marginLeft:"0.125rem",marginRight:"0.5rem"}},")")))),te=e=>{const t=S()["toggleAdapter"],[a,n]=A.default.useState("0.0.0"),[o,r]=A.default.useState(!1);return A.default.useEffect(()=>{(async t=>{if(f[t]&&f[t].timestamp>Date.now()-432e5)return f[t].version;try{var a=await fetch(`https://api.github.com/repos/${t}/releases?per_page=1`);if(a.ok){let e=(await a.json())[0].tag_name;return e?(e.startsWith("v")&&(e=e.slice(1)),f[t]={timestamp:Date.now(),version:e},localStorage.setItem("wnp-redux-gh-cache",JSON.stringify(f)),e):"Error"}return"Error"}catch(e){return"Error"}})(e.adapter.gh).then(e=>{n(e)})},[]),A.default.createElement("div",{className:D.adapter},A.default.createElement(Q,{color:e.info.isConnected?"lime":e.info.isConnecting?"orange":"#434756",checked:e.enabled,disabled:o,onChange:()=>{e.enabled?L().disconnectSocket(e.adapter.port):L().connectSocket(e.adapter.port),t(e.adapter.port),r(!0),setTimeout(()=>r(!1),250)}}),A.default.createElement(I,{link:"https://github.com/"+e.adapter.gh,className:D.name,text:e.adapter.name}),A.default.createElement(ee,{adapter:e.adapter}),e.info.isConnected&&"Error"===a&&A.default.createElement("div",{className:D.version,style:{color:"tomato"}},"Couldn't check for updates"),e.info.isConnected&&"Error"!==a&&m(e.info.version,a)&&"0.0.0"!==e.info.version&&A.default.createElement("div",{className:D.version},A.default.createElement(I,{className:D.updateAvailable,link:`https://github.com/${e.adapter.gh}/releases/latest`,text:"Update available"})),e.info.isConnected&&"0.0.0"!==e.info.version&&"Error"!==a&&!m(e.info.version,a)&&A.default.createElement("div",{className:D.version,style:{color:"lime"}},"Up to date"))},ae=a(c()),ne="Button-module__button___cOv3U_webnowplayingDredux",oe="Button-module__buttonSmall___gLl2s_webnowplayingDredux",re=e=>ae.default.createElement("span",{className:e.className},ae.default.createElement("button",{disabled:e.disabled,onClick:e.onClick,className:ne+(e.small?" "+oe:"")},e.children)),T=a(c()),ie=a(c()),se="Input-module__input___TI17k_webnowplayingDredux",le=t=>{const[e,a]=ie.default.useState(t.value);return ie.default.createElement("input",{className:`main-dropDown-dropDown ${t.className} `+se,type:"text",value:"0"===e?"":e,placeholder:t.placeholder,onChange:e=>{a(e.target.value),t.onChange(e.target.value)}})},de="CustomAdapter-module__name___hdHvj_webnowplayingDredux",ce="CustomAdapter-module__adapter___-LDKT_webnowplayingDredux",ue="CustomAdapter-module__input___cTS-v_webnowplayingDredux",pe="CustomAdapter-module__button___xb4-y_webnowplayingDredux",me=a=>{const{settings:n,toggleAdapter:e,updateCustomAdapter:o,removeCustomAdapter:t}=S(),[r,i]=T.default.useState(!1),[s,l]=T.default.useState(!1),d=T.default.useRef();return T.default.createElement("div",{className:ce},T.default.createElement(Q,{color:a.info.isConnected?"lime":a.info.isConnecting?"orange":"#434756",checked:a.adapter.enabled,disabled:s,onChange:()=>{a.adapter.enabled?L().disconnectSocket(a.adapter.port):L().connectSocket(a.adapter.port),e(a.adapter.port),l(!0),setTimeout(()=>l(!1),250)}}),T.default.createElement("div",{className:de},"Custom adapter"),T.default.createElement(le,{className:ue,value:a.adapter.port.toString(),placeholder:"Port",onChange:e=>{const t=parseInt(e||"0");if(!isNaN(t)){try{new URL("ws://localhost:"+t)}catch(e){return}return g.some(e=>e.port===t)?!1:!n.customAdapters.some(e=>e.port===t&&e.id!==a.adapter.id)&&(L().disconnectSocket(a.adapter.port),o(a.adapter.id,t),clearTimeout(d.current),void(0!==t&&(d.current=setTimeout(()=>L().connectSocket(t),250))))}}}),T.default.createElement(re,{small:!0,className:pe,onClick:()=>{r?(t(a.adapter.id),L().disconnectSocket(a.adapter.port)):(i(!0),setTimeout(()=>i(!1),2e3))}},r?"Confirm":"Remove"))},fe="SettingsPanel-module__background___whz9H_webnowplayingDredux",_e="SettingsPanel-module__main___Lf0on_webnowplayingDredux",ge="SettingsPanel-module__inner___b7T13_webnowplayingDredux",he="SettingsPanel-module__submitAdapter___u6J1i_webnowplayingDredux",be="SettingsPanel-module__header___izl2S_webnowplayingDredux",we="SettingsPanel-module__buttonContainer___axs6M_webnowplayingDredux",ye=()=>{const{settings:t,addCustomAdapter:e}=S(),a=k.default.useContext(P)["socketInfo"];return x.default.createElement("div",{className:fe+" backdrop",onClick:Ee},x.default.createElement("div",{className:_e,onClick:e=>e.stopPropagation()},x.default.createElement("h1",{className:be},"WebNowPlaying-Redux"),x.default.createElement("div",{className:ge},g.map(e=>{return x.default.createElement(te,{key:e.name,adapter:e,enabled:t.enabledBuiltInAdapters.includes(e.name),info:null!=(e=a.get(e.port))?e:h})}),t.customAdapters.map(e=>{return x.default.createElement(me,{key:e.id,adapter:e,info:null!=(e=a.get(e.port))?e:h})}),x.default.createElement("div",{className:he},"Want to create or submit your own adapter? Click ",x.default.createElement(I,{text:"here",link:"https://github.com/keifufu/WebNowPlaying-Redux/blob/main/CreatingAdapters.md"}),"!")),x.default.createElement("div",{className:we},x.default.createElement(re,{onClick:e},"add custom adapter"))))},O=a(c()),R={main:"WarningPanel-module__main___ZFjmu_webnowplayingDredux",command:"WarningPanel-module__command___doTnf_webnowplayingDredux",code:"WarningPanel-module__code___Hu1t2_webnowplayingDredux",copy:"WarningPanel-module__copy___l0dCK_webnowplayingDredux"},ve=({children:e})=>O.default.createElement("div",{className:R.command},O.default.createElement("p",{className:R.code},e),O.default.createElement("span",{className:R.copy,onClick:()=>V(e)},O.default.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",version:"1.1",width:"18",viewBox:"0 0 512 512"},O.default.createElement("g",null,O.default.createElement("path",{fill:"currentColor",d:"M 161.5,-0.5 C 242.167,-0.5 322.833,-0.5 403.5,-0.5C 432.339,5.1918 452.839,21.5251 465,48.5C 467.277,54.3315 468.944,60.3315 470,66.5C 470.667,173.833 470.667,281.167 470,388.5C 463.318,401.704 453.151,405.204 439.5,399C 435.61,396.404 432.777,392.904 431,388.5C 430.667,285.5 430.333,182.5 430,79.5C 427.5,55.6667 414.333,42.5 390.5,40C 314.167,39.6667 237.833,39.3333 161.5,39C 148.296,32.3178 144.796,22.1511 151,8.5C 153.84,4.67323 157.34,1.67323 161.5,-0.5 Z"})),O.default.createElement("g",null,O.default.createElement("path",{fill:"currentColor",d:"M 323.5,511.5 C 251.167,511.5 178.833,511.5 106.5,511.5C 77.661,505.808 57.161,489.475 45,462.5C 42.7228,456.668 41.0561,450.668 40,444.5C 39.3333,345.5 39.3333,246.5 40,147.5C 47.5,110.667 69.6667,88.5 106.5,81C 178.833,80.3333 251.167,80.3333 323.5,81C 360,88.8333 382.167,111 390,147.5C 390.667,246.5 390.667,345.5 390,444.5C 384.649,473.519 368.482,494.019 341.5,506C 335.469,508.168 329.469,510.001 323.5,511.5 Z M 119.5,120.5 C 183.168,120.333 246.834,120.5 310.5,121C 334.333,123.5 347.5,136.667 350,160.5C 350.667,250.833 350.667,341.167 350,431.5C 347.5,455.333 334.333,468.5 310.5,471C 246.833,471.667 183.167,471.667 119.5,471C 95.6667,468.5 82.5,455.333 80,431.5C 79.3333,341.167 79.3333,250.833 80,160.5C 82.6776,136.656 95.8443,123.323 119.5,120.5 Z"}))))),xe=()=>O.default.createElement("div",{className:"backdrop"},O.default.createElement("div",{className:R.main},O.default.createElement("h1",null,"Warning"),O.default.createElement("p",null,"You have both WebNowPlaying-Redux and webnowplaying.js installed."),O.default.createElement("br",null),O.default.createElement("p",null,"Run the following commands to uninstall:"),O.default.createElement(ve,null,"spicetify config extensions webnowplaying.js-"),O.default.createElement(ve,null,"spicetify apply"))),Ee=()=>{var e;return null==(e=document.getElementById("wnp-redux-settings"))?void 0:e.remove()},L=()=>w;var Ce=async function(){for(;null==Spicetify||!Spicetify.Platform||null==Spicetify||!Spicetify.CosmosAsync||null==Spicetify||!Spicetify.Player;)await new Promise(e=>setTimeout(e,100));var e;document.querySelector('script[src*="webnowplaying.js"]')?((e=document.createElement("div")).id="wnp-redux-warning",document.body.appendChild(e),v.default.render(y.default.createElement(xe,null),e)):(w=new J,new Spicetify.Menu.Item("WebNowPlaying",!1,()=>{var e;(e=document.createElement("div")).id="wnp-redux-settings",document.body.appendChild(e),v.default.render(y.default.createElement(X,null,y.default.createElement($,null,y.default.createElement(ye,null))),e)},`
<svg xmlns="http://www.w3.org/2000/svg" width="18" viewBox="0 0 128 128">
  <path
    fill="currentColor"
    opacity="1.000000"
    stroke="none" 
    d="
    M52.468651,129.000000 
    C51.522316,128.333679 51.183170,127.289772 50.546692,127.056244 
    C34.322289,121.103279 23.346861,105.138237 24.096548,87.351288 
    C24.401844,80.107864 26.873232,73.434875 30.401190,66.856834 
    C40.966480,47.157341 50.831905,27.082733 61.000626,7.169924 
    C61.930473,5.349056 63.075897,3.638271 64.395424,1.414187 
    C65.780602,3.448930 66.952225,4.824516 67.747757,6.391089 
    C77.577171,25.747242 87.028854,45.304592 97.294304,64.425476 
    C101.591698,72.429993 105.055092,80.321762 104.998726,89.488243 
    C104.894035,106.514221 93.884232,121.461365 78.310295,127.033180 
    C77.608803,127.284157 77.041710,127.910805 76.706009,128.681244 
    C68.979103,129.000000 60.958202,129.000000 52.468651,129.000000 
    M76.117493,114.978951 
    C85.191467,110.116631 90.346237,102.573860 92.314461,91.905426 
    C81.143524,96.487022 72.116440,93.168457 63.568077,87.094536 
    C58.102886,83.211334 52.060413,81.304787 45.274181,81.982422 
    C40.446869,82.464447 35.167786,88.801292 36.077812,93.409813 
    C40.093639,113.746559 58.187553,121.231300 76.117493,114.978951 
    z"
  />
</svg>
`).register())};(async()=>{await Ce()})()})();(async()=>{var e;document.getElementById("webnowplayingDredux")||((e=document.createElement("style")).id="webnowplayingDredux",e.textContent=String.raw`
  .backdrop{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;background-color:rgba(0,0,0,.5);z-index:100}.Adapter-module__name___9UXAo_webnowplayingDredux{color:var(--spice-subtext);font-weight:600;margin:0 .5rem}.Adapter-module__adapter___UbEU9_webnowplayingDredux{display:flex;align-items:center;width:100%;height:100%;margin:.5rem 0}.Adapter-module__authorName___ns2NP_webnowplayingDredux{margin-left:.25rem;opacity:.8}.Adapter-module__authors___2vGnr_webnowplayingDredux{display:flex;align-items:center}.Adapter-module__version___Vyn0f_webnowplayingDredux{margin-left:auto}.Adapter-module__updateAvailable___n4uVL_webnowplayingDredux{color:orange}.Button-module__button___cOv3U_webnowplayingDredux{background-color:transparent;border:1px solid var(--spice-subtext);border-radius:20px;color:var(--spice-subtext);cursor:pointer;font-weight:600;padding:10px 20px;text-transform:uppercase;transition:all .15s ease-in-out}.Button-module__button___cOv3U_webnowplayingDredux:hover:not(:disabled){background-color:var(--spice-subtext);color:var(--spice-main)}.Button-module__button___cOv3U_webnowplayingDredux:disabled{opacity:.5;cursor:default}.Button-module__buttonSmall___gLl2s_webnowplayingDredux{padding:5px 10px;font-size:.8rem}.Input-module__input___TI17k_webnowplayingDredux{padding:0 12px}.CustomAdapter-module__name___hdHvj_webnowplayingDredux{color:var(--spice-subtext);font-weight:600;margin:0 .5rem;flex-shrink:0}.CustomAdapter-module__adapter___-LDKT_webnowplayingDredux{display:flex;align-items:center;width:100%;height:100%;margin:.5rem 0}.CustomAdapter-module__input___cTS-v_webnowplayingDredux{width:70px}.CustomAdapter-module__button___xb4-y_webnowplayingDredux{margin-left:auto}.SettingsPanel-module__background___whz9H_webnowplayingDredux{cursor:pointer}.SettingsPanel-module__main___Lf0on_webnowplayingDredux{background-color:var(--spice-main);display:flex;flex-direction:column;border-radius:10px;padding:20px 30px;cursor:default;max-height:75%;max-width:75%}.SettingsPanel-module__inner___b7T13_webnowplayingDredux{display:flex;flex-direction:column;overflow-y:auto;padding-right:5px}.SettingsPanel-module__inner___b7T13_webnowplayingDredux::-webkit-scrollbar{width:5px}.SettingsPanel-module__inner___b7T13_webnowplayingDredux::-webkit-scrollbar-thumb{background-color:var(--spice-subtext);border-radius:10px}.SettingsPanel-module__submitAdapter___u6J1i_webnowplayingDredux{align-self:center;margin-top:20px}.SettingsPanel-module__header___izl2S_webnowplayingDredux{padding-bottom:10px}.SettingsPanel-module__buttonContainer___axs6M_webnowplayingDredux{display:flex;padding-top:30px;justify-content:flex-end}.SettingsPanel-module__buttonContainer___axs6M_webnowplayingDredux>*{margin-left:10px}.WarningPanel-module__main___ZFjmu_webnowplayingDredux{background-color:var(--spice-main);display:flex;justify-content:center;align-items:center;flex-direction:column;border-radius:10px;padding:30px}.WarningPanel-module__command___doTnf_webnowplayingDredux{display:flex;justify-content:center;align-items:center}.WarningPanel-module__code___Hu1t2_webnowplayingDredux{font-family:monospace;color:var(--spice-subtext);background-color:var(--spice-card);border-radius:5px;padding:0 3px;margin:3px}.WarningPanel-module__copy___l0dCK_webnowplayingDredux{cursor:pointer;padding-top:5px}.WarningPanel-module__copy___l0dCK_webnowplayingDredux:hover{color:var(--spice-text)}
      `.trim(),document.head.appendChild(e))})();