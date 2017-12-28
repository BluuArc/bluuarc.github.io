"use strict";
function HomeApp(options = {}) {
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
                self.log("initialized home page");
            },
            methods: {
                setToolbarTitle
            },
            components: self.components
        });
    }

    function setToolbarTitle(title = "") {
        let toolbar = $("#titleBar");
        let animPromise = Promise.resolve();
        if(self.models.closestCard.length === 0 && title.length > 0){
            toolbar.fadeIn(250);
        }else if(self.models.closestCard.length > 0 && title.length === 0){
            animPromise = (() => {
                return new Promise((fulfill, reject) => { toolbar.fadeOut(250, fulfill); } );
            })();
        }

        animPromise.then(() => {
            self.models.closestCard = title;
        });
    }

    function initComponents() {
        let cardTitles;
        self.components["floating-title-toolbar"] = {
            props: ['title'],
            data: function(){
                return {
                    page: $("section.pages").get(0),
                };
            },
            template: `
                <header class="mdc-toolbar mdc-toolbar--fixed" id="titleBar" v-show="title.length > 0">
                    <div class="mdc-toolbar__row">
                        <section class="mdc-toolbar__section">
                            <span class="mdc-toolbar__title">{{ title }}</span>
                        </section>
                    </div>
                </header>
            `,
            methods: {
                handleScroll: function(e) {
                    if(!cardTitles){
                        return;
                    }

                    let scrollPosition = this.page.scrollTop;
                    let activeCard = "";
                    Object.keys(cardTitles).forEach((title) => {
                        if(scrollPosition >= cardTitles[title]){
                            activeCard = title;
                        }
                    });
                    this.$emit("changecard", activeCard);
                },
                setCardTitles: function () {
                    self.log("Setting card titles");
                    cardTitles = {};
                    let cardSelections = $(".page#home .mdc-card");
                    cardSelections.each(function () {
                        let curCard = $(this);
                        let title = curCard.find(".mdc-card__primary .mdc-card__title").text();
                        cardTitles[title] = curCard.get(0).offsetTop;
                    });
                }
            },
            mounted: function(){
                this.setCardTitles();
            },
            created: function () {
                window.addEventListener('scroll', this.handleScroll, true);
                window.addEventListener('resize', this.setCardTitles, true);
            },
            destroyed: function () {
                window.removeEventListener('scroll', this.handleScroll, true);
                window.removeEventListener('resize', this.setCardTitles, true);
            },
        };
    }

    return {};
}