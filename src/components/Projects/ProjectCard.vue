<template>
  <v-card class="project-card">
    <v-card-title primary-title>
      <h3 class="headline">{{ project.name }}</h3>
    </v-card-title>
    <v-card-text class="pb-0">
      <v-container grid-list-sm>
        <v-layout row wrap>
          <v-flex sm12 md6>
            <p><b>Description</b></p>
            <div v-if="project.description">
              {{ project.description }}
            </div>
            <div v-else>
              No description specified.
            </div>
          </v-flex>
          <v-flex sm12 v-if="isMobile">
            <v-divider/>
          </v-flex>
          <v-flex sm12 md6>
            <p><b>Project Information</b></p>
            <p><b>Owner:</b> {{ project.owner }}</p>
            <p>
              <b>Created:</b>
              <date-text :top="true" :date="project.createdAt"/>
            </p>
            <p>
              <b>Last Commit:</b>
              <date-text :top="true" :date="project.lastPushedAt"/>
            </p>
          </v-flex>
        </v-layout>
        <v-layout v-if="project.topics && project.topics.length > 0" row wrap class="pb-0">
          <v-flex sm12 v-if="isMobile">
            <v-divider/>
          </v-flex>
          <v-flex sm2 md1 class="text-xs-center text-sm-left">
            <v-btn flat small id="topic-section-label">
              Topics:
            </v-btn>
          </v-flex>
          <v-flex sm10 md11 class="text-xs-center text-sm-left">
            <v-btn
              round small
              v-for="topic in project.topics"
              :key="topic.name"
              :href="topic.url"
              target="_blank"
              class="grey darken-2 topic-chip">
              {{ topic.name }}
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout row v-if="isMobile">
          <v-flex sm12>
            <v-divider/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-text>
      <language-section :languages="project.languages"></language-section>
    </v-card-text>
    <v-card-actions>
      <v-btn flat :href="project.repoURL" target="_blank">
        <span>Code Repository</span>
        <v-icon right>fab fa-github</v-icon>
      </v-btn>
      <v-divider class="hidden-sm-and-up"/>
      <v-btn flat v-if="project.homepageURL" :href="project.homepageURL" target="_blank">
        <span>Project Page</span>
        <v-icon right>fas fa-external-link-alt</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import DateText from '@/components/DateText';
import LanguageSection from '@/components/Projects/LanguageSection';

export default {
  props: {
    project: {
      required: true,
      type: Object
    }
  },
  components: {
    'language-section': LanguageSection,
    'date-text': DateText
  },
  computed: {
    ...mapGetters('display', ['breakpointToDisplaySize']),
    ...mapState('display', ['type'])
  },
  data () {
    return {
      isMobile: false
    };
  },
  watch: {
    type () {
      this.checkIfIsMobile();
    }
  },
  mounted () {
    this.checkIfIsMobile();
  },
  methods: {
    checkIfIsMobile () {
      const smallBreakpointCutoff = this.breakpointToDisplaySize('sm');
      this.isMobile = window.innerWidth <= smallBreakpointCutoff;
    }
  }
};
</script>

<style>
@media screen and (max-width: 599px) {
  .project-card .card__actions {
    display: grid;
  }

  .project-card .card__text {
    overflow-x: auto;
    overflow-y: hidden;
  }

}

.project-card .card__title {
  word-break: break-all;
}

.topic-chip {
  text-transform: lowercase;
}

#topic-section-label {
  text-transform: none;
  pointer-events: none;
}
</style>
