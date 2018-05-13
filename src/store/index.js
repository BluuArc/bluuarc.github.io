import Vue from 'vue';
import Vuex from 'vuex';
import DisplayModule from '@/store/modules/displayBreakpoints';
import JobData from './data/jobs';
import CourseData from './data/courses';
import ContactData from './data/contact';
import SiteTechData from './data/site-technologies';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    display: DisplayModule
  },
  state: {
    jobs: JobData,
    courses: CourseData,
    contactLinks: ContactData,
    projectData: null,
    siteTechnologies: SiteTechData
  },
  mutations: {
    setProjectData (state, data) {
      state.projectData = data;
    }
  }
});

export default store;
