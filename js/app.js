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
        initComponents();
        return appendScriptsIteratively(scripts) //append app scripts
            .then(() => {
                return loadProjectData();
            })
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

    // for global components
    function initComponents() {
        let card = Vue.component('card', {
            template: `
                <div class="mdc-card mdc-card--theme-dark">
                    <slot>
                        <section class="mdc-card__primary">
                            <h1 class="mdc-card__title mdc-card__title--large">Card Component</h1>
                        </section>
                        <section class="mdc-card__supporting-text">
                            This card component has no content
                        </section>
                    </slot>
                </div>
            `
        });
    }

    function getData(url) {
        return new Promise((fulfill, reject) => {
            try {
                $.get(url, data => fulfill(data));
            } catch (err) {
                reject(err);
            }
        });
    }

    function loadProjectData() {
        let projectData = { //used by projects page and home page for project statistics
            projects: {}, //keyed by "owner/project-name"
            overall: {
                languages: [],
                ownership: [],
                count: {
                    total: 0,
                    mine: 0
                }
            },
            user: {}
        };
        return getData("project-data.json").then(data => {
            // aggregation objects
            // TODO: implement techData aggregation
            let languageData = {}, techData = {}, ownershipData = {};
            
            // process data
            Object.keys(data)
                .sort((a, b) => new Date(data[b].lastPushedAt) - new Date(data[a].lastPushedAt)) //order by most recent first
                .map(k => { // add data in order of sorted keys

                    // save project data
                    projectData.projects[k] = data[k];

                    // keep track of languages over all projects
                    for (let lang of data[k].languages) {
                        if (!languageData[lang.name]) {
                            languageData[lang.name] = {
                                name: lang.name,
                                color: lang.color,
                                size: 0
                            };
                        }
                        languageData[lang.name].size += lang.size;
                    }

                    //count number of projects owned by that person
                    if (!ownershipData[data[k].owner]) {
                        ownershipData[data[k].owner] = 0;
                    }
                    ownershipData[data[k].owner]++;
                    
                    projectData.overall.count.total++;
                });

            //convert aggregated objects to arrays
            Object.keys(languageData)
                .sort((a, b) => languageData[b].size - languageData[a].size) //sort in descending order by size
                .map(lang => projectData.overall.languages.push(languageData[lang]));

            Object.keys(ownershipData)
                .sort((a, b) => ownershipData[b] - ownershipData[a]) // sort alphabetically
                .map(owner => {
                    projectData.overall.ownership.push({
                        name: owner,
                        count: ownershipData[owner]
                    });
                    if (owner === "BluuArc") {
                        projectData.overall.count.mine = ownershipData[owner];
                    }
                });

            // save data into models
            self.models.home.projectData = projectData.overall;
            self.models.projects.projectData = projectData;
            return;
        });
    }

    return {
        init
    };
}