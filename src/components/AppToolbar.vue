<template>
  <v-toolbar
    v-resize="checkIfIsMobile"
    id="app-toolbar"
    app
    :clipped-left="clipped"
    color="primary">
    <v-toolbar-title
      id="toolbar-title"
      class="text-sm-center text-xs-center">
      <v-btn flat exact large @click.stop="goToRoute('/')">
        {{ title }}
      </v-btn>
    </v-toolbar-title>
    <v-spacer/>
    <v-toolbar-items>
      <v-tabs
        right
        fixed-tabs
        v-model="activeTab"
        class="hidden-sm-and-down"
        color="primary"
        slider-color="secondary">
        <v-tab
          v-for="(tab, i) in tabItems"
          :key="i"
          @click.stop="goToRoute(tab.link)">
          {{ tab.title }}
        </v-tab>
      </v-tabs>
    </v-toolbar-items>
    <v-tabs
      v-if="isMobile"
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
</template>

<script>
import { mapGetters } from 'vuex';

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
          title: 'About',
          link: '/about'
        }
      ],
      isMobile: false,
      title: 'JC.ME'
    };
  },
  computed: {
    ...mapGetters('display', ['breakpointToDisplaySize'])
  },
  watch: {
    '$route' () {
      this.updateActiveTab();
    }
  },
  mounted () {
    this.checkIfIsMobile();
    this.updateActiveTab();
  },
  methods: {
    goToRoute (link) {
      this.$router.push({ path: link });
    },
    updateActiveTab () {
      this.activeTab = this.tabItems
      .map(t => t.link)
      .indexOf(this.$route.path)
      .toString();
    },
    checkIfIsMobile () {
      const smallBreakpointCutoff = this.breakpointToDisplaySize('sm');
      this.isMobile = window.innerWidth <= smallBreakpointCutoff;
    }
  }
};
</script>

<style scoped>
@media screen and (max-width: 959px) {
  #toolbar-title {
    margin: auto;
    width: 100%;
  }
}
</style>
