<template>
  <v-app
    dark
    v-resize="displayChangeHandler"
  >
    <v-toolbar
      id="app-toolbar"
      app
      :clipped-left="clipped"
      color="primary"
    >
      <v-toolbar-title
        id="toolbar-title"
        class="text-sm-center text-xs-center"
        v-text="title"
      />
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-tabs
          right
          fixed-tabs
          v-model="activeTab"
          class="hidden-sm-and-down"
          color="primary">
          <v-tab
            v-for="(tab, i) in tabItems"
            :key="i"
            @click.stop="goToRoute(tab.link)">
            {{ tab.title }}
          </v-tab>
        </v-tabs>
      </v-toolbar-items>
      <v-tabs
        v-if="showMobileToolbar"
        v-model="activeTab"
        fixed-tabs
        centered
        slot="extension"
        class="hidden-md-and-up"
        color="primary">
        <v-tab
          v-for="(tab, i) in tabItems"
          :key="i"
          @click.stop="goToRoute(tab.link)">
          {{ tab.title }}
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer :fixed="false" app>
      <span>&copy; {{ new Date().getUTCFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';

export default {
  data () {
    return {
      clipped: false,
      activeTab: null,
      tabItems: [
        {
          title: 'Home',
          link: '/'
        },
        {
          title: 'Projects',
          link: '/projects'
        },
        {
          title: 'Contact',
          link: '/contact'
        }
      ],
      showMobileToolbar: false,
      title: 'JCCC'
    };
  },
  computed: {
    ...mapState('display', ['type']),
    ...mapGetters('display', ['breakpointToDisplaySize'])
  },
  mounted () {
    this.displayChangeHandler();
    this.activeTab = this.tabItems
      .map(t => t.link)
      .indexOf(this.$route.path)
      .toString();
  },
  methods: {
    ...mapMutations('display', ['updateType']),
    goToRoute (link) {
      this.$router.push({ path: link });
    },
    displayChangeHandler () {
      this.updateType(window.innerWidth);
      this.checkIfShowMobileToolbar();
    },
    checkIfShowMobileToolbar () {
      const smallBreakpointCutoff = this.breakpointToDisplaySize('sm');
      this.showMobileToolbar = window.innerWidth <= smallBreakpointCutoff;
    }
  },
  name: 'App'
};
</script>

<style>
html {
  overflow-y: auto;
}

@media screen and (max-width: 959px) {
  #app-toolbar #toolbar-title {
    margin: auto;
    width: 100%;
  }
}
</style>
