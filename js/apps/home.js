"use strict";
function HomeApp(options = {}) {
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
                self.log("initialized home page");
                self.log(self.models);
            },
            methods: {},
            components: self.components
        });
    }

    function initComponents() {
        
    }

    return {};
}