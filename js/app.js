"use strict";

var jcccApp = jcccApp || new JCCCApp();

var debug = {};

function JCCCApp(options = {}) {
    let self = {
        models: { //data goes here
            main: {
                activePage: "Home",
                pages: {
                    'Home': {
                        el: '.page#home',
                        isActive: true
                    },
                    'Projects': {
                        el: '.page#projects',
                        isActive: false
                    },
                    'Contact': {
                        el: '.page#contact',
                        isActive: false
                    }
                }
            },
            home: {},
            projects: {},
            contact: {}
        },
        views: {},
        apps: {
            main: null,
            home: null,
            projects: null,
            contact: null   
        },
        debugMode: true,
        log: (...args) => {
            if(self.debugMode){
                console.log(...args);
            }
        }
    };

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

    // given an array of script urls, append them in order
    function appendScriptsIteratively(urls) {
        function recursive_append(fulfillFn, rejectFn) {
            if (urls.length === 0) {
                fulfillFn();
            } else {
                const url = urls.shift();
                return appendScript(url)
                    .then(() => recursive_append(fulfillFn, rejectFn))
                    .catch(rejectFn);
            }
        }

        return new Promise((fulfill, reject) => {
            recursive_append(fulfill, reject);
        });
    }

    function init() {
        const appDirectory = "js/apps";
        let scripts = [`${appDirectory}/pageController.js`, `${appDirectory}/home.js`];
        return appendScriptsIteratively(scripts) //append app scripts
            .then(() => { //initialize apps
                self.apps.main = new PageController({
                    log: (...args) => self.log("[PageController]", ...args),
                    models: self.models.main,
                    appParams: {
                        el: "div#app",
                        data: self.models.main
                    }
                });

                self.apps.homePage = new HomeApp({
                    log: (...args) => self.log("[HomePage]", ...args),
                    models: self.models.home,
                    appParams: {
                        el: "#home.page",
                        data: self.models.home
                    }
                });
            }).then(() => {
                if (self.debugMode) {
                    debug.setPageTo = self.apps.main.setPageTo;
                }
            }).then(() => self.log("Finished full initialization"));
    }

    function initComponents() {
        
    }

    return {
        init
    };
}