<template>
  <v-app dark>
    <app-toolbar></app-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer app>
      <span>&copy; {{ new Date().getUTCFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import AppToolbar from '@/components/AppToolbar';

export default {
  components: {
    'app-toolbar': AppToolbar
  },
  name: 'App'
};
</script>

<style>
html {
  overflow-y: auto;
}
</style>
