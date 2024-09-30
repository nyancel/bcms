"use strict";(()=>{var d=[],M="C_CACHE_KEY";function H(){localStorage.setItem(M,JSON.stringify(d))}function v(){let t=localStorage.getItem(M);if(!t)return;let e=JSON.parse(t);e&&(d=e)}function C(t){v();for(let e=0;e<d.length;e++)d[e].expires_at<u()&&d.splice(e,1);H();for(let e=0;e<d.length;e++)if(d[e].key==t)return d[e].item;return null}function A(t,e){v();let n={key:t,item:e,expires_at:u()+3600};d.push(n),console.log(n),H()}function u(){return new Date().getTime()/1e3}async function f(t,e){return await(await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).json()}async function S(t,e){console.log("called stuff");let n=await fetch(t,{method:"POST",body:e});console.log(n);let o=await n.json();return console.log(o),o}async function x(t,e){console.log("getting smallest item from res");let n=`util_get_media_src_by_width${t}${e}`,o=C(n);if(o)return console.log("cache hit"),o;let l=await f("/media/fetch_media",{media_ID:t}),s=Math.pow(e,2),c=await Promise.all(l.instances.map(p=>({id:p.instance_id,resolution:p.x_dimension*p.y_dimension})));c=c.sort((p,z)=>p.resolution-z.resolution);let b=c[c.length-1].id;for(let p of c)if(p.resolution>s){b=p.id;break}let y=`/media/fetch_media_instance?instance_ID=${b}`;return A(n,y),y}var i={id:void 0,author_id:void 0,last_changed:void 0,content:[]},g={paragraph:document.getElementById("article-paragraph-template"),image:document.getElementById("article-image-template"),heading:document.getElementById("article-heading-template")},T=document.getElementById("editor-container");function j(t){let e=window.open("/gallery-popup","popupWindow","width=600,height=400");window.receive_data=function(n){if(!i.content)return;let o=i.content[t];o.type==1&&(o.src_id=n,_())}}function B(t){let e=document.createElement("input");e.type="file",e.accept="png, jpg, jpeg",e.multiple=!1,e.onchange=async()=>{if(!i.content)return;let n=i.content[t];if(n.type!=1)return;let o=e.files;if(!o)return;let s=Array.from(o)[0];e.remove();let c=new FormData;c.append("media",s);let y=(await S("/media/upload_media",c)).data.results[0].key;n.src_id=y,i.last_changed=u(),_()},e.click()}function N(t,e){let n=t.querySelector(".image-display");if(!n)throw new Error("media-display not found");if(!i.content)throw new Error("article content not initialized");let o=i.content[e];if(o.type!=1)throw new Error("item type is not image");if(!o.src_id){n.classList.toggle("hidden",!0);return}(async()=>{if(!i.content)throw new Error("article content not initialized");let s=i.content[e];if(s.type!=1)throw new Error("item type is not image");if(!s.src_id)throw new Error("src_id not found");n.src=await x(s.src_id,t.clientWidth),n.classList.toggle("hidden",!1)})()}function k(t){if(console.log(t),!T)throw new Error("Editor has not been initalized");let e=document.createElement("li"),n=t.cloneNode(!0);if(!n)throw new Error("could not clone template");let o=n.content;return e.appendChild(o),T.appendChild(e),e}function D(t,e){let n=t.querySelector(".paragraph-input");if(!n)throw new Error("Could not find textarea");let o=i.content[e];if(o.type!=0)throw new Error("Article item at index is not a paragraph");n.value=o.text,n.onchange=()=>{o.text=n.value}}function O(t,e){let n=t.querySelector(".image-alt-text-input");if(!n)throw new Error("could not find alt_text element");let o=i.content[e];if(o.type!=1)throw new Error("Article item at index is not a image");o.alt_text&&(n.value=o.alt_text),n.onchange=()=>{o.alt_text=n.value};let l=t.querySelector(".image-gallery-select"),s=t.querySelector(".image-gallery-upload");l&&(l.onclick=()=>j(e)),s&&(s.onclick=()=>B(e))}function U(t,e){let n=t.querySelector(".delete-button");n&&(n.onclick=()=>{J(e),_()});let o=t.querySelector(".move-up-button");o&&(o.onclick=()=>{R(e),_()});let l=t.querySelector(".move-down-button");l&&(l.onclick=()=>{P(e),_()})}function _(){let t=window.scrollY;if(!T)throw new Error("Editor is not initialized");if(!i)throw new Error("Article is not initialized");T.innerHTML="";let e;for(let n=0;n<i.content.length;n++){switch(i.content[n].type){case 0:if(!g.paragraph)throw new Error("paragraph template not initialized");e=k(g.paragraph),D(e,n);break;case 1:if(!g.image)throw new Error("image template not initialized");console.log("inserting image"),e=k(g.image),N(e,n),O(e,n);break;case 2:if(!g.heading)throw new Error("image template not initialized");e=k(g.heading);break;default:console.log("Item type in editor-render is unknown, skipping");continue}U(e,n)}requestAnimationFrame(()=>{window.scrollTo(0,t)})}function L(t){i.content||(i.content=[]);let e=i.content.length,n;switch(t){case 0:case 2:n={type:t,text:"",index:e};break;case 1:n={type:t,alt_text:"",index:e,src_id:void 0};break}i.content.push(n),i.last_changed=u(),_()}function J(t){i.content?.splice(t,1),i.last_changed=u()}function P(t){if(!i.content||t>=i.content.length-1)return;let e=i.content[t];i.content[t]=i.content[t+1],i.content[t+1]=e,i.content[t].index=t,i.content[t+1].index=t+1,i.last_changed=u()}function R(t){if(!i.content||t<1)return;let e=i.content[t];i.content[t]=i.content[t-1],i.content[t-1]=e,i.content[t].index=t,i.content[t-1].index=t-1,i.last_changed=u()}function F(){console.log(i.content)}function w(){let t=document.getElementById("log-article");t&&(t.onclick=()=>F());let e=document.getElementById("add-paragraph");e&&(e.onclick=()=>L(0));let n=document.getElementById("add-image");n&&(n.onclick=()=>L(1));let o=document.getElementById("add-heading");o&&(o.onclick=()=>L(2))}var a={storage_key:"userjs-user-local-metadata",user:void 0,token:void 0},m={login_template:document.querySelector(".user-details-login-template"),profile_template:document.querySelector(".user-details-profile-template"),details_container:document.querySelector(".user-details-container")},r={registration:{first_name:document.querySelector("#user-register-first-name-input"),last_name:document.querySelector("#user-register-last-name-input"),email:document.querySelector("#user-register-email-input"),password:document.querySelector("#user-register-password-input"),repeat_password:document.querySelector("#user-register-password-repeat-input"),submit:document.querySelector("#user-register-submitt-button"),valid_inputs:!1},signin:{email:document.querySelector("#user-signin-email-input"),password:document.querySelector("#user-signin-password-input"),submit:document.querySelector("#user-signin-submitt-button"),valid_inputs:!1}};function h(){localStorage.setItem(a.storage_key,JSON.stringify(a))}function W(){a.token&&f("/user/logout",{user_token:a.token.id}),a.user=void 0,a.token=void 0,h(),w()}function Y(){if(!m.details_container)throw new Error("details container not initialized");if(!m.login_template)throw new Error("logintemplate not initialized");if(!m.profile_template)throw new Error("profile template not initialized");if(!a.user){m.details_container.innerHTML="";let s=m.login_template.cloneNode(!0);m.details_container.appendChild(s.content);return}m.details_container.innerHTML="";let e=m.profile_template.cloneNode(!0).content,n=e.querySelector("#user-profile-first-name");if(!n)throw new Error("fistname_element not found");n.innerHTML=a.user.first_name;let o=e.querySelector("#user-profile-last-name");if(!o)throw new Error("lastname_element not found");o.innerHTML=a.user.last_name;let l=e.querySelector("#user-profile-logout-button");if(!l)throw new Error("logout_button not found");l.onclick=()=>{W()},m.details_container.appendChild(e)}function $(t,e){if(!r.registration.submit)throw new Error("registration-submit button not found");t||(r.registration.submit.innerHTML=e??"invalid registration_data",r.registration.submit.classList.toggle("bg-green-600",!1),r.registration.submit.classList.toggle("bg-gray-600",!0)),t&&(r.registration.submit.innerHTML="Register",r.registration.submit.classList.toggle("bg-gray-600",!1),r.registration.submit.classList.toggle("bg-green-600",!0))}function E(){if(!r.registration.password)throw new Error("registration password field not found");if(!r.registration.repeat_password)throw new Error("repeat_passowrd registration field not found");if(!r.registration.email)throw new Error("email registration field not found");if(!r.registration.first_name)throw new Error("first_name registration field not found");if(!r.registration.last_name)throw new Error("last_name registration field not found");let t=!0,e;r.registration.password.value!=r.registration.repeat_password.value&&(t=!1,e="passwords dont match"),r.registration.first_name.value||(t=!1,e="missing first name"),r.registration.email.value||(t=!1,e="missing email"),r.registration.last_name.value||(t=!1,e="missing last name"),r.registration.password.value||(t=!1,e="missing password"),r.registration.valid_inputs=t,$(t,e)}function K(){if(!r.registration.valid_inputs)return;(async()=>{if(!r.registration.email)throw new Error("email value not supplied");if(!r.registration.password)throw new Error("password value not supplied");if(!r.registration.first_name)throw new Error("first name value not supplied");if(!r.registration.last_name)throw new Error("last name value not supplied");let e={email:r.registration.email.value,password:r.registration.password.value,firstname:r.registration.first_name.value,lastname:r.registration.last_name.value},n=await f("/user/register_new_user",e);if(n.error)throw new Error(n.error);a.user=n;let o={email:e.email,password:e.password},l=await f("/user/login",o);if(l.error)throw new Error(l.error);a.token=l,h(),window.location.href="/"})()}function G(){if(!r.registration.email)throw new Error("email input for registration not initalized");if(!r.registration.first_name)throw new Error("first_name input for registration not initalized");if(!r.registration.last_name)throw new Error("last_name input for registration not initalized");if(!r.registration.password)throw new Error("password input for registration not initalized");if(!r.registration.repeat_password)throw new Error("repeate_password input for registration not initalized");if(!r.registration.submit)throw new Error("submit input for registration not initalized");r.registration.email.oninput=()=>{E()},r.registration.first_name.oninput=()=>{E()},r.registration.last_name.oninput=()=>{E()},r.registration.password.oninput=()=>{E()},r.registration.repeat_password.oninput=()=>{E()},E(),r.registration.submit.onclick=()=>{K()}}function Q(){G()}async function q(){if(!a.token)return;if(u()>a.token.expires_at){a.token=void 0,a.user=void 0,h();return}if(u()+600>a.token.expires_at){let n=await f("/user/refresh_token",{user_token:a.token.id});if(n.error)throw new Error(n.error);a.token=n}if(!a.token)throw new Error("user token not found, i dont know how but you fucked up");let t=await f("/user/who",{user_token:a.token.id});if(t.error)if(t.error==="token invalid"){a.user=void 0,a.token=void 0,h(),w();return}else throw new Error(t.error);a.token=t;let e=a.token.expires_at-u();e=e-60,e=e*1e3,window.setTimeout(()=>{q()},e),h()}function I(){q(),m.details_container&&Y(),window.location.pathname==="/signin"&&Q()}window.addEventListener("load",t=>{window.location.pathname==="/editor"&&w(),I()});})();
//# sourceMappingURL=bundle.js.map
