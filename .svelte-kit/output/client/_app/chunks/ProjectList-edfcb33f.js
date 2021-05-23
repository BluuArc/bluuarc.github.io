import{g as e,D as t,a as n}from"./DateTime-99aa3d5e.js";import{c as r,g as o}from"./singletonGetters-ff01b479.js";import{S as a,i as l,s as c,l as s,f as i,G as u,d as f,e as p,t as $,c as m,a as d,g,E as h,h as v,N as E,B as y,r as j,u as w,v as L,j as S,k as C,m as N,n as b,o as P,w as x,b as A}from"./vendor-df840aab.js";const I=r((function(){const t=e("projectData");return(o()||self.fetch)("/project-data.json").then((e=>e.ok?e.json():Promise.reject(e.statusText))).then((e=>{t.debug({originalProjectData:e});const n={},r={},o={},a={languages:[],ownership:[],count:{total:0,mine:0}},l=Object.entries(e);return a.count.total=l.length,l.forEach((([e,a])=>{n[e]=a,Array.isArray(a.languages)?(a.languages.forEach((({name:e,color:t,size:n})=>{r[e]||(r[e]={name:e,color:t,size:0}),r[e].size+=n})),o[a.owner]||(o[a.owner]=0),o[a.owner]++):t.warn("no language data found in entry",a)})),a.languages=Object.values(r).sort(((e,t)=>t.size-e.size)),a.ownership=Object.entries(o).sort((([,e],[,t])=>t-e)).map((([e,t])=>({name:e,count:t}))),a.count.mine=(a.ownership.find((({name:e})=>"BluuArc"===e))||{}).count||0,t.debug({projects:n,overall:a}),{projects:n,overall:a}})).catch((e=>{throw t.error(e),e}))}));function D(){return I()}function T(e,t,n){const r=e.slice();return r[2]=t[n],r}function O(e){let t,n;return{c(){t=p("span"),n=$("No language data specified.")},l(e){t=m(e,"SPAN",{});var r=d(t);n=g(r,"No language data specified."),r.forEach(f)},m(e,r){i(e,t,r),h(t,n)},p:u,d(e){e&&f(t)}}}function R(e){let t,n=e[0],r=[];for(let o=0;o<n.length;o+=1)r[o]=k(T(e,n,o));return{c(){t=p("ul");for(let e=0;e<r.length;e+=1)r[e].c()},l(e){t=m(e,"UL",{});var n=d(t);for(let t=0;t<r.length;t+=1)r[t].l(n);n.forEach(f)},m(e,n){i(e,t,n);for(let o=0;o<r.length;o+=1)r[o].m(t,null)},p(e,o){if(1&o){let a;for(n=e[0],a=0;a<n.length;a+=1){const l=T(e,n,a);r[a]?r[a].p(l,o):(r[a]=k(l),r[a].c(),r[a].m(t,null))}for(;a<r.length;a+=1)r[a].d(1);r.length=n.length}},d(e){e&&f(t),E(r,e)}}}function k(e){let t,n,r,o,a,l=e[2].name+"",c=e[2].percentSize+"";return{c(){t=p("li"),n=$(l),r=$(" ("),o=$(c),a=$("%)\n\t\t")},l(e){t=m(e,"LI",{});var s=d(t);n=g(s,l),r=g(s," ("),o=g(s,c),a=g(s,"%)\n\t\t"),s.forEach(f)},m(e,l){i(e,t,l),h(t,n),h(t,r),h(t,o),h(t,a)},p(e,t){1&t&&l!==(l=e[2].name+"")&&v(n,l),1&t&&c!==(c=e[2].percentSize+"")&&v(o,c)},d(e){e&&f(t)}}}function U(e){let t;function n(e,t){return e[0].length>0?R:O}let r=n(e),o=r(e);return{c(){o.c(),t=s()},l(e){o.l(e),t=s()},m(e,n){o.m(e,n),i(e,t,n)},p(e,[a]){r===(r=n(e))&&o?o.p(e,a):(o.d(1),o=r(e),o&&(o.c(),o.m(t.parentNode,t)))},i:u,o:u,d(e){o.d(e),e&&f(t)}}}function z(e,t,n){let{languages:r=[]}=t,o=[];return e.$$set=e=>{"languages"in e&&n(1,r=e.languages)},e.$$.update=()=>{if(2&e.$$.dirty){const e=r.reduce(((e,t)=>e+t.size),0);n(0,o=r.map((({size:t,name:n,color:r})=>({name:n,color:r,percentSize:+(t/e*100).toFixed(2)}))))}},[o,r]}class H extends a{constructor(e){super(),l(this,e,z,U,c,{languages:1})}}function G(e,t,n){const r=e.slice();return r[8]=t[n],r}function V(e){let n,r,o,a,l;return n=new t({props:{level:e[1],$$slots:{default:[B]},$$scope:{ctx:e}}}),{c(){S(n.$$.fragment),r=C(),o=p("p"),a=$("No project data found.")},l(e){N(n.$$.fragment,e),r=b(e),o=m(e,"P",{});var t=d(o);a=g(t,"No project data found."),t.forEach(f)},m(e,t){P(n,e,t),i(e,r,t),i(e,o,t),h(o,a),l=!0},p(e,t){const r={};2&t&&(r.level=e[1]),2048&t&&(r.$$scope={dirty:t,ctx:e}),n.$set(r)},i(e){l||(L(n.$$.fragment,e),l=!0)},o(e){j(n.$$.fragment,e),l=!1},d(e){x(n,e),e&&f(r),e&&f(o)}}}function M(e){let r,o,a,l,c,s,u,E,I,D,T,O,R,k,U,z,H,G,V,M,B,K,Q,W,Y,Z,ee,re,oe,ae,le,ce,se,ie,ue,fe,pe,$e=e[0].owner+"",me=(e[0].description||"(No description provided)")+"",de=e[0].name+"",ge=e[0].owner+"";o=new t({props:{level:e[1],$$slots:{default:[F]},$$scope:{ctx:e}}}),s=new n({props:{dateTime:e[4].toISOString()}}),T=new n({props:{dateTime:e[5].toISOString()}}),k=new t({props:{level:e[1]+1,$$slots:{default:[q]},$$scope:{ctx:e}}});let he=(e[2].totalCount>0||e[3].totalCount>0)&&J(e),ve=e[0].topics.length>0&&X(e),Ee=e[0].languages.length>0&&_(e);W=new t({props:{level:e[1]+1,id:e[7],$$slots:{default:[te]},$$scope:{ctx:e}}});let ye=e[0].homepageURL&&ne(e);return{c(){r=p("header"),S(o.$$.fragment),a=C(),l=p("p"),c=$("Created "),S(s.$$.fragment),u=$(" by "),E=p("a"),I=$($e),D=$(",\n\t\t\t\tlast committed to "),S(T.$$.fragment),O=C(),R=p("section"),S(k.$$.fragment),U=C(),z=p("p"),H=$(me),G=C(),he&&he.c(),V=C(),ve&&ve.c(),M=C(),Ee&&Ee.c(),B=C(),K=p("section"),Q=p("nav"),S(W.$$.fragment),Y=C(),Z=p("ul"),ee=p("li"),re=p("a"),oe=$("Go to Code Repository "),ae=p("span"),le=$('for the "'),ce=$(de),se=$('" project by '),ie=$(ge),fe=C(),ye&&ye.c(),this.h()},l(e){r=m(e,"HEADER",{});var t=d(r);N(o.$$.fragment,t),a=b(t),l=m(t,"P",{});var n=d(l);c=g(n,"Created "),N(s.$$.fragment,n),u=g(n," by "),E=m(n,"A",{href:!0});var i=d(E);I=g(i,$e),i.forEach(f),D=g(n,",\n\t\t\t\tlast committed to "),N(T.$$.fragment,n),n.forEach(f),t.forEach(f),O=b(e),R=m(e,"SECTION",{});var p=d(R);N(k.$$.fragment,p),U=b(p),z=m(p,"P",{});var $=d(z);H=g($,me),$.forEach(f),p.forEach(f),G=b(e),he&&he.l(e),V=b(e),ve&&ve.l(e),M=b(e),Ee&&Ee.l(e),B=b(e),K=m(e,"SECTION",{});var h=d(K);Q=m(h,"NAV",{"aria-labelledby":!0});var v=d(Q);N(W.$$.fragment,v),Y=b(v),Z=m(v,"UL",{});var y=d(Z);ee=m(y,"LI",{});var j=d(ee);re=m(j,"A",{href:!0});var w=d(re);oe=g(w,"Go to Code Repository "),ae=m(w,"SPAN",{class:!0});var L=d(ae);le=g(L,'for the "'),ce=g(L,de),se=g(L,'" project by '),ie=g(L,ge),L.forEach(f),w.forEach(f),j.forEach(f),fe=b(y),ye&&ye.l(y),y.forEach(f),v.forEach(f),h.forEach(f),this.h()},h(){A(E,"href",e[6]),A(ae,"class","sr-only"),A(re,"href",ue=e[0].repoURL),A(Q,"aria-labelledby",e[7])},m(e,t){i(e,r,t),P(o,r,null),h(r,a),h(r,l),h(l,c),P(s,l,null),h(l,u),h(l,E),h(E,I),h(l,D),P(T,l,null),i(e,O,t),i(e,R,t),P(k,R,null),h(R,U),h(R,z),h(z,H),i(e,G,t),he&&he.m(e,t),i(e,V,t),ve&&ve.m(e,t),i(e,M,t),Ee&&Ee.m(e,t),i(e,B,t),i(e,K,t),h(K,Q),P(W,Q,null),h(Q,Y),h(Q,Z),h(Z,ee),h(ee,re),h(re,oe),h(re,ae),h(ae,le),h(ae,ce),h(ae,se),h(ae,ie),h(Z,fe),ye&&ye.m(Z,null),pe=!0},p(e,t){const n={};2&t&&(n.level=e[1]),2049&t&&(n.$$scope={dirty:t,ctx:e}),o.$set(n);const r={};16&t&&(r.dateTime=e[4].toISOString()),s.$set(r),(!pe||1&t)&&$e!==($e=e[0].owner+"")&&v(I,$e),(!pe||64&t)&&A(E,"href",e[6]);const a={};32&t&&(a.dateTime=e[5].toISOString()),T.$set(a);const l={};2&t&&(l.level=e[1]+1),2048&t&&(l.$$scope={dirty:t,ctx:e}),k.$set(l),(!pe||1&t)&&me!==(me=(e[0].description||"(No description provided)")+"")&&v(H,me),e[2].totalCount>0||e[3].totalCount>0?he?(he.p(e,t),12&t&&L(he,1)):(he=J(e),he.c(),L(he,1),he.m(V.parentNode,V)):he&&(y(),j(he,1,1,(()=>{he=null})),w()),e[0].topics.length>0?ve?(ve.p(e,t),1&t&&L(ve,1)):(ve=X(e),ve.c(),L(ve,1),ve.m(M.parentNode,M)):ve&&(y(),j(ve,1,1,(()=>{ve=null})),w()),e[0].languages.length>0?Ee?(Ee.p(e,t),1&t&&L(Ee,1)):(Ee=_(e),Ee.c(),L(Ee,1),Ee.m(B.parentNode,B)):Ee&&(y(),j(Ee,1,1,(()=>{Ee=null})),w());const c={};2&t&&(c.level=e[1]+1),128&t&&(c.id=e[7]),2049&t&&(c.$$scope={dirty:t,ctx:e}),W.$set(c),(!pe||1&t)&&de!==(de=e[0].name+"")&&v(ce,de),(!pe||1&t)&&ge!==(ge=e[0].owner+"")&&v(ie,ge),(!pe||1&t&&ue!==(ue=e[0].repoURL))&&A(re,"href",ue),e[0].homepageURL?ye?ye.p(e,t):(ye=ne(e),ye.c(),ye.m(Z,null)):ye&&(ye.d(1),ye=null),(!pe||128&t)&&A(Q,"aria-labelledby",e[7])},i(e){pe||(L(o.$$.fragment,e),L(s.$$.fragment,e),L(T.$$.fragment,e),L(k.$$.fragment,e),L(he),L(ve),L(Ee),L(W.$$.fragment,e),pe=!0)},o(e){j(o.$$.fragment,e),j(s.$$.fragment,e),j(T.$$.fragment,e),j(k.$$.fragment,e),j(he),j(ve),j(Ee),j(W.$$.fragment,e),pe=!1},d(e){e&&f(r),x(o),x(s),x(T),e&&f(O),e&&f(R),x(k),e&&f(G),he&&he.d(e),e&&f(V),ve&&ve.d(e),e&&f(M),Ee&&Ee.d(e),e&&f(B),e&&f(K),x(W),ye&&ye.d()}}}function B(e){let t;return{c(){t=$("Empty Project Entry")},l(e){t=g(e,"Empty Project Entry")},m(e,n){i(e,t,n)},d(e){e&&f(t)}}}function F(e){let t,n=e[0].name+"";return{c(){t=$(n)},l(e){t=g(e,n)},m(e,n){i(e,t,n)},p(e,r){1&r&&n!==(n=e[0].name+"")&&v(t,n)},d(e){e&&f(t)}}}function q(e){let t;return{c(){t=$("Description")},l(e){t=g(e,"Description")},m(e,n){i(e,t,n)},d(e){e&&f(t)}}}function J(e){let n,r,o,a,l,c;r=new t({props:{level:e[1]+1,$$slots:{default:[K]},$$scope:{ctx:e}}});let s=e[2].totalCount>0&&Q(e),u=e[3].totalCount>0&&W(e);return{c(){n=p("section"),S(r.$$.fragment),o=C(),a=p("ul"),s&&s.c(),l=C(),u&&u.c()},l(e){n=m(e,"SECTION",{});var t=d(n);N(r.$$.fragment,t),o=b(t),a=m(t,"UL",{});var c=d(a);s&&s.l(c),l=b(c),u&&u.l(c),c.forEach(f),t.forEach(f)},m(e,t){i(e,n,t),P(r,n,null),h(n,o),h(n,a),s&&s.m(a,null),h(a,l),u&&u.m(a,null),c=!0},p(e,t){const n={};2&t&&(n.level=e[1]+1),2048&t&&(n.$$scope={dirty:t,ctx:e}),r.$set(n),e[2].totalCount>0?s?s.p(e,t):(s=Q(e),s.c(),s.m(a,l)):s&&(s.d(1),s=null),e[3].totalCount>0?u?u.p(e,t):(u=W(e),u.c(),u.m(a,null)):u&&(u.d(1),u=null)},i(e){c||(L(r.$$.fragment,e),c=!0)},o(e){j(r.$$.fragment,e),c=!1},d(e){e&&f(n),x(r),s&&s.d(),u&&u.d()}}}function K(e){let t;return{c(){t=$("Release Statistics")},l(e){t=g(e,"Release Statistics")},m(e,n){i(e,t,n)},d(e){e&&f(t)}}}function Q(e){let t,n,r,o,a,l,c,s,u,E=e[2].totalCount+"",y=1!==e[2].totalCount?"deployments":"deployment",j=e[2].lastDeployment.toLocaleDateString()+"";return{c(){t=p("li"),n=$(E),r=C(),o=$(y),a=$(". Most recent deployment is "),l=p("time"),c=$(j),s=$("."),this.h()},l(e){t=m(e,"LI",{});var i=d(t);n=g(i,E),r=b(i),o=g(i,y),a=g(i,". Most recent deployment is "),l=m(i,"TIME",{datetime:!0});var u=d(l);c=g(u,j),s=g(u,"."),u.forEach(f),i.forEach(f),this.h()},h(){A(l,"datetime",u=e[2].lastDeployment.toISOString())},m(e,u){i(e,t,u),h(t,n),h(t,r),h(t,o),h(t,a),h(t,l),h(l,c),h(l,s)},p(e,t){4&t&&E!==(E=e[2].totalCount+"")&&v(n,E),4&t&&y!==(y=1!==e[2].totalCount?"deployments":"deployment")&&v(o,y),4&t&&j!==(j=e[2].lastDeployment.toLocaleDateString()+"")&&v(c,j),4&t&&u!==(u=e[2].lastDeployment.toISOString())&&A(l,"datetime",u)},d(e){e&&f(t)}}}function W(e){let t,n,r,o,a,l,c,s=e[3].totalCount+"",u=1!==e[3].totalCount?"packages":"package",E=e[3].latestPackage+"";return{c(){t=p("li"),n=$(s),r=C(),o=$(u),a=$(". Newest release is "),l=$(E),c=$(".")},l(e){t=m(e,"LI",{});var i=d(t);n=g(i,s),r=b(i),o=g(i,u),a=g(i,". Newest release is "),l=g(i,E),c=g(i,"."),i.forEach(f)},m(e,s){i(e,t,s),h(t,n),h(t,r),h(t,o),h(t,a),h(t,l),h(t,c)},p(e,t){8&t&&s!==(s=e[3].totalCount+"")&&v(n,s),8&t&&u!==(u=1!==e[3].totalCount?"packages":"package")&&v(o,u),8&t&&E!==(E=e[3].latestPackage+"")&&v(l,E)},d(e){e&&f(t)}}}function X(e){let n,r,o,a,l;r=new t({props:{level:e[1]+1,$$slots:{default:[Y]},$$scope:{ctx:e}}});let c=e[0].topics,s=[];for(let t=0;t<c.length;t+=1)s[t]=Z(G(e,c,t));return{c(){n=p("section"),S(r.$$.fragment),o=C(),a=p("ul");for(let e=0;e<s.length;e+=1)s[e].c()},l(e){n=m(e,"SECTION",{});var t=d(n);N(r.$$.fragment,t),o=b(t),a=m(t,"UL",{});var l=d(a);for(let n=0;n<s.length;n+=1)s[n].l(l);l.forEach(f),t.forEach(f)},m(e,t){i(e,n,t),P(r,n,null),h(n,o),h(n,a);for(let n=0;n<s.length;n+=1)s[n].m(a,null);l=!0},p(e,t){const n={};if(2&t&&(n.level=e[1]+1),2048&t&&(n.$$scope={dirty:t,ctx:e}),r.$set(n),1&t){let n;for(c=e[0].topics,n=0;n<c.length;n+=1){const r=G(e,c,n);s[n]?s[n].p(r,t):(s[n]=Z(r),s[n].c(),s[n].m(a,null))}for(;n<s.length;n+=1)s[n].d(1);s.length=c.length}},i(e){l||(L(r.$$.fragment,e),l=!0)},o(e){j(r.$$.fragment,e),l=!1},d(e){e&&f(n),x(r),E(s,e)}}}function Y(e){let t;return{c(){t=$("Topics")},l(e){t=g(e,"Topics")},m(e,n){i(e,t,n)},d(e){e&&f(t)}}}function Z(e){let t,n,r,o,a,l,c,s,u=e[8].name+"";return{c(){t=p("li"),n=p("a"),r=p("span"),o=$("View other GitHub projects under the "),a=$(u),l=p("span"),c=$("topic"),this.h()},l(e){t=m(e,"LI",{});var s=d(t);n=m(s,"A",{href:!0});var i=d(n);r=m(i,"SPAN",{class:!0});var p=d(r);o=g(p,"View other GitHub projects under the "),p.forEach(f),a=g(i,u),l=m(i,"SPAN",{class:!0});var $=d(l);c=g($,"topic"),$.forEach(f),i.forEach(f),s.forEach(f),this.h()},h(){A(r,"class","sr-only"),A(l,"class","sr-only"),A(n,"href",s=e[8].url)},m(e,s){i(e,t,s),h(t,n),h(n,r),h(r,o),h(n,a),h(n,l),h(l,c)},p(e,t){1&t&&u!==(u=e[8].name+"")&&v(a,u),1&t&&s!==(s=e[8].url)&&A(n,"href",s)},d(e){e&&f(t)}}}function _(e){let n,r,o,a,l;return r=new t({props:{level:e[1]+1,$$slots:{default:[ee]},$$scope:{ctx:e}}}),a=new H({props:{languages:e[0].languages}}),{c(){n=p("section"),S(r.$$.fragment),o=C(),S(a.$$.fragment)},l(e){n=m(e,"SECTION",{});var t=d(n);N(r.$$.fragment,t),o=b(t),N(a.$$.fragment,t),t.forEach(f)},m(e,t){i(e,n,t),P(r,n,null),h(n,o),P(a,n,null),l=!0},p(e,t){const n={};2&t&&(n.level=e[1]+1),2048&t&&(n.$$scope={dirty:t,ctx:e}),r.$set(n);const o={};1&t&&(o.languages=e[0].languages),a.$set(o)},i(e){l||(L(r.$$.fragment,e),L(a.$$.fragment,e),l=!0)},o(e){j(r.$$.fragment,e),j(a.$$.fragment,e),l=!1},d(e){e&&f(n),x(r),x(a)}}}function ee(e){let t;return{c(){t=$("Languages")},l(e){t=g(e,"Languages")},m(e,n){i(e,t,n)},d(e){e&&f(t)}}}function te(e){let t,n,r,o,a,l,c=e[0].name+"",s=e[0].owner+"";return{c(){t=$("Related External Links "),n=p("span"),r=$('for the "'),o=$(c),a=$('" project by '),l=$(s),this.h()},l(e){t=g(e,"Related External Links "),n=m(e,"SPAN",{class:!0});var i=d(n);r=g(i,'for the "'),o=g(i,c),a=g(i,'" project by '),l=g(i,s),i.forEach(f),this.h()},h(){A(n,"class","sr-only")},m(e,c){i(e,t,c),i(e,n,c),h(n,r),h(n,o),h(n,a),h(n,l)},p(e,t){1&t&&c!==(c=e[0].name+"")&&v(o,c),1&t&&s!==(s=e[0].owner+"")&&v(l,s)},d(e){e&&f(t),e&&f(n)}}}function ne(e){let t,n,r,o,a,l,c,s,u,E=e[0].name+"",y=e[0].owner+"";return{c(){t=p("li"),n=p("a"),r=$("Visit Project Page "),o=p("span"),a=$('for the "'),l=$(E),c=$('" project by '),s=$(y),this.h()},l(e){t=m(e,"LI",{});var i=d(t);n=m(i,"A",{href:!0});var u=d(n);r=g(u,"Visit Project Page "),o=m(u,"SPAN",{class:!0});var p=d(o);a=g(p,'for the "'),l=g(p,E),c=g(p,'" project by '),s=g(p,y),p.forEach(f),u.forEach(f),i.forEach(f),this.h()},h(){A(o,"class","sr-only"),A(n,"href",u=e[0].homepageURL)},m(e,u){i(e,t,u),h(t,n),h(n,r),h(n,o),h(o,a),h(o,l),h(o,c),h(o,s)},p(e,t){1&t&&E!==(E=e[0].name+"")&&v(l,E),1&t&&y!==(y=e[0].owner+"")&&v(s,y),1&t&&u!==(u=e[0].homepageURL)&&A(n,"href",u)},d(e){e&&f(t)}}}function re(e){let t,n,r,o;const a=[M,V],l=[];function c(e,t){return e[0]?0:1}return n=c(e),r=l[n]=a[n](e),{c(){t=p("article"),r.c()},l(e){t=m(e,"ARTICLE",{});var n=d(t);r.l(n),n.forEach(f)},m(e,r){i(e,t,r),l[n].m(t,null),o=!0},p(e,[o]){let s=n;n=c(e),n===s?l[n].p(e,o):(y(),j(l[s],1,1,(()=>{l[s]=null})),w(),r=l[n],r?r.p(e,o):(r=l[n]=a[n](e),r.c()),L(r,1),r.m(t,null))},i(e){o||(L(r),o=!0)},o(e){j(r),o=!1},d(e){e&&f(t),l[n].d()}}}function oe(e,t,n){let r,o,a,l,c,{project:s=null}=t,{headerLevel:i=2}=t,u="";return e.$$set=e=>{"project"in e&&n(0,s=e.project),"headerLevel"in e&&n(1,i=e.headerLevel)},e.$$.update=()=>{if(1&e.$$.dirty)if(s){const{deployments:e,packages:t,createdAt:i,lastPushedAt:f}=s;if(n(2,r={totalCount:e.totalCount,lastDeployment:e.nodes[0]?new Date(e.nodes[0].updatedAt):null}),n(3,o={totalCount:t.totalCount}),t.nodes[0]){const e=t.nodes[0];n(3,o.latestPackage=`${e.name}@${e.latestVersion.version}`,o)}n(4,a=new Date(i)),n(5,l=new Date(f)),n(6,c=`https://github.com/${s.owner}/`),n(7,u=`html-id-${Date.now()}-${Math.random().toString().slice(3)}`)}else n(2,r=n(3,o={totalCount:0}))},[s,i,r,o,a,l,c,u]}class ae extends a{constructor(e){super(),l(this,e,oe,re,c,{project:0,headerLevel:1})}}function le(e,t,n){const r=e.slice();return r[2]=t[n],r}function ce(e){let t,n;return{c(){t=p("span"),n=$("No project data specified.")},l(e){t=m(e,"SPAN",{});var r=d(t);n=g(r,"No project data specified."),r.forEach(f)},m(e,r){i(e,t,r),h(t,n)},p:u,i:u,o:u,d(e){e&&f(t)}}}function se(e){let t,n,r=e[0],o=[];for(let l=0;l<r.length;l+=1)o[l]=ie(le(e,r,l));const a=e=>j(o[e],1,1,(()=>{o[e]=null}));return{c(){t=p("ul");for(let e=0;e<o.length;e+=1)o[e].c()},l(e){t=m(e,"UL",{});var n=d(t);for(let t=0;t<o.length;t+=1)o[t].l(n);n.forEach(f)},m(e,r){i(e,t,r);for(let n=0;n<o.length;n+=1)o[n].m(t,null);n=!0},p(e,n){if(3&n){let l;for(r=e[0],l=0;l<r.length;l+=1){const a=le(e,r,l);o[l]?(o[l].p(a,n),L(o[l],1)):(o[l]=ie(a),o[l].c(),L(o[l],1),o[l].m(t,null))}for(y(),l=r.length;l<o.length;l+=1)a(l);w()}},i(e){if(!n){for(let e=0;e<r.length;e+=1)L(o[e]);n=!0}},o(e){o=o.filter(Boolean);for(let t=0;t<o.length;t+=1)j(o[t]);n=!1},d(e){e&&f(t),E(o,e)}}}function ie(e){let t,n,r,o;return n=new ae({props:{project:e[2],headerLevel:e[1]}}),{c(){t=p("li"),S(n.$$.fragment),r=C()},l(e){t=m(e,"LI",{});var o=d(t);N(n.$$.fragment,o),r=b(o),o.forEach(f)},m(e,a){i(e,t,a),P(n,t,null),h(t,r),o=!0},p(e,t){const r={};1&t&&(r.project=e[2]),2&t&&(r.headerLevel=e[1]),n.$set(r)},i(e){o||(L(n.$$.fragment,e),o=!0)},o(e){j(n.$$.fragment,e),o=!1},d(e){e&&f(t),x(n)}}}function ue(e){let t,n,r,o;const a=[se,ce],l=[];function c(e,t){return e[0].length>0?0:1}return t=c(e),n=l[t]=a[t](e),{c(){n.c(),r=s()},l(e){n.l(e),r=s()},m(e,n){l[t].m(e,n),i(e,r,n),o=!0},p(e,[o]){let s=t;t=c(e),t===s?l[t].p(e,o):(y(),j(l[s],1,1,(()=>{l[s]=null})),w(),n=l[t],n?n.p(e,o):(n=l[t]=a[t](e),n.c()),L(n,1),n.m(r.parentNode,r))},i(e){o||(L(n),o=!0)},o(e){j(n),o=!1},d(e){l[t].d(e),e&&f(r)}}}function fe(e,t,n){let{projects:r=[]}=t,{projectHeaderLevel:o=2}=t;return e.$$set=e=>{"projects"in e&&n(0,r=e.projects),"projectHeaderLevel"in e&&n(1,o=e.projectHeaderLevel)},[r,o]}class pe extends a{constructor(e){super(),l(this,e,fe,ue,c,{projects:0,projectHeaderLevel:1})}}export{H as L,pe as P,D as g};
