"use strict";
function ProjectsApp(options = {}) {
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
        self.views = options.views || {};
        self.app = new Vue({
            el: options.appParams.el,
            data: options.appParams.data,
            created: function () {
                self.log("initialized project page");
            },
            methods: {},
            components: self.components
        });

        self.log(self.models);
    }

    function initComponents() {
        let nameSearch, languageBoxes = {}, nameButtons = {};
        self.components["name-search"] = {
            template: `
                <div class="mdc-form-field name-search">
                    <div class="mdc-text-field">
                        <input type="text" id="name-field" class="mdc-text-field__input">
                        <label class="mdc-text-field__label" for="name-field">Project Name</label>
                        <div class="mdc-text-field__bottom-line"></div>
                    </div>
                </div>
            `,
            mounted: function(){
                nameSearch = new mdc.textField.MDCTextField(this.$el);
                self.log("[name-search]",nameSearch);
            },
            methods: {
                input: function () {
                    // debouncing?
                }
            }
        };

        self.components["language-checkbox"] = {
            props: ['language'],
            template: `
                <div class="langauge-checkbox mdc-form-field">
                    <div class="mdc-checkbox">
                        <input type="checkbox" :id="language" class="mdc-checkbox__native-control"/>
                        <div class="mdc-checkbox__background">
                            <svg class="mdc-checkbox__checkmark"
                                viewBox="0 0 24 24">
                                <path class="mdc-checkbox__checkmark__path"
                                    fill="none"
                                    stroke="white"
                                    d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
                            </svg>
                            <div class="mdc-checkbox__mixedmark"></div>
                        </div>
                    </div>

                    <label :for="language">{{ language }}</label>
                </div>
            `,
            created: function() {
                // self.log(this);
            }
        };

        self.components["radio-button"] = {
            props: ['value', 'groupname', 'actualname'],
            template: `
                <div class="mdc-form-field">
                    <div class="mdc-radio">
                        <input class="mdc-radio__native-control" type="radio" :id="value" v-bind:name="groupname" :value="value">
                        <div class="mdc-radio__background">
                            <div class="mdc-radio__outer-circle"></div>
                            <div class="mdc-radio__inner-circle"></div>
                        </div>
                    </div>
                    <label :for="value">{{ actualname }}</label>
                </div>
            `,
            mounted: function() {
                nameButtons[`${this.$attrs.groupname}/${this.$attrs.actualname}`] = new mdc.radio.MDCRadio(this.$el);
                
                self.log("[radio-button]",this,nameButtons);
            }
        };
    }

    return {};
}