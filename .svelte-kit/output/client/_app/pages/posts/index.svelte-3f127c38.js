import{S as a,i as s,s as o,K as t,k as r,e as n,t as e,M as c,d as l,n as u,c as i,a as h,g as d,b as f,f as m,E as p,L as g,v as k,r as v,G as E,j as b,m as P,o as $,w as L}from"../../chunks/vendor-df840aab.js";import{d as j}from"../../chunks/singletonGetters-ff01b479.js";import{g as x,P as C}from"../../chunks/PostList-3dd86d1e.js";import"../../chunks/DateTime-99aa3d5e.js";function I(a){let s,o,t,c,f,g,k=a[2].message+"";return{c(){s=n("section"),o=n("p"),t=e("An error occurred loading the post data."),c=r(),f=n("p"),g=e(k)},l(a){s=i(a,"SECTION",{});var r=h(s);o=i(r,"P",{});var n=h(o);t=d(n,"An error occurred loading the post data."),n.forEach(l),c=u(r),f=i(r,"P",{});var e=h(f);g=d(e,k),e.forEach(l),r.forEach(l)},m(a,r){m(a,s,r),p(s,o),p(o,t),p(s,c),p(s,f),p(f,g)},p:E,i:E,o:E,d(a){a&&l(s)}}}function N(a){let s,o,t,c,f,g;return f=new C({props:{posts:a[1],postHeaderLevel:3}}),{c(){s=n("section"),o=n("h2"),t=e("Post List"),c=r(),b(f.$$.fragment)},l(a){s=i(a,"SECTION",{});var r=h(s);o=i(r,"H2",{});var n=h(o);t=d(n,"Post List"),n.forEach(l),c=u(r),P(f.$$.fragment,r),r.forEach(l)},m(a,r){m(a,s,r),p(s,o),p(o,t),p(s,c),$(f,s,null),g=!0},p:E,i(a){g||(k(f.$$.fragment,a),g=!0)},o(a){v(f.$$.fragment,a),g=!1},d(a){a&&l(s),L(f)}}}function S(a){let s,o,t;return{c(){s=n("section"),o=n("p"),t=e("Loading post data...")},l(a){s=i(a,"SECTION",{});var r=h(s);o=i(r,"P",{});var n=h(o);t=d(n,"Loading post data..."),n.forEach(l),r.forEach(l)},m(a,r){m(a,s,r),p(s,o),p(o,t)},p:E,i:E,o:E,d(a){a&&l(s)}}}function T(a){let s,o,E,b,P,$,L={ctx:a,current:null,token:null,hasCatch:!0,pending:S,then:N,catch:I,value:1,error:2,blocks:[,,,]};return t(a[0],L),{c(){s=r(),o=n("main"),E=n("h1"),b=e("Blog Posts"),P=r(),L.block.c(),this.h()},l(a){c('[data-svelte="svelte-1433kn3"]',document.head).forEach(l),s=u(a),o=i(a,"MAIN",{});var t=h(o);E=i(t,"H1",{class:!0});var r=h(E);b=d(r,"Blog Posts"),r.forEach(l),P=u(t),L.block.l(t),t.forEach(l),this.h()},h(){document.title="Blog Posts | joshuacastor.me",f(E,"class","sr-only")},m(a,t){m(a,s,t),m(a,o,t),p(o,E),p(E,b),p(o,P),L.block.m(o,L.anchor=null),L.mount=()=>o,L.anchor=null,$=!0},p(s,[o]){g(L,a=s,o)},i(a){$||(k(L.block),$=!0)},o(a){for(let s=0;s<3;s+=1){const a=L.blocks[s];v(a)}$=!1},d(a){a&&l(s),a&&l(o),L.block.d(),L.token=null,L=null}}}function A(a){return j(a)}function B(a){return[x()]}export default class extends a{constructor(a){super(),s(this,a,B,T,o,{})}}export{A as load};
