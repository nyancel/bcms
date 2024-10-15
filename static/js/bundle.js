"use strict";(()=>{var m="BCMS_USERTS_LOCALTOKEN",g="BCMS_USERTS_LOCALUSER";function u(){let e=localStorage.getItem(m),t=localStorage.getItem(g);if(!e||!t)return null;let r=JSON.parse(e),n=JSON.parse(t);return!r||!n?null:{token:r,user:n}}function E(){return localStorage.removeItem(g),localStorage.removeItem(m),!0}function p(e){let t=JSON.stringify(e.token),r=JSON.stringify(e.user);return localStorage.setItem(m,t),localStorage.setItem(g,r),!0}async function c(e,t){let r=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await r.json();return{status_code:r.status,body:n}}async function b(e){let t=await c("/user/login",e);if(t.status_code!=200)throw new Error(t.body.message);return t.body.data}async function T(e){let t=await c("/user/logout",{auth_token:e});if(t.status_code!=200)throw new Error(t.body.message);return!0}async function L(e){let t=await c("/user/register",e);if(t.status_code!=200)throw new Error(t.body.message);return t.body.data}async function H(e){let t=await c("/user/who",{auth_token:e});if(t.status_code!=200)throw new Error(t.body.message);return t.body.data}function I(){let e=document.querySelector(".user-details-login-template"),t=document.querySelector(".user-details-profile-template"),r=document.querySelector(".user-details-container");return!e||!t||!r?null:{login_template:e,profile_template:t,details_container:r}}function k(e){let t=e.querySelector("#user-profile-first-name"),r=e.querySelector("#user-profile-last-name"),n=e.querySelector("#user-profile-logout-button");if(!t||!r||!n)throw new Error("lastname_element not found");return{firstname_element:t,lastname_element:r,logout_button:n}}function U(){let e=u();if(!e)throw new Error("No local user-data");T(e.token.id),E(),w()}function D(e,t){t.details_container.innerHTML="";let n=t.profile_template.cloneNode(!0).content,a=k(n);a.firstname_element.innerHTML=e.user.firstname,a.lastname_element.innerHTML=e.user.lastname,a.logout_button.onclick=()=>U(),t.details_container.appendChild(n)}function A(e){let t=e.login_template.cloneNode(!0);e.details_container.innerHTML="",e.details_container.appendChild(t.content)}async function w(){let e=u(),t=I();if(!t)throw new Error("html elements not loaded");if(!e){A(t);return}D(e,t)}function N(){let e=document.querySelector("#user-register-first-name-input"),t=document.querySelector("#user-register-last-name-input"),r=document.querySelector("#user-register-email-input"),n=document.querySelector("#user-register-password-input"),a=document.querySelector("#user-register-password-repeat-input"),i=document.querySelector("#user-register-submitt-button"),s=document.querySelector("#user-signin-email-input"),l=document.querySelector("#user-signin-password-input"),d=document.querySelector("#user-signin-submitt-button");return!e||!t||!r||!n||!a||!i||!s||!l||!d?null:{registration:{email:r,first_name:e,last_name:t,password:n,repeat_password:a,submit:i},signin:{email:s,password:l,submit:d}}}function O(e,t,r){if(!e){r.registration.submit.innerHTML=t??"invalid registration-data",r.registration.submit.classList.toggle("bg-green-600",!1),r.registration.submit.classList.toggle("bg-gray-600",!0);return}r.registration.submit.innerHTML="Register",r.registration.submit.classList.toggle("bg-gray-600",!1),r.registration.submit.classList.toggle("bg-green-600",!0)}function C(e,t,r){if(!e){r.signin.submit.innerHTML=t??"invalid registration-data",r.signin.submit.classList.toggle("bg-blue-200",!1),r.signin.submit.classList.toggle("text-white",!0),r.signin.submit.classList.toggle("bg-gray-600",!0);return}r.signin.submit.innerHTML="Sign in",r.signin.submit.classList.toggle("bg-gray-600",!1),r.signin.submit.classList.toggle("text-white",!1),r.signin.submit.classList.toggle("bg-blue-200",!0)}function M(e){let t=!0,r="";return e.registration.password.value!=e.registration.repeat_password.value&&(t=!1,r="passwords dont match"),e.registration.first_name.value||(t=!1,r="missing first name"),e.registration.email.value||(t=!1,r="missing email"),e.registration.last_name.value||(t=!1,r="missing last name"),e.registration.password.value||(t=!1,r="missing password"),{valid:t,reason:r}}function P(e){let t=!0,r="";return e.signin.password.value||(t=!1,r="Please enter your password"),e.signin.email.value||(t=!1,r="Please enter your email"),{valid:t,reason:r}}function j(e){(async()=>{let r={email:e.signin.email.value,password:e.signin.password.value},n;try{n=await b(r)}catch(s){alert(s);return}let a;try{a=await H(n.id)}catch(s){alert(s);return}p({token:n,user:a}),window.location.href="/"})()}function J(e){let{valid:t,reason:r}=M(e);if(!t){alert(`could not submit registration beacuse ${r}`);return}(async()=>{let a={email:e.registration.email.value,password:e.registration.password.value,firstname:e.registration.first_name.value,lastname:e.registration.last_name.value},i;try{i=await L(a)}catch(_){alert(_);return}let s={email:a.email,password:a.password},l;try{l=await b(s)}catch(_){alert(_);return}p({token:l,user:i}),window.location.href="/"})()}function o(e){let{valid:t,reason:r}=M(e);O(t,r,e)}function y(e){let{valid:t,reason:r}=P(e);C(t,r,e)}function R(){let e=N();if(!e)throw new Error("inputs not initialized");e.registration.email.oninput=()=>o(e),e.registration.first_name.oninput=()=>o(e),e.registration.last_name.oninput=()=>o(e),e.registration.password.oninput=()=>o(e),e.registration.repeat_password.oninput=()=>o(e),e.signin.email.oninput=()=>y(e),e.signin.password.oninput=()=>y(e),e.registration.submit.onclick=()=>J(e),e.signin.submit.onclick=()=>j(e),o(e),y(e)}async function x(e,t){let r=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await r.json();return{status_code:r.status,body:n}}async function v(e){let t=await x("/article/list_all_articles",{auth_token:e});if(t.status_code!=200)throw new Error(t.body.message);return t.body.data}async function q(e){let t=await x("/article/post_article",e);if(t.status_code!=200)throw new Error(t.body.message);return t.body.data}function Y(){let e=document.getElementById("draft-preview-template"),t=document.getElementById("editor-app-view"),r=document.getElementById("draft-controlls-template");if(!e||!t||!r)return null;let a=r.cloneNode(!0).content,i=a.querySelector(".draft-controlls"),s=a.querySelector(".new-draft-button"),l=a.querySelector(".draft-render-list");return!i||!s||!l?(console.log("controlls not found"),null):(t.innerHTML="",t.appendChild(a),{draft_preview_template:e,editor_app_view:t,draft_controlls_template:r,draft_controlls:i,new_draft_button:s,draft_render_list:l})}async function $(e){let t=await v(e.token.id);return t.length>0&&(t=t.filter(r=>r.user_id==e.user.id)),console.log("test"),console.log(t),t}async function z(e){let t={auth_token:e.token.id,body:[],desc:"New draft",title:"New draft"};return await q(t)}async function h(){let e=u();if(!e)throw new Error("User not logged in");let t=Y();if(!t)throw new Error("Draft items not found, cant render page");let r=await $(e);console.log(r),t.new_draft_button.onclick=async()=>{let n=await z(e);window.location.href=`/editor?article-id=${n.id}`},console.log("editor draft view")}window.addEventListener("load",e=>{switch(w(),window.location.pathname){case"/editor":if(new URLSearchParams(window.location.search).get("draft-id")==null){console.log("no draft chosen"),h();break}break;case"/signin":R();break;default:break}});})();
//# sourceMappingURL=bundle.js.map
