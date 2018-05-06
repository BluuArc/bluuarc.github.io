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
      <v-flex xs12 sm12>
        <v-card id="work-card">
          <v-card-title primary-title>
            <h3 class="headline">Work Experience</h3>
          </v-card-title>
          <v-card-text>
            <v-stepper vertical non-linear color="transparent">
              <span v-for="(job, i) in jobs" :key="i">
                <v-stepper-step
                editable
                :step="i + 1"
                edit-icon="">
                  {{ job.name }}
                  <small>{{ job.time }}</small>
                </v-stepper-step>
                <v-stepper-content :step="i + 1">
                  <h4 class="subheading">{{ job.company }} | {{ job.location }}</h4>
                  <p class="body-2" v-html="job.desc.join('')"/>
                </v-stepper-content>  
              </span>
            </v-stepper>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapGetters('display', ['breakpointToDisplaySize']),
    ...mapState(['jobs']),
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
    }
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

<style>
#work-card li {
  margin-left: 1em;
}

#work-card a {
  /* deep-orange lighten-2 */
  color: #FF8A65;
}

#work-card a:visited {
  /* deep-orange darken-1 */
  color: #F4511E;
}
</style>
