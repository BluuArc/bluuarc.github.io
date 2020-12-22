// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

import App from './App';
import router from './router';
import store from './store';

import VueRouterMultiView from 'vue-router-multi-view';

import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import theme from './theme';

Vue.use(Vuetify, { theme });
Vue.use(VueRouterMultiView);

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  document.title = `JC.ME - ${to.name}`;
  next();
});

router.afterEach(() => {
  // scroll after exit transition ends
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 300);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
