"use strict";
function PageController(options = {}) {
    let self = {
        models: null,
        app: null
    };

    init();
    function init() {
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
            }
        });
    }

    // change view of page
    function setPageTo(pageName) {
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