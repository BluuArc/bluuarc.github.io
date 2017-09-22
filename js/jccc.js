"use strict";

//globals for statcounter tracker
var sc_project = sc_project || 11034084;
var sc_invisible = sc_invisible || 1;
var sc_security = sc_security || "3e7dba9f";
var scJsHost = scJsHost || (("https:" == document.location.protocol) ? "https://secure." : "http://www.");

var jccc = jccc || new JCCC_App();

function JCCC_App(){
    let self ={
        components: {},
        debugMode: document.location.href.indexOf("github.io") === -1,
        attachTrackersPromise: undefined
    }

    function debugLog(...args){
        if(self.debugMode){
            console.trace(...args);
        }
    }

    function init(currentPageName, options, afterLoadFn){
        self.currentPageName = currentPageName;
        self.afterLoadFn = afterLoadFn;
        self.options = options || {};
        return setupPage(currentPageName).then(() => {
            if(typeof(afterLoadFn) === 'function')
                return afterLoadFn();
        });
    }

    //pure javascript version of appending a script
    //based off of https://howchoo.com/g/mmu0nguznjg/learn-the-slow-and-fast-way-to-append-elements-to-the-dom
    function appendScript(url) {
        return new Promise(function (fulfill, reject) {
            let e = document.createElement('script');
            e.src = url;
            e.onload = () => { fulfill(); };
            e.onerror = reject;
            document.body.appendChild(e);
        });
    }

    function appendScriptsIteratively(urls){
        function recursive_append(fulfillFn,rejectFn){
            if(urls.length === 0){
                fulfillFn();
            }else{
                const url = urls.shift();
                return appendScript(url)
                    .then(() => recursive_append(fulfillFn,rejectFn))
                    .catch(rejectFn);
            }
        }

        return new Promise((fulfill,reject) => {
            recursive_append(fulfill, reject);
        });
    }

    //load common scripts and trackers
    function setupPage(currentPageName){
        let setupOptions = self.options || {};
        let common_page_scripts = [
            "https://code.jquery.com/jquery-3.2.1.slim.min.js",
            // "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-beta/js/bootstrap.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/d3/4.2.6/d3.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.4/vue.min.js"
        ];

        const scripts = {
            jQuery: ["https://code.jquery.com/jquery-3.2.1.slim.min.js"],
            bootstrap: ["https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js", "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-beta/js/bootstrap.min.js" ],
            other: [
                "https://cdnjs.cloudflare.com/ajax/libs/d3/4.2.6/d3.min.js",
                "https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.4/vue.min.js"
            ]   

        };

        let body;

        //load jQuery first
        let curPromise = appendScript(scripts.jQuery[0])
            .then(() => {
                //load everything else
                let loadPromises = [];
                for(let s in scripts){
                    if(s !== 'jQuery'){
                        loadPromises.push(appendScriptsIteratively(scripts[s]));
                    }
                }

                return Promise.all(loadPromises)
                    .then(() => { 
                        console.trace("Finished loading scripts");
                    }); //wait for all scripts to load
            }).then(() => {
                if(setupOptions.initHeader){
                    return initHeader();
                }
            }).then(() => {
                if(setupOptions.attachTrackers)  {
                    attachTrackers();
                    return self.attachTrackersPromise;
                }
            }).then(() => {
                //create default page app
                debugLog("initializing app")
                self.components.default_components = new Vue({
                    el: self.options.header || "#pageApp",
                });  
            });

        return curPromise;
    }

    function initHeader(){
        debugLog("initializing header");
        let header_bar = Vue.component("jccc-nav-header",{
            data: function(){ 
                let data = {
                    brand: "JCCC",
                    brand_title: "Joshua Castor's Code Compendium",
                    links: {
                        Home: "http://bluuarc.github.io",
                        Projects: "http://bluuarc.github.io",
                        "About Me": "http://bluuarc.github.io/about.html",
                        Contact: "http://bluuarc.github.io/contact.html"
                    },
                    navlinks: []
                };

                for(let a in data.links){
                    data.navlinks.push({
                        class: {
                            'nav-item': true,
                            'active': a === self.currentPageName
                        },
                        href: data.links[a],
                        text: a
                    });
                }

                return data;
            },
            template:   `<nav class="navbar navbar-expand-lg navbar-dark bg-dark" id="mainNavbarContainer">
                            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <a class="navbar-brand" href="http://bluuarc.github.io" :title="brand_title">{{ brand }}</a>

                            <div class="collapse navbar-collapse" id="mainNavbar">
                                <ul class="navbar-nav mr-auto">
                                    <jccc-nav-link 
                                        v-for="link in navlinks"
                                        :info="link"
                                    ></jccc-nav-link>
                                </ul>
                            </div>
                        </nav>`
        });

        let header_link = Vue.component("jccc-nav-link", {
            props: ['info'],
            template:   `<li :class="info.class">
                            <a class="nav-link" :href="info.href">{{ info.text }}</a>
                        </li>`
        });

        
    }

    function attachTrackers(){
        debugLog("initializing footer");
        let attachedScript = false;
        function addStatCounterScript(){
            if(!attachedScript){
                attachedScript = true;
                return appendScript(`${scJsHost}statcounter.com/counter/counter.js`);
            }else{
                return Promise.resolve();
            }
        }

        let footer = Vue.component('jccc-footer',{
            template: `<noscript><div class="statcounter"><a title="shopify site analytics" target="_blank" href="http://statcounter.com/shopify/"><img class="statcounter" alt="shopify site analytics" src="//c.statcounter.com/11034084/0/3e7dba9f/1/"></a></div></noscript>`,
            mounted: function(){
                addStatCounterScript();
                return;
            }
        });
    }

    

    return {
        init,
    };
}