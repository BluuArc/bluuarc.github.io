import Vue from 'vue';
import Router from 'vue-router';
import HomePage from '@/components/Home/Main';
import ProjectsPage from '@/components/Projects/Main';
import ContactPage from '@/components/Contact/Main';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage
    },
    {
      path: '/projects',
      name: 'Projects',
      component: ProjectsPage
    },
    {
      path: '/contact',
      name: 'Contact',
      component: ContactPage
    }
  ]
});
