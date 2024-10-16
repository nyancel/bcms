"use strict";(()=>{var c="BCMS_USERTS_LOCALTOKEN",g="BCMS_USERTS_LOCALUSER";function l(){let e=localStorage.getItem(c),t=localStorage.getItem(g);if(!e||!t)return null;let n=JSON.parse(e),a=JSON.parse(t);return!n||!a?null:{token:n,user:a}}function T(){return localStorage.removeItem(g),localStorage.removeItem(c),!0}function p(e){let t=JSON.stringify(e.token),n=JSON.stringify(e.user);return localStorage.setItem(c,t),localStorage.setItem(g,n),!0}async function m(e,t){let n=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),a=await n.json();return{status_code:n.status,body:a}}async function b(e){let t=await m("/user/login",e);if(t.status_code!=200)throw new Error(t.body.message);return t.body.data}async function M(e){let t=await m("/user/logout",{auth_token:e});if(t.status_code!=200)throw new Error(t.body.message);return!0}async function L(e){let t=await m("/user/register",e);if(t.status_code!=200)throw new Error(t.body.message);return t.body.data}async function H(e){let t=await m("/user/who",{auth_token:e});if(t.status_code!=200)throw new Error(t.body.message);return t.body.data}function A(){let e=document.querySelector(".user-details-login-template"),t=document.querySelector(".user-details-profile-template"),n=document.querySelector(".user-details-container");return!e||!t||!n?null:{login_template:e,profile_template:t,details_container:n}}function N(e){let t=e.querySelector("#user-profile-first-name"),n=e.querySelector("#user-profile-last-name"),a=e.querySelector("#user-profile-logout-button");if(!t||!n||!a)throw new Error("lastname_element not found");return{firstname_element:t,lastname_element:n,logout_button:a}}function O(){let e=l();if(!e)throw new Error("No local user-data");M(e.token.id),T(),w()}function P(e,t){t.details_container.innerHTML="";let a=t.profile_template.cloneNode(!0).content,r=N(a);r.firstname_element.innerHTML=e.user.firstname,r.lastname_element.innerHTML=e.user.lastname,r.logout_button.onclick=()=>O(),t.details_container.appendChild(a)}function B(e){let t=e.login_template.cloneNode(!0);e.details_container.innerHTML="",e.details_container.appendChild(t.content)}async function w(){let e=l(),t=A();if(!t)throw new Error("html elements not loaded");if(!e){B(t);return}P(e,t)}function C(){let e=document.querySelector("#user-register-first-name-input"),t=document.querySelector("#user-register-last-name-input"),n=document.querySelector("#user-register-email-input"),a=document.querySelector("#user-register-password-input"),r=document.querySelector("#user-register-password-repeat-input"),o=document.querySelector("#user-register-submitt-button"),s=document.querySelector("#user-signin-email-input"),i=document.querySelector("#user-signin-password-input"),d=document.querySelector("#user-signin-submitt-button");return!e||!t||!n||!a||!r||!o||!s||!i||!d?null:{registration:{email:n,first_name:e,last_name:t,password:a,repeat_password:r,submit:o},signin:{email:s,password:i,submit:d}}}function J(e,t,n){if(!e){n.registration.submit.innerHTML=t??"invalid registration-data",n.registration.submit.classList.toggle("bg-green-600",!1),n.registration.submit.classList.toggle("bg-gray-600",!0);return}n.registration.submit.innerHTML="Register",n.registration.submit.classList.toggle("bg-gray-600",!1),n.registration.submit.classList.toggle("bg-green-600",!0)}function F(e,t,n){if(!e){n.signin.submit.innerHTML=t??"invalid registration-data",n.signin.submit.classList.toggle("bg-blue-200",!1),n.signin.submit.classList.toggle("text-white",!0),n.signin.submit.classList.toggle("bg-gray-600",!0);return}n.signin.submit.innerHTML="Sign in",n.signin.submit.classList.toggle("bg-gray-600",!1),n.signin.submit.classList.toggle("text-white",!1),n.signin.submit.classList.toggle("bg-blue-200",!0)}function x(e){let t=!0,n="";return e.registration.password.value!=e.registration.repeat_password.value&&(t=!1,n="passwords dont match"),e.registration.first_name.value||(t=!1,n="missing first name"),e.registration.email.value||(t=!1,n="missing email"),e.registration.last_name.value||(t=!1,n="missing last name"),e.registration.password.value||(t=!1,n="missing password"),{valid:t,reason:n}}function K(e){let t=!0,n="";return e.signin.password.value||(t=!1,n="Please enter your password"),e.signin.email.value||(t=!1,n="Please enter your email"),{valid:t,reason:n}}function $(e){(async()=>{let n={email:e.signin.email.value,password:e.signin.password.value},a;try{a=await b(n)}catch(s){alert(s);return}let r;try{r=await H(a.id)}catch(s){alert(s);return}p({token:a,user:r}),window.location.href="/"})()}function Y(e){let{valid:t,reason:n}=x(e);if(!t){alert(`could not submit registration beacuse ${n}`);return}(async()=>{let r={email:e.registration.email.value,password:e.registration.password.value,firstname:e.registration.first_name.value,lastname:e.registration.last_name.value},o;try{o=await L(r)}catch(_){alert(_);return}let s={email:r.email,password:r.password},i;try{i=await b(s)}catch(_){alert(_);return}p({token:i,user:o}),window.location.href="/"})()}function u(e){let{valid:t,reason:n}=x(e);J(t,n,e)}function y(e){let{valid:t,reason:n}=K(e);F(t,n,e)}function R(){let e=C();if(!e)throw new Error("inputs not initialized");e.registration.email.oninput=()=>u(e),e.registration.first_name.oninput=()=>u(e),e.registration.last_name.oninput=()=>u(e),e.registration.password.oninput=()=>u(e),e.registration.repeat_password.oninput=()=>u(e),e.signin.email.oninput=()=>y(e),e.signin.password.oninput=()=>y(e),e.registration.submit.onclick=()=>Y(e),e.signin.submit.onclick=()=>$(e),u(e),y(e)}async function q(e,t){let n=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),a=await n.json();return{status_code:n.status,body:a}}async function v(e){let t=await q("/article/list_all_articles",{auth_token:e});if(t.status_code!=200)throw new Error(t.body.message);return t.body.data}async function k(e){let t=await q("/article/post_article",e);if(t.status_code!=200)throw new Error(t.body.message);return t.body.data}function W(e){let t=e.querySelector(".delete-draft-button"),n=e.querySelector(".edit-draft-button"),a=e.querySelector(".draft-render-title"),r=e.querySelector(".draft-render-description");return!t||!n||!a||!r?null:{delete_draft_button:t,edit_draft_button:n,draft_render_title:a,draft_render_description:r}}function Q(){let e=document.getElementById("draft-preview-template"),t=document.getElementById("editor-app-view"),n=document.getElementById("draft-controlls-template");if(!e||!t||!n)return null;let r=n.cloneNode(!0).content,o=r.querySelector(".draft-controlls"),s=r.querySelector(".new-draft-button"),i=r.querySelector(".draft-render-list");return!o||!s||!i?(console.log("controlls not found"),null):(t.innerHTML="",t.appendChild(r),{draft_preview_template:e,editor_app_view:t,draft_controlls_template:n,draft_controlls:o,new_draft_button:s,draft_render_list:i})}async function V(e){let t=await v(e.token.id);return t.length>0&&(t=t.filter(n=>n.user_id==e.user.id)),t}async function X(e){let t={auth_token:e.token.id,body:[],desc:"New draft",title:"New draft"};return await k(t)}async function Z(e,t){console.log("Not implemented yet")}function ee(e,t,n){let a=t.editor_app_view;e.forEach(r=>{let s=t.draft_preview_template.cloneNode(!0).content,i=W(s);if(!i)throw new Error("could not instantiate draft template");i.draft_render_title.innerHTML=r.title,i.draft_render_description.innerHTML=r.desc,i.edit_draft_button.onclick=()=>{window.location.href=`/editor?article-id=${r.id}`},i.delete_draft_button.onclick=()=>{Z(r.id,n)},a.appendChild(s)})}async function h(){let e=l();if(!e)throw new Error("User not logged in");let t=Q();if(!t)throw new Error("Draft items not found, cant render page");let n=await V(e);console.log(n),n.length>0&&ee(n,t,e),t.new_draft_button.onclick=async()=>{let a=await X(e);window.location.href=`/editor?article-id=${a.id}`}}async function ne(e,t){let n=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});return{status_code:n.status,body:await n.json()}}async function I(e){let t=await ne("/media/fetch_media_full",e);if(t.status_code!=200)throw new Error(t.body.message);return t.body.data}var E=l()?.token.id;typeof E!="string"&&(E="missing");var ae="muG523y5o1tR-17290772079567983";async function re(){return(await D()).instances[0].instance_id}async function U(){await D(),console.log(await re())}async function D(){return await I({auth_token:E,media_ID:ae})}window.addEventListener("load",e=>{switch(w(),window.location.pathname){case"/editor":if(new URLSearchParams(window.location.search).get("draft-id")==null){h();break}break;case"/signin":R();break;case"/media/media_test":U();break;default:break}});})();
//# sourceMappingURL=bundle.js.map
