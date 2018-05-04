<template>
  <v-container grid-list-lg id="home-page" v-resize="checkIfIsXsMobile">
    <v-layout row wrap>
      <v-flex xs12 sm12>
        <v-card>
          <v-card-media
            v-show="isXsMobile"
            :src="require('../../assets/img/avatar.jpg')"
            height="12rem"
            id="avatar"/>
          <v-card-title v-show="isXsMobile" primary-title style="display: inline-block">
            <div v-html="aboutMeHtml"/>
          </v-card-title>
          <v-container fluid grid-list-lg v-show="!isXsMobile">
            <v-layout row>
              <v-flex xs3>
                <v-card-media
                  :src="require('../../assets/img/avatar.jpg')"
                  height="150px"
                  contain
                  id="avatar"/>
              </v-flex>
              <v-flex xs9>
                <div v-html="aboutMeHtml"/>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    aboutMeHtml () {
      return `
        <h3 class="headline">About Me</h3>
        <p class="body-2">
          I am Joshua Castor, and I enjoy programming stuff.
          My current focus is on frontend (and some backend) with JavaScript,
          but I'm open to learning other languages and technologies.
        </p>
        <p class="body-2">
          <b>Interests:</b> web development, visual analytics, cybersecurity
        </p>
      `;
    },
    ...mapGetters('display', ['breakpointToDisplaySize'])
  },
  data () {
    return {
      isXsMobile: false
    };
  },
  methods: {
    checkIfIsXsMobile () {
      const smallBreakpointCutoff = this.breakpointToDisplaySize('xs');
      this.isXsMobile = window.innerWidth <= smallBreakpointCutoff;
    }
  }
};
</script>
