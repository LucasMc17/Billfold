if(!self.define){let e,i={};const c=(c,n)=>(c=new URL(c+".js",n).href,i[c]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=i,document.head.appendChild(e)}else e=c,importScripts(c),i()})).then((()=>{let e=i[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(n,d)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(i[r])return;let o={};const f=e=>c(e,r),l={module:{uri:r},exports:o,require:f};i[r]=Promise.all(n.map((e=>l[e]||f(e)))).then((e=>(d(...e),o)))}}define(["./workbox-71c570da"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"public/android-chrome-192x192.png",revision:"91a34108d64c230fb53f949df068111b"},{url:"public/android-chrome-192x192.png:Zone.Identifier",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"public/android-chrome-512x512.png",revision:"06b663299c11b9c3c83833d5362f9a88"},{url:"public/android-chrome-512x512.png:Zone.Identifier",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"public/apple-touch-icon.png",revision:"15177b10a1fb53bcc9dac547ef5c5fc4"},{url:"public/apple-touch-icon.png:Zone.Identifier",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"public/billfold-upload-example.PNG",revision:"14ee8c01aaec3d8fd7d35b4956565195"},{url:"public/down-insight.png",revision:"de5dd89a0584f2af9b54dca11b7095de"},{url:"public/down-insight.svg",revision:"4a0d17a63c0c050e527dcaf92b26c2e3"},{url:"public/favicon-16x16.png",revision:"c4f7259339133e25b78d7c8c4ba26f2a"},{url:"public/favicon-16x16.png:Zone.Identifier",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"public/favicon-32x32.png",revision:"6a5b410f7e60e4cce4c582d31002df39"},{url:"public/favicon-32x32.png:Zone.Identifier",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"public/favicon.ico",revision:"cd81cddbc90cf476a06c799f60ab9fa1"},{url:"public/favicon.ico:Zone.Identifier",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"public/hamburger.png",revision:"91a47fbbb89f36da1368a149e51f1718"},{url:"public/hamburger.svg",revision:"31344046fe21d86e3237a85721d07517"},{url:"public/index.html",revision:"80b3523770222b16b02180740b4a8fdb"},{url:"public/load-icon.png",revision:"5ef67e1a81eaff70ffd6226cfe4e52ac"},{url:"public/load-icon.svg",revision:"a7a2d517c13c6c3bd4c1b13ef0498a72"},{url:"public/logo.png",revision:"d9f78ed13a8b40a6f7e4e9e0b658967f"},{url:"public/logo.svg",revision:"7c2ccf3af51467ee53ec32446c5245c1"},{url:"public/maskable_icon.png",revision:"c4a9acbb6d9b2f61249da1aa9720a789"},{url:"public/maskable_icon.png:Zone.Identifier",revision:"377581c6e31e6f7ee50ad58f732d4426"},{url:"public/site.webmanifest",revision:"cddad264bb88dae5854a18ff5cb879f0"},{url:"public/site.webmanifest:Zone.Identifier",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"public/style.css",revision:"0835534b6360fbf713de67e25a0d7ff2"},{url:"public/up-insight.png",revision:"fd37dcdf8d07ad6e169a4077d175c245"},{url:"public/up-insight.svg",revision:"91d040a2f444182084fa55919a1c292f"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]}),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/public/index.html")))}));
//# sourceMappingURL=service-worker.js.map
