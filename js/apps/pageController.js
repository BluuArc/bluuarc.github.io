"use strict";
function PageController(options = {}) {
    let self = {
        models: null,
        app: null,
        components: {}
    };

    init();
    function init() {
        initComponents();

        self.models = options.models;
        self.views = options.views;
        self.log = options.log;
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
                                    :class="{ 'mdc-tab':true, 'mdc-tab--active': page.isActive }"
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
                                    :class="{ 'mdc-tab':true, 'mdc-tab--active': page.isActive }"
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
                $(this.$el).find(".mdc-tab-bar").each(function () {
                    new mdc.tabs.MDCTabBar(this);
                });
            }
        };
    }

    // change view of page
    function setPageTo(pageName, isExternal = false) {
        let pages = $(".pages");
        let delay = 100, fadePromises = [];
        for(let p in self.models.pages){
            self.models.pages[p].isActive = p === pageName;
            
            // toggle page sections based on isActive
            let pageSection = pages.find(self.models.pages[p].el);
            fadePromises.push(new Promise((fulfill,reject) => {
                pageSection.fadeOut(delay, () => fulfill());
            }));
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

    return {
        setPageTo
    };
}