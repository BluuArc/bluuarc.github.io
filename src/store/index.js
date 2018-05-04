import Vue from 'vue';
import Vuex from 'vuex';
import DisplayModule from '@/store/modules/displayBreakpoints';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    display: DisplayModule
  }
});

export default store;
