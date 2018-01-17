"use strict";

var debug = debug || {};

function PageController(options = {}) {
    let self = {
        models: null,
        app: null,
        components: {}
    };

    init();
    function init() {
        self.log = options.log;
        initComponents();

        self.models = options.models;
        self.views = options.views;
        self.app = new Vue({
            el: options.appParams.el,
            data: options.appParams.data,
            created: function () {
                self.log("initialized main app");
            },
            methods: {
                setPageTo: setPageTo
            },
            components: self.components
        });
    }

    function initComponents() {
        self.components['jccc-nav-header'] = {
            props: ['pages'],
            template: `
                <div class="mdc-toolbar">
                    <div class="mdc-toolbar__row sm-plus">
                        <div class="mdc-toolbar__section mdc-toolbar__section--shrink-to-fit mdc-toolbar__section--align-start">
                            <h2 class="mdc-toolbar__title"><a href="/">JCCC</a></h2>
                        </div>
                        <div class="mdc-toolbar__section mdc-toolbar__section--align-end">
                            <nav id="page-tab-bar" class="mdc-tab-bar" role="tablist">
                                <a role="tab" v-for="(page,key) in pages" 
                                    :class="{ 'mdc-tab':true, 'mdc-tab--active': page.isActive, 'hidden': page.isHidden }"
                                    @click="setPageTo(key)"    
                                >
                                    {{ key }}
                                </a>
                                <span class="mdc-tab-bar__indicator"></span>
                            </nav>
                        </div>
                    </div>
                    <div class="mdc-toolbar__row xs-only" id="mobile-header">
                        <div class="mdc-toolbar__section">
                            <h2 class="mdc-toolbar__title"><a href="/">JCCC</a></h2>
                        </div>
                    </div>
                    <div class="mdc-toolbar__row xs-only">
                        <div class="mdc-toolbar__section mdc-toolbar__section--align-start">
                            <nav id="page-tab-bar-mobile" class="mdc-tab-bar" role="tablist">
                                <a role="tab" v-for="(page,key) in pages" 
                                    :class="{ 'mdc-tab':true, 'mdc-tab--active': page.isActive, 'hidden': page.isHidden }"
                                    @click="setPageTo(key)"    
                                >
                                    {{ key }}
                                </a>
                                <span class="mdc-tab-bar__indicator"></span>
                            </nav>
                        </div>
                    </div>
                </div>
                `,
            methods: {
                setPageTo: function (newPage) {
                    // emit changes to parent
                    this.$emit("pagechange", newPage);
                }
            },
            mounted: function () {
                self.log("Mounted navbar");
                let tabBars = [];
                $(this.$el).find(".mdc-tab-bar").each(function () {
                    let tabBar = new mdc.tabs.MDCTabBar(this);
                    tabBars.push(tabBar);
                });
                self.tabBars = tabBars;

                self.log("tabBars", self.tabBars);
            }
        };
    }

    // change view of page
    function setPageTo(pageName, isExternal = false) {
        let pages = $(".pages");
        let delay = 100, fadePromises = [];
        let activeIndex = -1;
        for(let p in self.models.pages){
            self.models.pages[p].isActive = p === pageName;

            if(p === pageName && isExternal){
                activeIndex = Object.keys(self.models.pages).indexOf(p);
            }
            
            // toggle page sections based on isActive
            let pageSection = pages.find(self.models.pages[p].el);
            fadePromises.push(new Promise((fulfill,reject) => {
                pageSection.fadeOut(delay, () => fulfill());
            }));
        }

        if(isExternal){
            activeIndex = (activeIndex > -1) ? activeIndex : (Object.keys(self.models.pages).length-1); //default to error page on invalid tab
            self.log("activeIndex", activeIndex);
            self.tabBars.forEach(tabBar => tabBar.activeTabIndex = activeIndex);
        }

        return Promise.all(fadePromises)
            .then(() => {
                return new Promise((fulfill,reject) => {
                    if(self.models.pages[pageName]){
                        pages.find(self.models.pages[pageName].el).fadeIn(delay,() => fulfill());
                    }else{
                        fulfill(); //don't do anything --> may change to showing error page?
                    }
                });
            }).then(() => self.log("Set page to",pageName));
    }

    function onPageLoad(evt){
        let isExternal = location.origin.indexOf(location.host) === -1 || !evt;
        if (window.location.search.indexOf("?") > -1) { //auto set page based on url
            let parameters = window.location.search.slice(1).split("&"); // parameters split by &
            let data = {};
            for (let p of parameters) { // parse values from parameters
                let [key, value, extra] = p.split('=').map(decodeURIComponent);
                data[key] = value;
            }
            if (data.link) {
                self.log("Changing page to", data.link, isExternal);
                setPageTo(data.link, isExternal);
            } else {
                self.log("Going to home by default", data, isExternal);
                setPageTo('Home', isExternal);
            }
        } else {
            self.log("No parameters found. Going to home by default.", isExternal);
            setPageTo('Home', isExternal);
        }
    }

    return {
        setPageTo,
        onPageLoad
    };
}