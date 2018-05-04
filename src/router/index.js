import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import HomePage from '@/components/Home/Main';
import ProjectsPage from '@/components/Projects/Main';
import ContactPage from '@/components/Contact/Main';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/helloworld',
      name: 'HelloWorld',
      component: HelloWorld
    },
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
