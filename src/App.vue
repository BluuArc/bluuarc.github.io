<template>
  <v-app dark v-resize="displayChangeHandler">
    <app-toolbar/>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer app>
      <span id="footer-text">&copy; {{ new Date().getUTCFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapMutations } from 'vuex';
import AppToolbar from '@/components/AppToolbar';

export default {
  components: {
    'app-toolbar': AppToolbar
  },
  methods: {
    ...mapMutations('display', ['updateType']),
    displayChangeHandler () {
      this.updateType(window.innerWidth);
    }
  },
  name: 'App'
};
</script>

<style>
html {
  overflow-y: auto;
}

.card {
  border-radius: 15px;
}

.footer #footer-text {
  margin: auto;
}
</style>
