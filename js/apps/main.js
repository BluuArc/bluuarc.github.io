"use strict";
function MainApp(options = {}) {
    let self = {
        models: null,
        app: null
    };

    init();
    function init() {
        self.models = options.models;
        self.views = options.views;
        self.log = options.log;
        self.app = new Vue(options.appParams);
    }

    // change view of page
    function setPageTo(pageName) {
        for(let p in self.models.pages){
            self.models.pages[p].isActive = p === pageName;
        }
    }

    return {
        setPageTo
    };
}