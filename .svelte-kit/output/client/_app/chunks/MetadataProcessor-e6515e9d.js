import{S as t,i as e,s as n,e as o,c as a,b as i,f as s,d as r,k as d,l,n as c,M as p,E as h,G as m,z as u,a2 as y,a1 as g,a3 as f}from"./vendor-df840aab.js";const{document:v}=g;function M(t){let e,n;return{c(){e=o("meta"),this.h()},l(t){e=a(t,"META",{name:!0,content:!0}),this.h()},h(){i(e,"name","keywords"),i(e,"content",n=t[0].keywords.join(", "))},m(t,n){s(t,e,n)},p(t,o){1&o&&n!==(n=t[0].keywords.join(", "))&&i(e,"content",n)},d(t){t&&r(e)}}}function $(t){let e,n,p,h,m;return{c(){e=o("meta"),p=d(),m=l(),this.h()},l(t){e=a(t,"META",{property:!0,content:!0}),p=c(t),m=l(),this.h()},h(){i(e,"property","og:image"),i(e,"content",n=t[0].image),h=new f(m)},m(n,o){s(n,e,o),s(n,p,o),h.m(t[2],n,o),s(n,m,o)},p(t,o){1&o&&n!==(n=t[0].image)&&i(e,"content",n),4&o&&h.p(t[2])},d(t){t&&r(e),t&&r(p),t&&r(m),t&&h.d()}}}function w(t){let e,n,s,d,c,u,y,g,w,j,k,A,E;v.title=e=t[0].title;let P=t[0].keywords&&M(t),S=t[0].image&&$(t);return{c(){n=o("meta"),c=l(),P&&P.c(),u=o("meta"),g=o("meta"),w=o("meta"),k=o("meta"),S&&S.c(),E=l(),this.h()},l(t){const e=p('[data-svelte="svelte-g9v785"]',v.head);n=a(e,"META",{name:!0,content:!0}),c=l(),P&&P.l(e),u=a(e,"META",{name:!0,content:!0}),g=a(e,"META",{property:!0,content:!0}),w=a(e,"META",{property:!0,content:!0}),k=a(e,"META",{property:!0,content:!0}),S&&S.l(e),E=l(),e.forEach(r),this.h()},h(){i(n,"name","description"),i(n,"content",s=t[0].description),d=new f(c),i(u,"name","twitter:card"),i(u,"content",y=t[0].description),i(g,"property","og:url"),i(g,"content",t[1]),i(w,"property","og:title"),i(w,"content",j=t[0].title),i(k,"property","og:description"),i(k,"content",A=t[0].description)},m(e,o){h(v.head,n),d.m(t[3],v.head),h(v.head,c),P&&P.m(v.head,null),h(v.head,u),h(v.head,g),h(v.head,w),h(v.head,k),S&&S.m(v.head,null),h(v.head,E)},p(t,[o]){1&o&&e!==(e=t[0].title)&&(v.title=e),1&o&&s!==(s=t[0].description)&&i(n,"content",s),t[0].keywords?P?P.p(t,o):(P=M(t),P.c(),P.m(u.parentNode,u)):P&&(P.d(1),P=null),1&o&&y!==(y=t[0].description)&&i(u,"content",y),2&o&&i(g,"content",t[1]),1&o&&j!==(j=t[0].title)&&i(w,"content",j),1&o&&A!==(A=t[0].description)&&i(k,"content",A),t[0].image?S?S.p(t,o):(S=$(t),S.c(),S.m(E.parentNode,E)):S&&(S.d(1),S=null)},i:m,o:m,d(t){r(n),r(c),t&&d.d(),P&&P.d(t),r(u),r(g),r(w),r(k),S&&S.d(t),r(E)}}}function j(t){let e=(null==t?void 0:t.image)||null;return e&&!e.startsWith("https://joshuacastor.me")&&(e=`https://joshuacastor.me/${e.startsWith("/")?e.slice(1):e}`),{title:`${(null==t?void 0:t.title)||"Default Page Name"} | Blog Post on joshuacastor.me`,description:(null==t?void 0:t.description)||"Default Page Description",author:(null==t?void 0:t.author)||"Joshua Castor",keywords:Array.isArray(null==t?void 0:t.keywords)&&t.keywords.length>0?t.keywords:null,image:e,datePublished:(null==t?void 0:t.datePublished)||new Date,dateModified:(null==t?void 0:t.dateModified)||null}}function k(t,e,n){let{metadata:o=j()}=e,a=j(),i="",s="";let r=!1;return u((()=>{n(1,i=`https://joshuacastor.me${location.pathname}`),n(5,r=!0)})),y((()=>{const t=Array.from(document.querySelectorAll('script[type="application/ld+json"]'));t.length>1&&t.reverse().slice(1).forEach((t=>{t.remove()}))})),t.$$set=t=>{"metadata"in t&&n(4,o=t.metadata)},t.$$.update=()=>{if(49&t.$$.dirty)if(n(0,a=j(o)),r&&n(1,i=`https://joshuacastor.me${location.pathname}`),a.image){const t=JSON.stringify({"@context":"https://schema.org/","@type":"BlogPosting",headline:a.title,name:a.title,image:[a.image],author:{"@type":"Person",name:a.author},description:a.description,datePublished:a.datePublished.toISOString(),dateModified:(null==a?void 0:a.dateModified)?a.dateModified.toISOString():void 0},null,2),e="<",o=">";n(2,s=[`${e}script type="application/ld+json"${o}`,t,`${e}/script${o}`].join("\n"))}else n(2,s="")},[a,i,s,'<link rel="canonical" href="url">',o,r]}class A extends t{constructor(t){super(),e(this,t,k,w,n,{metadata:4})}}export{A as M};
