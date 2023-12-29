var e,t,o,r,s,a,n=require("axios");function u(e){return e&&e.__esModule?e.default:e}const c=function(){let e=document.querySelector(".alert");null==e||e.parentElement.removeChild(e)},l=function(e,t){c();let o=`<div class="alert alert--${e}">${t}</div>`;document.querySelector("body").insertAdjacentHTML("afterbegin",o),setTimeout(c,5e3)},d=async function(e,t){try{let o=await u(n)({method:"POST",url:"/api/v1/users/login",data:{email:e,password:t}});"success"===o.data.status&&(l("success","Logged in succcessfully!!"),window.setTimeout(function(){location.assign("/")},1500))}catch(e){l("error",e.response.data.message)}},i=async function(){try{await u(n)("/api/v1/users/logout"),location.reload(!0),location.assign("/")}catch(e){l("error","Error on Logging out. Try again!")}},m=async function(e,t){try{let o=await u(n)({method:"PATCH",url:"password"===t?"/api/v1/users/updateMyPassword":"/api/v1/users/updateMe",data:e});"success"===o.data.status&&(l("success",`${t.toUpperCase()} updated successfully!`),location.assign("/me"))}catch(e){l("error",e.response.data.message)}},p=async e=>{let t=Stripe("pk_test_51ORuzoSJChrrOJZcfGJUd3FLRQbWABXd50XJ8GmQvKjWWjnofU6QaSIbeO0YF7z640vAmVtUlwQyTXPbtzcS93VX0004XpYfVh");try{let o=await u(n)(`/api/v1/bookings/checkout-session/${e}`);console.log(o),await t.redirectToCheckout({sessionId:o.data.session.id})}catch(e){console.log(e),l("error",e)}},v=async function(e,t,o,r){try{let s=await u(n)({method:"POST",url:"/api/v1/users/signup",data:{name:e,email:t,password:o,passwordConfirm:r}});"success"===s.data.status&&(l("success","Sign up succcessfully!!"),window.setTimeout(function(){location.assign("/")},100))}catch(e){l("error",e.response.data.message)}};null===(e=document.querySelector(".form-login"))||void 0===e||e.addEventListener("submit",function(e){e.preventDefault(),d(document.querySelector("#email").value,document.querySelector("#password").value)}),null===(t=document.querySelector(".form-signup"))||void 0===t||t.addEventListener("submit",function(e){e.preventDefault();let t=document.querySelector("#username").value;v(t,document.querySelector("#email").value,document.querySelector("#password").value,document.querySelector("#confirm-password").value)}),null===(o=document.querySelector("#log-out"))||void 0===o||o.addEventListener("click",function(){i()}),null===(r=document.querySelector(".form-user-data"))||void 0===r||r.addEventListener("submit",function(e){e.preventDefault();let t=new FormData;t.append("name",document.querySelector("#name").value),t.append("email",document.querySelector("#email").value),t.append("photo",document.querySelector("#photo").files[0]),m(t,"data")}),null===(s=document.querySelector(".form-user-password"))||void 0===s||s.addEventListener("submit",function(e){e.preventDefault(),document.querySelector(".btn--save-password").textContent="Updating...",m({passwordCurrent:document.querySelector("#password-current").value,password:document.querySelector("#password").value,passwordConfirm:document.querySelector("#password-confirm").value},"password"),document.querySelector(".btn--save-password").textContent="Save Password",document.querySelector("#password-current").value="",document.querySelector("#password").value="",document.querySelector("#password-confirm").value=""}),null===(a=document.getElementById("book-tour"))||void 0===a||a.addEventListener("click",function(e){e.target.textContent="Processing...";let{tourId:t}=e.target.dataset;p(t)});
//# sourceMappingURL=index.js.map
