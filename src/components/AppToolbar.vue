<template>
  <v-toolbar
    v-resize="displayChangeHandler"
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
  watch: {
    '$route' () {
      this.updateActiveTab();
    }
  },
  mounted () {
    this.displayChangeHandler();
    this.updateActiveTab();
  },
  methods: {
    ...mapMutations('display', ['updateType']),
    goToRoute (link) {
      this.$router.push({ path: link });
    },
    updateActiveTab () {
      this.activeTab = this.tabItems
      .map(t => t.link)
      .indexOf(this.$route.path)
      .toString();
    },
    displayChangeHandler () {
      this.updateType(window.innerWidth);
      this.checkIfShowMobileToolbar();
    },
    checkIfShowMobileToolbar () {
      const smallBreakpointCutoff = this.breakpointToDisplaySize('sm');
      this.showMobileToolbar = window.innerWidth <= smallBreakpointCutoff;
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
