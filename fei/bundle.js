!function(e){var t={};function n(i){if(t[i])return t[i].exports;var o=t[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(i,o,function(t){return e[t]}.bind(null,o));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=document.getElementById("game"),o=i.getContext("2d");i.width=window.innerWidth,i.height=window.innerHeight;var r=i.clientWidth,u=i.clientHeight;t.canvas=i,t.context=o,t.canvasWidth=r,t.canvasHeight=u},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),o=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e);var n=t||{};this.x=n.x,this.y=n.y,this.width=n.width,this.height=n.height,this.speed=n.speed}return i(e,[{key:"move",value:function(e,t){var n=e||0,i=t||0;this.x+=n,this.y+=i}}]),e}();t.default=o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),o=new(function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.enableMusic=!0,this.resources={images:{},sounds:{}}}return i(e,[{key:"imageLoader",value:function(e,t){var n=new Image;return n.addEventListener("load",t),n.src=e,n}},{key:"soundLoader",value:function(e,t){var n=new Audio;return n.addEventListener("canplaythrough",t),n.src=e,t(),n}},{key:"preplayAllSound",value:function(){var e=this,t=this,n=this.resources.sounds,i=function(i){e.playSound(i,{disable:!0}),setTimeout((function(){t.pauseSound(i),n[i].volume=1}),50)};for(var o in n)i(o)}},{key:"setMusic",value:function(e){this.enableMusic=e}},{key:"load",value:function(e,t){for(var n=this,i=e.images,o=e.sounds,r=i.length+o.length,u=0,s=0;s<i.length;s++){var a=i[s].name,l=i[s].src;n.resources.images[a]=n.imageLoader(l,(function(){++u===r&&t(n.resources)}))}for(var c=0;c<o.length;c++){var h=o[c].name,f=o[c].src;n.resources.sounds[h]=n.soundLoader(f,(function(){++u===r&&t(n.resources)}))}}},{key:"playSound",value:function(e,t){var n=this.resources.sounds[e];if(n&&this.enableMusic)return(t=t||{}).loop&&(n.loop="loop"),t.disabled?n.volume=0:n.volume=1,n.currentTime=0,n.play(),n}},{key:"pauseSound",value:function(e){var t=this.resources.sounds[e];if(t&&this.enableMusic)return t.pause(),t}}]),e}());t.default=o},function(e,t,n){"use strict";var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();n(11);var o=u(n(4)),r=u(n(2));function u(e){return e&&e.__esModule?e:{default:e}}var s=new(function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.bg=document.querySelector(".game"),this.index=document.querySelector(".ui-index"),this.rule=document.querySelector(".ui-rule"),this.setting=document.querySelector(".ui-setting"),this.result=document.querySelector(".ui-result"),this.score=document.querySelectorAll(".score"),this.btns=document.querySelectorAll(".btn"),this.startBtn=document.querySelector(".game-start"),this.settingBtn=document.querySelector(".game-setting"),this.settingConfirm=document.querySelector(".game-setting-confirm"),this.ruleBtn=document.querySelector(".game-rule"),this.ruleConfirm=document.querySelector(".game-rule-confirm"),this.resultConfirm=document.querySelector(".game-result-confirm")}return i(e,[{key:"init",value:function(){var e=this;this.btns.forEach((function(e){e.addEventListener("click",(function(){r.default.playSound("buttonSound")}))})),this.startBtn.addEventListener("click",(function(){e.index.style.display="none",o.default.start()})),this.settingBtn.addEventListener("click",(function(){e.setting.style.display="block",e.index.style.display="none"})),this.ruleBtn.addEventListener("click",(function(){e.rule.style.display="block",e.index.style.display="none"})),this.settingConfirm.addEventListener("click",(function(){var t="1"===document.querySelector("#setting-music").value;switch(r.default.setMusic(t),document.querySelector("#setting-bg").value){case"1":e.bg.className="game bg1";break;case"2":e.bg.className="game bg2";break;case"3":e.bg.className="game bg3";break;case"4":e.bg.className="game bg4"}var n=document.querySelector("#setting-plane");o.default.setGameOptions({planeType:n.value}),e.setting.style.display="none",e.index.style.display="block"})),this.ruleConfirm.addEventListener("click",(function(){e.rule.style.display="none",e.index.style.display="block"})),this.resultConfirm.addEventListener("click",(function(){e.result.style.display="none",e.index.style.display="block"}))}},{key:"end",value:function(){this.index.style.display="none",this.result.style.display="block",this.score[0].textContent="分数："+o.default.score}},{key:"update",value:function(){this.score[1].textContent="分数："+o.default.score}}]),e}());o.default.init({onInit:function(){r.default.preplayAllSound(),s.init()},onEnd:function(){s.end()},onUpdate:function(){s.update()}})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),o=l(n(5)),r=l(n(2)),u=l(n(8)),s=l(n(10)),a=n(0);function l(e){return e&&e.__esModule?e:{default:e}}window.requestAnimFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(e,1e3/30)};var c=new(function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}return i(e,[{key:"init",value:function(e){var t=Object.assign({},e,o.default),n=this;t.planeType=t.planeType||"bluePlaneIcon",r.default.load(t.resources,(function(e){n.images=e.images,n.sounds=e.sounds,n.planeIcon=n.images[t.planeType],n.opts=t,n.opts.onInit&&n.opts.onInit()})),this.opts=t}},{key:"setGameOptions",value:function(e){e.planeType&&(this.planeIcon=this.images[e.planeType])}},{key:"createPlane",value:function(){var e=this.opts,t=this.images;this.planePosX=a.canvasWidth/2-e.planeSize.width/2,this.planePosY=a.canvasHeight-e.planeSize.height-50;var n={x:this.planePosX,y:this.planePosY,icon:this.planeIcon,width:e.planeSize.width,height:e.planeSize.height,boomIcon:t.enemyBigBoomIcon,bulletSize:e.bulletSize,bulletSpeed:e.bulletSpeed,bulletIcon:t.fireIcon};this.plane=new u.default(n)}},{key:"createEnemy",value:function(e){var t=this.enemies,n=this.opts,i=this.images,o=n.enemySmallSize,r=n.enemySpeed,u=i.enemySmallIcon,l=i.enemySmallBoomIcon,c=1;"big"===e&&(o=n.enemyBigSize,u=i.enemyBigIcon,l=i.enemyBigBoomIcon,r=.6*n.enemySpeed,c=10);var h={x:Math.floor(Math.random()*(a.canvasWidth-o.width)),y:-o.height,type:e,live:c,width:o.width,height:o.height,speed:r,icon:u,boomIcon:l};t.length<5&&t.push(new s.default(h))}},{key:"setStatus",value:function(e){this.status=e}},{key:"start",value:function(){var e=this;this.enemies=[],this.score=0,r.default.playSound("gameSound",{loop:!0}),e.createPlane(),this.plane.startShoot(),r.default.playSound("shootSound"),this.bindTouchAction(),this.createSmallEnemyInterval=setInterval((function(){e.createEnemy("normal")}),500),this.createBigEnemyInterval=setInterval((function(){e.createEnemy("big")}),1500),this.setStatus("playing"),this.update()}},{key:"update",value:function(){var e=this,t=this.plane;if(a.context.clearRect(0,0,a.canvasWidth,a.canvasHeight),this.updateElement(),this.draw(),"boomed"===t.status)return this.setStatus("end"),void this.end();this.opts.onUpdate&&this.opts.onUpdate(),window.requestAnimFrame((function(){e.update()}))}},{key:"end",value:function(){a.context.clearRect(0,0,a.canvasWidth,a.canvasHeight),r.default.pauseSound("gameSound"),r.default.pauseSound("shootSound"),clearInterval(this.createSmallEnemyInterval),clearInterval(this.createBigEnemyInterval),this.opts.onEnd&&this.opts.onEnd()}},{key:"bindTouchAction",value:function(){var e=this.opts,t=a.canvasWidth-e.planeSize.width,n=a.canvasHeight-e.planeSize.height,i=this;a.canvas.addEventListener("touchstart",(function(e){var o=i.plane,r=e.touches[0].clientX,u=e.touches[0].clientY,s=o.x,l=o.y;e.preventDefault(),a.canvas.addEventListener("touchmove",(function(e){var i=e.touches[0].clientX,a=e.touches[0].clientY,c=s+(i-r),h=l+(a-u);c<0&&(c=0),c>t&&(c=t),h<0&&(h=0),h>n&&(h=n),e.preventDefault(),o.setPos(c,h)}),!1)}),!1)}},{key:"updateElement",value:function(){var e=this.plane,t=this.enemies,n=t.length;for("booming"===e.status&&e.booming();n--;){var i=t[n];if(i.down(),i.y>=a.canvasHeight)t.splice(n,1);else switch("normal"===e.status&&e.hasCrash(i)&&(e.booming(),r.default.playSound("dieSound")),i.status){case"normal":e.hasHit(i)&&(r.default.playSound("boomSound"),i.live--,0===i.live&&i.booming());break;case"booming":i.booming();break;case"boomed":var o="big"===i.type?1e3:100;t.splice(n,1),this.score+=o}}}},{key:"draw",value:function(){this.plane.draw(),this.enemies.forEach((function(e){e.draw()}))}}]),e}());t.default=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),n(6),t.default={enemySmallSize:{width:54,height:40},enemyBigSize:{width:130,height:100},enemySpeed:4,planeSize:{width:60,height:45},bulletSize:{width:20,height:20},bulletSpeed:10,resources:{images:[{src:"./img/plane_1.png",name:"bluePlaneIcon"},{src:"./img/plane_2.png",name:"pinkPlaneIcon"},{src:"./img/fire.png",name:"fireIcon"},{src:"./img/enemy_big.png",name:"enemyBigIcon"},{src:"./img/enemy_small.png",name:"enemySmallIcon"},{src:"./img/boom_big.png",name:"enemyBigBoomIcon"},{src:"./img/boom_small.png",name:"enemySmallBoomIcon"}],sounds:[{src:"./sound/biubiubiu.mp3",name:"shootSound"},{src:"./sound/music.mp3",name:"gameSound"},{src:"./sound/die.mp3",name:"dieSound"},{src:"./sound/button.mp3",name:"buttonSound"},{src:"./sound/boom.mp3",name:"boomSound"}]}}},function(e,t,n){"use strict";(function(e){function n(e,t){for(var n=0,i=e.length-1;i>=0;i--){var o=e[i];"."===o?e.splice(i,1):".."===o?(e.splice(i,1),n++):n&&(e.splice(i,1),n--)}if(t)for(;n--;n)e.unshift("..");return e}function i(e,t){if(e.filter)return e.filter(t);for(var n=[],i=0;i<e.length;i++)t(e[i],i,e)&&n.push(e[i]);return n}t.resolve=function(){for(var t="",o=!1,r=arguments.length-1;r>=-1&&!o;r--){var u=r>=0?arguments[r]:e.cwd();if("string"!=typeof u)throw new TypeError("Arguments to path.resolve must be strings");u&&(t=u+"/"+t,o="/"===u.charAt(0))}return(o?"/":"")+(t=n(i(t.split("/"),(function(e){return!!e})),!o).join("/"))||"."},t.normalize=function(e){var r=t.isAbsolute(e),u="/"===o(e,-1);return(e=n(i(e.split("/"),(function(e){return!!e})),!r).join("/"))||r||(e="."),e&&u&&(e+="/"),(r?"/":"")+e},t.isAbsolute=function(e){return"/"===e.charAt(0)},t.join=function(){var e=Array.prototype.slice.call(arguments,0);return t.normalize(i(e,(function(e,t){if("string"!=typeof e)throw new TypeError("Arguments to path.join must be strings");return e})).join("/"))},t.relative=function(e,n){function i(e){for(var t=0;t<e.length&&""===e[t];t++);for(var n=e.length-1;n>=0&&""===e[n];n--);return t>n?[]:e.slice(t,n-t+1)}e=t.resolve(e).substr(1),n=t.resolve(n).substr(1);for(var o=i(e.split("/")),r=i(n.split("/")),u=Math.min(o.length,r.length),s=u,a=0;a<u;a++)if(o[a]!==r[a]){s=a;break}var l=[];for(a=s;a<o.length;a++)l.push("..");return(l=l.concat(r.slice(s))).join("/")},t.sep="/",t.delimiter=":",t.dirname=function(e){if("string"!=typeof e&&(e+=""),0===e.length)return".";for(var t=e.charCodeAt(0),n=47===t,i=-1,o=!0,r=e.length-1;r>=1;--r)if(47===(t=e.charCodeAt(r))){if(!o){i=r;break}}else o=!1;return-1===i?n?"/":".":n&&1===i?"/":e.slice(0,i)},t.basename=function(e,t){var n=function(e){"string"!=typeof e&&(e+="");var t,n=0,i=-1,o=!0;for(t=e.length-1;t>=0;--t)if(47===e.charCodeAt(t)){if(!o){n=t+1;break}}else-1===i&&(o=!1,i=t+1);return-1===i?"":e.slice(n,i)}(e);return t&&n.substr(-1*t.length)===t&&(n=n.substr(0,n.length-t.length)),n},t.extname=function(e){"string"!=typeof e&&(e+="");for(var t=-1,n=0,i=-1,o=!0,r=0,u=e.length-1;u>=0;--u){var s=e.charCodeAt(u);if(47!==s)-1===i&&(o=!1,i=u+1),46===s?-1===t?t=u:1!==r&&(r=1):-1!==t&&(r=-1);else if(!o){n=u+1;break}}return-1===t||-1===i||0===r||1===r&&t===i-1&&t===n+1?"":e.slice(t,i)};var o="b"==="ab".substr(-1)?function(e,t,n){return e.substr(t,n)}:function(e,t,n){return t<0&&(t=e.length+t),e.substr(t,n)}}).call(this,n(7))},function(e,t,n){"use strict";var i,o,r=e.exports={};function u(){throw new Error("setTimeout has not been defined")}function s(){throw new Error("clearTimeout has not been defined")}function a(e){if(i===setTimeout)return setTimeout(e,0);if((i===u||!i)&&setTimeout)return i=setTimeout,setTimeout(e,0);try{return i(e,0)}catch(t){try{return i.call(null,e,0)}catch(t){return i.call(this,e,0)}}}!function(){try{i="function"==typeof setTimeout?setTimeout:u}catch(e){i=u}try{o="function"==typeof clearTimeout?clearTimeout:s}catch(e){o=s}}();var l,c=[],h=!1,f=-1;function d(){h&&l&&(h=!1,l.length?c=l.concat(c):f=-1,c.length&&p())}function p(){if(!h){var e=a(d);h=!0;for(var t=c.length;t;){for(l=c,c=[];++f<t;)l&&l[f].run();f=-1,t=c.length}l=null,h=!1,function(e){if(o===clearTimeout)return clearTimeout(e);if((o===s||!o)&&clearTimeout)return o=clearTimeout,clearTimeout(e);try{o(e)}catch(t){try{return o.call(null,e)}catch(t){return o.call(this,e)}}}(e)}}function m(e,t){this.fun=e,this.array=t}function y(){}r.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];c.push(new m(e,t)),1!==c.length||h||a(p)},m.prototype.run=function(){this.fun.apply(null,this.array)},r.title="browser",r.browser=!0,r.env={},r.argv=[],r.version="",r.versions={},r.on=y,r.addListener=y,r.once=y,r.off=y,r.removeListener=y,r.removeAllListeners=y,r.emit=y,r.prependListener=y,r.prependOnceListener=y,r.listeners=function(e){return[]},r.binding=function(e){throw new Error("process.binding is not supported")},r.cwd=function(){return"/"},r.chdir=function(e){throw new Error("process.chdir is not supported")},r.umask=function(){return 0}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),o=s(n(1)),r=n(0),u=s(n(9));function s(e){return e&&e.__esModule?e:{default:e}}var a=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.status="normal",n.icon=e.icon,n.boomIcon=e.boomIcon,n.boomCount=0,n.bullets=[],n.bulletSize=e.bulletSize,n.bulletSpeed=e.bulletSpeed,n.bulletIcon=e.bulletIcon,n.shootSound=e.shootSound,n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default),i(t,[{key:"setPos",value:function(e,t){return this.x=e,this.y=t,this}},{key:"hasCrash",value:function(e){var t=!1;return this.x+this.width<e.x||e.x+e.width<this.x||this.y+this.height<e.y||e.y+e.height<this.y||(t=!0),t}},{key:"hasHit",value:function(e){for(var t=this.bullets,n=!1,i=t.length-1;i>=0;i--)if(t[i].hasCrash(e)){t.splice(i,1),n=!0;break}return n}},{key:"booming",value:function(){return this.status="booming",this.boomCount+=1,this.boomCount>10&&(this.status="boomed",clearInterval(this.shooting)),this}},{key:"startShoot",value:function(){var e=this,t=this.bulletSize.width,n=this.bulletSize.height;this.shooting=setInterval((function(){var i={x:e.x+e.width/2-t/2,y:e.y-n,width:t,height:n,speed:e.bulletSpeed,icon:e.bulletIcon};e.bullets.push(new u.default(i))}),200)}},{key:"drawBullet",value:function(){for(var e=this.bullets,t=e.length;t--;){var n=e[t];n.fly(),n.y<=0?e.splice(t,1):n.draw()}}},{key:"draw",value:function(){switch(this.status){case"booming":r.context.drawImage(this.boomIcon,this.x,this.y,this.width,this.height);break;case"normal":r.context.drawImage(this.icon,this.x,this.y,this.width,this.height)}return this.drawBullet(),this}}]),t}();t.default=a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),o=function(e){return e&&e.__esModule?e:{default:e}}(n(1)),r=n(0),u=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.icon=e.icon,n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default),i(t,[{key:"fly",value:function(){return this.move(0,-this.speed),this}},{key:"hasCrash",value:function(e){var t=!1;return this.x+this.width<e.x||e.x+e.width<this.x||this.y+this.height<e.y||e.y+e.height<this.y||(t=!0),t}},{key:"draw",value:function(){return r.context.drawImage(this.icon,this.x,this.y,this.width,this.height),this}}]),t}();t.default=u},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),o=function(e){return e&&e.__esModule?e:{default:e}}(n(1)),r=n(0),u=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.status="normal",n.icon=e.icon,n.live=e.live,n.type=e.type,n.boomIcon=e.boomIcon,n.boomCount=0,n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default),i(t,[{key:"down",value:function(){return this.move(0,this.speed),this}},{key:"booming",value:function(){return this.status="booming",this.boomCount+=1,this.boomCount>8&&(this.status="boomed"),this}},{key:"draw",value:function(){switch(this.status){case"normal":r.context.drawImage(this.icon,this.x,this.y,this.width,this.height);break;case"booming":r.context.drawImage(this.boomIcon,this.x,this.y,this.width,this.height)}return this}}]),t}();t.default=u},function(e,t){}]);