import Vue from 'vue';
import Vuex from 'vuex';
import DisplayModule from '@/store/modules/displayBreakpoints';
import JobData from './data/jobs';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    display: DisplayModule
  },
  state: {
    jobs: JobData
  }
});

export default store;
