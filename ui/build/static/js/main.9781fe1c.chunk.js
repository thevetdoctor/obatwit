(this.webpackJsonpui=this.webpackJsonpui||[]).push([[0],{50:function(e,t,n){},97:function(e,t,n){"use strict";n.r(t);var c=n(2),r=n.n(c),a=n(37),s=n.n(a),o=(n(50),n(3)),i=n(17),l=n(6),u=n(5),d=n.n(u),j=n(8),m=n(13),b=n.n(m),h=n(14),p=n.n(h),x=n(26),g="https://oba-twit.herokuapp.com",f=n(21),O=n.n(f),v=n(40),w=n(1);O.a.config();var y="865349714041-35tbv6kfmsdueb9cb018vukqpdul0shv.apps.googleusercontent.com";function S(e){var t=e.error,n=e.setError,r=(e.loading,e.setLoading),a=Object(c.useState)(JSON.parse(localStorage.getItem("signup"))),s=Object(o.a)(a,2),i=s[0],u=(s[1],"".concat(g,"/auth/").concat(i?"signup":"login")),d=Object(l.f)();return Object(w.jsx)("div",{children:Object(w.jsx)(x.GoogleLogin,{clientId:y,buttonText:i?"Signup with Google":"Login with Google",onSuccess:function(e){console.log("login suceeded"),I(!0,e.profileObj.email,null,u,t,n,r,d,e.profileObj.name,e.profileObj.imageUrl)},onFailure:function(e){console.log("login failed",e)},cookeiPolicy:"single_host_origin",style:{marginTop:"160px"}})})}var N=function(){return Object(w.jsx)("div",{children:Object(w.jsx)(x.GoogleLogout,{clientId:y,render:function(e){return Object(w.jsx)("span",{children:Object(w.jsx)(v.a,{size:25})})},buttonText:"Signout",onLogoutSuccess:function(e){console.log(e,"Logout suceeded")},style:{marginTop:"160px"}})})},k=n.p+"static/media/chat.7e8098f6.jpg",T=n(41);O.a.config();var I=function(){var e=Object(j.a)(d.a.mark((function e(){var t,n,c,r,a,s,o,i,l,u,j,m=arguments;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=m.length>0&&void 0!==m[0]&&m[0],n=m.length>1?m[1]:void 0,c=m.length>2&&void 0!==m[2]?m[2]:null,r=m.length>3?m[3]:void 0,m.length>4?m[4]:void 0,a=m.length>5?m[5]:void 0,s=m.length>6?m[6]:void 0,o=m.length>7?m[7]:void 0,i=m.length>8?m[8]:void 0,l=m.length>9?m[9]:void 0,localStorage.setItem("img",l),s(!0),t){e.next=18;break}return e.next=15,b()({method:"POST",url:"".concat(r),data:{email:n,password:c},headers:{"Content-Type":"application/json"}}).catch((function(e){var t,n;e.response?a(null===(t=e.response)||void 0===t||null===(n=t.data)||void 0===n?void 0:n.error):a("Please check your network")}));case 15:u=e.sent,e.next=21;break;case 18:return e.next=20,b()({method:"POST",url:"".concat(r),data:{email:n,password:"passs",auth:"google",name:i,imageUrl:l},headers:{"Content-Type":"application/json"}}).catch((function(e){a(e.response.data.error)}));case 20:u=e.sent;case 21:u&&u.data.success?(localStorage.setItem("email",n),localStorage.setItem("img",u.data.data.user.imageUrl),localStorage.setItem("username",null===(j=u.data.data.user)||void 0===j?void 0:j.username),localStorage.setItem("token",u.data.data.token),s(!1),o.push("/twits")):s(!1);case 22:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();function C(e){var t=Object(c.useState)(""),n=Object(o.a)(t,2),r=n[0],a=n[1],s=Object(c.useState)(""),i=Object(o.a)(s,2),u=i[0],d=i[1],j=Object(c.useState)(""),m=Object(o.a)(j,2),b=m[0],h=m[1],x=Object(c.useState)(!1),f=Object(o.a)(x,2),O=f[0],v=f[1],y=Object(c.useState)(JSON.parse(localStorage.getItem("signup"))),N=Object(o.a)(y,2),C=N[0],A=N[1],z=localStorage.getItem("token"),E=Object(l.f)(),F="".concat(g,"/auth/").concat(C?"signup":"login"),D=function(e){"email"===e.target.name?a(e.target.value):d(e.target.value)};return Object(c.useEffect)((function(){return z&&E.push("/twits"),function(){}}),[]),Object(w.jsxs)("div",{style:{fontFamily:"Roboto",fontWeight:"600"},className:"font-Roboto text-center align-items-center",children:[Object(w.jsxs)("p",{style:{fontFamily:"Architects Daughter",fontWeight:"300"},className:"italic text-center mb-2",children:[Object(w.jsxs)("span",{style:{fontSize:"1.8em"},className:"text-purple-900 font-bold",children:["Twitee",Object(w.jsx)("br",{})]}),Object(w.jsx)("span",{style:{fontSize:"1em"},children:".... Feel free, express yourself, network ...."})]}),Object(w.jsx)("h1",{style:{fontSize:20},className:"font-bold text-md mb-7",children:C?"Signup":"Login"}),Object(w.jsx)("input",{type:"text",name:"email",value:r,placeholder:"email",onChange:D,className:"px-3 rounded mb-5"}),Object(w.jsx)("br",{}),Object(w.jsx)("input",{type:"password",name:"password",value:u,placeholder:"password",onChange:D,className:"px-3 rounded mb-5"}),Object(w.jsx)("br",{}),Object(w.jsxs)("div",{style:{flexDirection:"column"},className:"flex",children:[b&&Object(w.jsx)("span",{className:"mb-2 text-red-600",children:b}),Object(w.jsx)("div",{children:O?Object(w.jsx)("span",{className:"m-auto",children:Object(w.jsx)(p.a,{type:"ThreeDots",color:"#00bfff",height:40,width:40})}):Object(w.jsx)("span",{style:{cursor:"pointer"},onClick:function(){return I(!1,r,u,F,b,h,v,E)},className:"hover:bg-green-900 bg-green-400 font-medium p-2 rounded w-6 h-3 text-white",children:C?"Signup":"Login"})}),Object(w.jsxs)("span",{className:"text-xs mt-4 mb-4",children:[C?"Already signed up ?":"Not registered ?",Object(w.jsx)("a",{href:"/",className:"focus:text-md underline",onClick:function(){C?(A(!1),localStorage.setItem("signup",!1)):(A(!0),localStorage.setItem("signup",!0))},children:C?" Login here":" Signup here!"})]})]}),!z&&Object(w.jsx)(S,{error:b,setError:h,loading:O,setLoading:v}),Object(w.jsx)("img",{src:k,alt:"CHat",className:"",style:{borderRadius:"5",width:"100"}}),Object(w.jsxs)("p",{className:"text-white-400 bold flex text-center",children:[Object(w.jsx)(T.a,{})," Twitee"]})]})}var A=n(22),z=n.n(A),E=n(18),F=n(16),D=n(44),U=n(45),L=n(43),P=n(42);function W(e){e.imageUrl;var t=e.setImageUrl,n=Object(c.useState)(""),r=Object(o.a)(n,2),a=(r[0],r[1]),s=Object(c.useState)(""),i=Object(o.a)(s,2),l=i[0],u=i[1],m=function(){var e=Object(j.a)(d.a.mark((function e(n){var c,r,s,o;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log(n.target),a("loading"),c=n.target.files[0],r=new FormData,"https://api.cloudinary.com/v1_1/thevetdoctor/image/upload",r.append("file",c),r.append("upload_preset","zunt8yrw"),e.next=9,fetch("https://api.cloudinary.com/v1_1/thevetdoctor/image/upload",{method:"POST",body:r});case 9:return s=e.sent,e.next=12,s.json();case 12:o=e.sent,u(o.secure_url),t(o.secure_url),a("done");case 16:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return Object(w.jsx)("div",{className:"flex",children:l?Object(w.jsx)("img",{src:l,alt:"post",style:{width:"20em",height:"9em"},className:"rounded"}):Object(w.jsx)(w.Fragment,{children:Object(w.jsxs)("label",{className:"ml-3 cursor-pointer flex",children:[Object(w.jsx)(P.a,{size:25})," "," ",Object(w.jsx)("span",{className:"ml-2",children:"Add Image"}),Object(w.jsx)("input",{type:"file",placeholder:"",accept:"image/*;capture=camera",capture:!0,className:"hidden",onChange:function(e){return m(e)}})]})})})}function R(e){var t=Object(c.useState)(localStorage.getItem("twitTitle")?localStorage.getItem("twitTitle"):""),n=Object(o.a)(t,2),r=n[0],a=n[1],s=Object(c.useState)(localStorage.getItem("twitText")?localStorage.getItem("twitText"):""),i=Object(o.a)(s,2),l=i[0],u=i[1],m=Object(c.useState)(localStorage.getItem("twitImage")?localStorage.getItem("twitImage"):""),h=Object(o.a)(m,2),x=h[0],f=h[1],O=Object(c.useState)(160),v=Object(o.a)(O,2),y=v[0],S=v[1],N=Object(c.useState)(""),k=Object(o.a)(N,2),T=k[0],I=k[1],C=Object(c.useState)(!1),A=Object(o.a)(C,2),z=A[0],E=A[1],F=localStorage.getItem("token"),D="".concat(g,"/twits/post"),U=function(e){"title"===e.target.name?(a(e.target.value),localStorage.setItem("twitTitle",e.target.value)):(u(e.target.value),S(160-e.target.value.length),localStorage.setItem("twitText",e.target.value))},L=function(){var t=Object(j.a)(d.a.mark((function t(){var n;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(r&&l){t.next=6;break}if(r){t.next=4;break}return I("Title is required"),t.abrupt("return");case 4:return I("Inputs required"),t.abrupt("return");case 6:return E(!0),t.next=9,b()({method:"POST",url:"".concat(D),data:{title:r,text:l,imageUrl:x},headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(F)}}).catch((function(e){console.log(e.response),I(e.response.data.error)}));case 9:(n=t.sent)&&n.data.success?(E(!1),localStorage.removeItem("twitTitle"),localStorage.removeItem("twitText"),e.setSync(!e.sync),e.showForm()):(E(!1),console.log("Error found"));case 11:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return Object(w.jsxs)("div",{className:"text-center sticky top-0 rounded pb-1 bg-blue-200 mt-3 pt-3 mb-1",children:[Object(w.jsx)("h1",{style:{fontSize:"1.5em"},className:"font-bold text-base mb-3",children:"New twit"}),Object(w.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",borderRadius:"20%"},children:[Object(w.jsx)("input",{type:"text",name:"title",value:r,placeholder:"title",onChange:U,className:"px-3 py-1 rounded mb-2",style:{width:"20em",border:"none"},required:!0}),Object(w.jsx)("textarea",{type:"textarea",name:"text",rows:4,cols:3,style:{width:"20em",height:"".concat(x?"5em":"13em"),border:"none"},maxLength:160,value:l,overflow:"hidden",placeholder:"Drop in your twit ...",onChange:U,className:"px-3 rounded mb-1 text-md text-gray-600",required:!0}),Object(w.jsxs)("span",{style:{display:"flex",width:"20em"},className:"justify-between px-3 mt-2 mb-2",children:[Object(w.jsx)(W,{imageUrl:x,setImageUrl:f}),Object(w.jsx)("span",{children:y})]})]}),Object(w.jsxs)("div",{style:{flexDirection:"column"},className:"flex mb-5",children:[T&&Object(w.jsx)("span",{className:"mb-2 text-red-800 text-md",children:T}),Object(w.jsx)("div",{className:"justify-items-center mt-2",children:z?Object(w.jsx)("span",{className:"m-auto",children:Object(w.jsx)(p.a,{type:"ThreeDots",color:"#00bfff",height:40,width:40})}):Object(w.jsxs)(w.Fragment,{children:[Object(w.jsx)("span",{style:{cursor:"pointer"},onClick:function(){return e.showForm()},className:"hover:bg-gray-900 bg-gray-400 font-medium p-1 rounded text-white",children:"Cancel"}),Object(w.jsx)("span",{style:{cursor:"pointer"},onClick:L,className:"hover:bg-green-900 bg-green-400 font-medium p-1 rounded text-white mx-2",children:"Send"})]})})]})]})}function q(e){var t=Object(c.useState)(""),n=Object(o.a)(t,2),r=n[0],a=n[1],s=Object(c.useState)(160),i=Object(o.a)(s,2),l=i[0],u=i[1],m=Object(c.useState)(""),h=Object(o.a)(m,2),x=h[0],f=h[1],O=Object(c.useState)(!1),v=Object(o.a)(O,2),y=v[0],S=v[1],N=localStorage.getItem("token"),k="".concat(g,"/comments"),T=function(){var t=Object(j.a)(d.a.mark((function t(){var n;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e.twitId){t.next=2;break}return t.abrupt("return");case 2:if(r){t.next=5;break}return f("Inputs required"),t.abrupt("return");case 5:return S(!0),t.next=8,b()({method:"POST",url:"".concat(k,"/").concat(e.twitId),data:{text:r},headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(N)}}).catch((function(e){console.log(e.response),f(e.response.data.error)}));case 8:n=t.sent,console.log(n),n&&n.data.success?(S(!1),e.setSync(!e.sync),e.showCommentForm()):(S(!1),console.log("Error found"));case 11:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return Object(w.jsxs)("div",{className:"text-center",children:[Object(w.jsx)("p",{style:{fontSize:20},className:"font-bold text-xs mb-3",children:"New Comment"}),Object(w.jsx)("textarea",{type:"textarea",name:"text",rows:5,cols:8,maxLength:160,style:{width:"15em",height:"8em"},value:r,placeholder:"Drop in your comment ...",onChange:function(e){"text"===e.target.name&&(a(e.target.value),u(160-e.target.value.length))},className:"px-3 rounded mb-5 h-20 text-md text-gray-600",required:!0}),Object(w.jsx)("br",{}),l,Object(w.jsxs)("div",{style:{flexDirection:"column"},className:"flex mb-5",children:[x&&Object(w.jsx)("span",{className:"mb-2 text-red-800 text-xs",children:x}),Object(w.jsxs)("div",{className:"justify-items-center",children:[Object(w.jsx)("span",{style:{cursor:"pointer"},onClick:function(){return e.showCommentForm()},className:"hover:bg-gray-900 bg-gray-400 font-medium p-1 rounded text-white",children:"Cancel"}),y?Object(w.jsx)("span",{className:"m-auto",children:Object(w.jsx)(p.a,{type:"ThreeDots",color:"#00bfff",height:40,width:40})}):Object(w.jsx)("span",{style:{cursor:"pointer"},onClick:T,className:"hover:bg-green-900 bg-green-400 font-medium p-1 rounded text-white mx-2",children:"Send"})]})]})]})}function H(){var e=Object(c.useState)(""),t=Object(o.a)(e,2),n=t[0],r=t[1],a=Object(c.useState)([]),s=Object(o.a)(a,2),i=s[0],u=s[1],m=Object(c.useState)(!1),h=Object(o.a)(m,2),p=h[0],x=h[1],f=Object(c.useState)(!1),O=Object(o.a)(f,2),v=O[0],y=O[1],S=Object(c.useState)(0),k=Object(o.a)(S,2),T=k[0],I=k[1],C=localStorage.getItem("email")?localStorage.getItem("email"):"",A=localStorage.getItem("img")?localStorage.getItem("img"):"",z=Object(l.f)(),E=localStorage.getItem("token"),U="".concat(g,"/twits"),P=function(){x(!p)},W=function(){var e=Object(j.a)(d.a.mark((function e(t,n,c){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b()({method:t,url:n,data:c,headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(E)}}).catch((function(e){e.isAxiosError&&console.log(e.isAxiosError)}));case 2:y(!v);case 3:case"end":return e.stop()}}),e)})));return function(t,n,c){return e.apply(this,arguments)}}(),q=function(){var e=Object(j.a)(d.a.mark((function e(){var t;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(E){e.next=3;break}return console.log("Not loggedin"),e.abrupt("return");case 3:return e.next=5,b()({method:"GET",url:"".concat(U),headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(E)}}).catch((function(e){e.isAxiosError&&console.log(e.isAxiosError)}));case 5:(t=e.sent)&&t.data.success?u(t.data.data.map((function(e){return e.formActive=!1,e}))):(console.log("Error found"),r("Error found"));case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),H=function(){var e=Object(j.a)(d.a.mark((function e(){var t;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b()({method:"GET",url:"".concat(g,"/auth/users"),headers:{"Content-Type":"application/json"}}).catch((function(e){e.isAxiosError&&console.log(e.isAxiosError)}));case 2:(t=e.sent)&&t.data.success?I(t.data.data.count):(console.log("Error found"),r("Error found"));case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),B=function(){console.log("checking open forms",i.filter((function(e){return e.formActive})));var e=i.map((function(e){return e.formActive=!1,e}));u(e),console.log("closing open forms",i.filter((function(e){return e.formActive})))};return Object(c.useEffect)((function(){return E||z.push("/"),H(),function(){console.log("cleanup twits 1")}}),[]),Object(c.useEffect)(Object(j.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return q(),e.abrupt("return",(function(){console.log("cleanup twits 2")}));case 2:case"end":return e.stop()}}),e)}))),[v]),Object(w.jsxs)("div",{style:{fontFamily:"Roboto",fontWeight:"600",height:"90vh"},className:"mb-5 p-3",children:[Object(w.jsx)("span",{style:{cursor:"pointer",borderRadius:"50%"},className:"fixed bottom-16 right-4 bg-green-500 p-4 text-white",children:Object(w.jsx)(L.a,{size:25,onClick:P})}),p&&Object(w.jsx)(R,{error:n,showForm:P,sync:v,setSync:y}),!p&&Object(w.jsxs)("div",{children:[Object(w.jsxs)("p",{style:{fontFamily:"Architects Daughter",fontWeight:"300"},className:"italic text-center mb-2",children:[Object(w.jsxs)("span",{style:{fontSize:"1.8em"},className:"text-purple-900 font-bold",children:["Twitee",Object(w.jsx)("br",{})]}),Object(w.jsx)("span",{style:{fontSize:"1em"},children:".... Feel free, express yourself, network ...."})]}),Object(w.jsxs)("div",{className:"py-2 px-2 rounded mb-4 flex justify-between",children:["null"!==A?Object(w.jsx)("span",{children:Object(w.jsx)("img",{src:A,alt:"Profile",style:{width:"30px",height:"30px",borderRadius:"50%"}})}):Object(w.jsx)("span",{className:"text-left",children:Object(w.jsx)(F.a,{size:25})}),T>0&&Object(w.jsxs)("span",{className:"text-left flex",children:[Object(w.jsx)(D.a,{size:25}),T]}),Object(w.jsx)("span",{style:{cursor:"pointer"},className:"text-right",onClick:function(){localStorage.removeItem("token"),z.push("/")},children:Object(w.jsx)(N,{})})]}),Object(w.jsx)("div",{className:"",children:i.sort((function(e,t){return new Date(t.createdAt).getTime()-new Date(e.createdAt).getTime()})).map((function(e,t){return Object(w.jsx)(_,{twit:e,email:C,apiCallHook:W,baseUrl:g,frontendUrl:"http://localhost:3000/twits",sync:v,setSync:y,showForm:P,formActive:p,checkOpenForms:B},t)}))})]})]})}var _=function(e){var t=e.twit,n=t.id,r=t.title,a=t.text,s=t.imageUrl,i=t.twits,l=t.likes,u=t.comments,m=t.createdAt,b=t.updatedAt,h=e.email,p=e.apiCallHook,x=e.baseUrl,g=e.frontendUrl,f=e.sync,O=e.setSync,v=e.checkOpenForms,y=Object(c.useState)(!1),S=Object(o.a)(y,2),N=S[0],k=S[1],T=Object(c.useState)(!1),I=Object(o.a)(T,2),C=I[0],A=I[1],D=Object(c.useState)(!1),L=Object(o.a)(D,2),P=L[0],W=L[1],R=Object(c.useState)(!1),H=Object(o.a)(R,2),_=H[0],J=H[1],M=Object(c.useState)(a),$=Object(o.a)(M,2),K=$[0],Q=$[1],V=Object(c.useState)(!1),X=Object(o.a)(V,2),Y=X[0],Z=X[1],ee=Object(c.useState)(!1),te=Object(o.a)(ee,2),ne=te[0],ce=te[1],re=function(){Z(!Y),Q(a)},ae=l.filter((function(e){return e.isLiked})).length,se=function(){k(!N),e.twit.formActive=!N},oe=function(){var e=Object(j.a)(d.a.mark((function e(t){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!("clipboard"in navigator)){e.next=8;break}return console.log("Link copied"),ce(!0),e.next=5,navigator.clipboard.writeText(t);case 5:return e.abrupt("return",e.sent);case 8:console.log("Link copy is not supported");case 9:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return Object(w.jsxs)("div",{id:"".concat(n),style:{fontSize:"1.1em"},className:"shadow-md border-2 border-solid border-gray-300 rounded p-5 mb-2",children:[Object(w.jsxs)("p",{className:"flex justify-between mb-2",children:[Object(w.jsx)("span",{}),Object(w.jsx)("span",{style:{fontWeight:"600",fontFamily:"Architects Daughter"},className:"text-md self-center",children:r}),Object(w.jsx)("span",{className:ne?"mr-2 mb-1 text-xs self-end":"mr-2 mb-1 invisible text-xs self-end",children:"copied"})]}),Object(w.jsxs)("span",{className:"text-xs mb-5 flex justify-between",children:[Object(w.jsx)(z.a,{fromNow:!0,children:m}),Object(w.jsxs)("span",{className:"flex",children:[h===i.email&&!Y&&Object(w.jsx)("span",{className:"cursor-pointer mr-3 hover:bg-blue-400 text-black hover:text-white p-2 -mt-2 rounded-full",onClick:function(){return re()},children:Object(w.jsx)(U.a,{size:20})}),Object(w.jsx)("span",{className:ne?"flex-col hover:bg-blue-400 rounded-full p-2 text-white bg-blue-900 cursor-pointer -mt-2 mr-3":"rounded-full hover:bg-blue-400 p-2 cursor-pointer -mt-2 mr-3",onClick:function(){return oe("".concat(g,"/#").concat(n)),void setTimeout((function(){ce(!1)}),1e3)},children:Object(w.jsx)(E.c,{size:20})})]})]}),Y&&Object(w.jsxs)("div",{className:"mb-5",children:[Object(w.jsx)("textarea",{className:"border-gray-200 border-2 p-2 mb-2 rounded bg-white-300 focus:outline-none",style:{width:"100%"},cols:3,rows:4,maxLength:160,value:K,onChange:function(e){Q(e.target.value)},required:!0}),Object(w.jsx)("br",{}),C?Object(w.jsx)(G,{height:20,width:20,color:"#00bfff"}):Object(w.jsxs)(w.Fragment,{children:[Object(w.jsx)("span",{className:"cursor-pointer bg-gray-500 p-2 m-2 text-white rounded hover:bg-gray-400",onClick:function(){return re()},children:"Cancel"}),Object(w.jsx)("span",{className:"cursor-pointer bg-green-600 p-2 mb-2 text-white rounded hover:bg-green-400 hover:text-black",onClick:function(){return p("PATCH","".concat(x,"/twits/").concat(n),{text:K}),A(!0),void setTimeout((function(){A(!1),Z(!1)}),1e3)},children:"Update Story"})]})]}),!Y&&Object(w.jsxs)("div",{style:{fontFamily:"Architects Daughter",fontWeight:"500"},className:"p-3",children:[a,Object(w.jsx)("br",{}),new Date(b).getTime()-new Date(m).getTime()>0&&Object(w.jsxs)("span",{className:"text-xs",children:["Updated ",Object(w.jsx)(z.a,{fromNow:!0,children:b})]})]}),Object(w.jsx)("span",{children:s&&Object(w.jsx)("img",{src:s,width:"100%",alt:"imgurl",className:"rounded"})}),Object(w.jsxs)("div",{style:{fontSize:"0.8em"},className:"text-xs text-gray-800 flex mt-2",children:[Object(w.jsxs)("span",{className:"mx-2 flex",children:[i.imageUrl?Object(w.jsx)("span",{className:"mr-1",children:Object(w.jsx)("img",{src:i.imageUrl,alt:"Profile",style:{width:"20px",height:"20px",borderRadius:"50%"}})}):Object(w.jsx)(E.b,{size:15}),h===i.email?"Me":i.username]}),Object(w.jsx)("span",{style:{cursor:"pointer"},className:"mx-2 flex",onClick:function(){return W(!0),setTimeout((function(){W(!1)}),1e3),void p("POST","".concat(x,"/likes/like/").concat(n))},children:P?Object(w.jsx)(G,{height:20,width:20,color:"#00bfff"}):Object(w.jsxs)(w.Fragment,{children:[Object(w.jsx)(F.c,{color:ae>0?"blue":"gray",size:15}),Object(w.jsx)("span",{className:"text-xs",children:ae})]})}),Object(w.jsx)("span",{style:{cursor:"pointer"},className:"mx-2 flex",onClick:function(){return v(),void se()},children:Object(w.jsx)(E.a,{size:15})}),h===i.email&&Object(w.jsx)("span",{style:{cursor:"pointer"},className:"mx-2 flex hover:text-red-800",onClick:function(){return J(!0),setTimeout((function(){J(!1)}),1e3),void p("DELETE","".concat(x,"/twits/").concat(n))},children:_?Object(w.jsx)(G,{height:20,width:20,color:"#00bfff"}):Object(w.jsx)(F.b,{size:15,color:"red"})})]}),N&&Object(w.jsx)(q,{twitId:n,showCommentForm:se,sync:f,setSync:O}),u.length>0&&Object(w.jsx)("div",{className:"mt-2 rounded",children:u.filter((function(e){return!e.isDeleted})).map((function(e,t){return Object(w.jsx)(B,{comment:e,apiCallHook:p,email:h},t)}))})]})},B=function(e){var t=e.comment,n=t.id,r=t.text,a=t.usercomments,s=t.likecomments,i=t.createdAt,l=e.email,u=e.apiCallHook,d=Object(c.useState)(!1),j=Object(o.a)(d,2),m=j[0],b=j[1],h=Object(c.useState)(!1),p=Object(o.a)(h,2),x=p[0],f=p[1],O=null===s||void 0===s?void 0:s.filter((function(e){return e.isLiked})).length;return Object(w.jsxs)("div",{className:"bg-blue-200 mb-2 p-2 rounded",children:[Object(w.jsx)("span",{className:"text-xs mb-2",children:Object(w.jsx)(z.a,{fromNow:!0,children:i})}),Object(w.jsx)("p",{style:{fontFamily:"Architects Daughter",fontWeight:"500",fontSize:"18px"},className:"p-3",children:r}),Object(w.jsxs)("span",{style:{fontSize:"0.8em"},className:"mx-2 flex items-justify text-xs mt-2",children:[a.imageUrl?Object(w.jsx)("span",{className:"mr-1",children:Object(w.jsx)("img",{src:a.imageUrl,alt:"Profile",style:{width:"20px",height:"20px",borderRadius:"50%"}})}):Object(w.jsx)(E.b,{size:15}),Object(w.jsx)("span",{className:"",children:l===a.email?"Me":a.username}),Object(w.jsx)("span",{style:{cursor:"pointer"},className:"mx-2 flex",onClick:function(){return b(!0),setTimeout((function(){b(!1)}),1e3),void u("POST","".concat(g,"/likecomments/like/").concat(n))},children:m?Object(w.jsx)(G,{height:20,width:20,color:"white"}):Object(w.jsxs)(w.Fragment,{children:[Object(w.jsx)(F.c,{color:O>0?"blue":"gray",size:15}),Object(w.jsx)("span",{className:"text-xs",children:O})]})}),l===a.email&&Object(w.jsx)("span",{style:{cursor:"pointer"},className:"mx-2 flex hover:text-red-800",onClick:function(){return f(!0),setTimeout((function(){b(!1)}),1e3),void u("DELETE","".concat(g,"/comments/").concat(n))},children:x?Object(w.jsx)(G,{height:20,width:20,color:"white"}):Object(w.jsx)(F.b,{size:15,color:"red"})})]})]})},G=function(e){var t=e.height,n=e.width,c=e.color;return Object(w.jsx)("span",{className:"m-auto",children:Object(w.jsx)(p.a,{type:"ThreeDots",color:c,height:t,width:n})})};var J=function(){var e=Object(c.useState)(JSON.parse(localStorage.getItem("loggedIn"))),t=Object(o.a)(e,2),n=(t[0],t[1],Object(c.useState)(JSON.parse(localStorage.getItem("signup"))||!1)),r=Object(o.a)(n,2),a=(r[0],r[1],localStorage.getItem("username"));function s(){var e=a?"Hello, ".concat(a):"Hello !";new Notification(e,{body:"Have you checked Twitee today?",icon:"https://res.cloudinary.com/thevetdoctor/image/upload/v1599332593/g1rozhabxswegvhp59h3.jpg"}),setTimeout(s,108e5)}return Notification.requestPermission().then((function(e){"granted"===e&&s()})),Object(w.jsx)(i.a,{children:Object(w.jsxs)(l.c,{children:[Object(w.jsx)(l.a,{exact:!0,path:"/",component:C}),Object(w.jsx)(l.a,{exact:!0,path:"/twits",component:H})]})})},M=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function $(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://cra.link/PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}s.a.render(Object(w.jsx)(r.a.StrictMode,{children:Object(w.jsx)(J,{})}),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("","/service-worker.js");M?(!function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(n){var c=n.headers.get("content-type");404===n.status||null!=c&&-1===c.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):$(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://cra.link/PWA")}))):$(t,e)}))}}()}},[[97,1,2]]]);
//# sourceMappingURL=main.9781fe1c.chunk.js.map