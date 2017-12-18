"use strict";

(function(){
    let navbar = Vue.component("jccc-nav-header", {
        props: ['pages'],
        template: `
        <div class="mdc-toolbar">
            <div class="mdc-toolbar__row">
                <div class="mdc-toolbar__section mdc-toolbar__section--shrink-to-fit mdc-toolbar__section--align-start">
                    <h2 class="mdc-toolbar__title">JCCC</h2>
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
        </div>
        `,
        methods: {
            setPageTo: function(newPage) {
                // for(let page in this.pages){
                //     this.pages[page].isActive = newPage === page;
                // }

                // emit changes to parent
                this.$emit("pagechange",newPage);
            }
        },
        mounted: function (params) {
            window.dynamicTabBar = new mdc.tabs.MDCTabBar(document.querySelector('#page-tab-bar'));
        }
    });

    console.log("initialized components")
})();