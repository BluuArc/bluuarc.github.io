<template>
  <v-container grid-list-lg>
    <v-layout row>
      <v-flex xs12>
        <p v-if="!projectData">Loading project data...</p>
        <section v-else>
          <v-card id="profile-overview-card">
            <v-card-title>
              <h3 class="headline">Profile Overview</h3>
            </v-card-title>
            <v-container fluid grid-list-lg style="background-color: var(--secondary-background)">
              <v-layout row wrap v-if="userData">
                <v-flex md3 xs12>
                  <v-card-media
                    :src="userData.avatar_url"
                    height="200px"
                    contain/>
                </v-flex>
                <v-flex md9 xs12>
                  <v-card-text class="text-xs-center">
                    <h3 class="headline">{{ userData.name }} ({{ userData.login }})</h3>
                    <p>
                      <span>GitHub user since</span>
                      <date-text :top="true" :date="userData.created_at"/>
                    </p>
                    <p>Contributed to at least <b>{{ projectData.overall.count.total }} public projects</b>, owning {{ projectData.overall.count.mine }} of them.</p>
                    <p>{{ projectData.user.followers }} follower(s) and following {{ projectData.user.following }} user(s)</p>
                    <p>
                      <span>User information last updated</span>
                      <date-text :top="true" :date="userData.updated_at"/>
                    </p>
                  </v-card-text>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-card-text>
                    <language-section :languages="projectData.overall.languages"/>
                  </v-card-text>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </section>
      </v-flex>
    </v-layout>
    <v-layout v-if="projectData" row wrap>
      <v-flex xs12>
        <v-divider/>
      </v-flex>
      <v-flex xs12>
        <v-container grid-list-md>
          <v-layout row>
            <v-flex xs6>
              <v-text-field
                color="secondary"
                v-model="searchQuery"
                name="project-search"
                label="Search Projects"/>
            </v-flex>
            <v-flex xs6 class="text-xs-center" style="margin: auto">
              <h3 class="subheading">Showing {{ projectKeys.length }} projects</h3>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
      <v-flex
        xs12
        v-for="key in projectKeys"
        :key="key">
        <project-card :project="projectData.projects[key]"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import LanguageSection from '@/components/Projects/LanguageSection';
import ProjectCard from '@/components/Projects/ProjectCard';
import DateText from '@/components/DateText';
import debounce from 'lodash/debounce';

export default {
  components: {
    'language-section': LanguageSection,
    'project-card': ProjectCard,
    'date-text': DateText
  },
  computed: {
    ...mapState(['projectData']),
    userData () {
      if (!this.projectData) {
        return;
      }
      return this.projectData.user;
    }
  },
  data () {
    return {
      searchQuery: '',
      projectKeys: []
    };
  },
  watch: {
    searchQuery (newValue) {
      console.debug('query changed to', newValue);
      this.searchHandler(newValue);
    },
    projectData () {
      this.projectKeys = this.searchProjects();
    }
  },
  mounted () {
    this.projectKeys = this.searchProjects();
  },
  methods: {
    searchHandler: debounce(function (query) {
      this.projectKeys = this.searchProjects(query);
    }, 150),
    searchProjects (query) {
      if (!this.projectData) {
        return [];
      }

      const projects = this.projectData.projects;

      if (!query) {
        return Object.keys(projects);
      }

      return Object.entries(projects)
        .filter(([key, project]) => {
          const { description = '', name = '', owner = '', languages = [], techUsed = [], topics = [] } = project;
          const hasQuery = (description || '').toLowerCase().includes(query) ||
            name.toLowerCase().includes(query) ||
            owner.toLowerCase().includes(query) ||
            JSON.stringify(languages).toLowerCase().includes(query) ||
            JSON.stringify(techUsed).toLowerCase().includes(query) ||
            JSON.stringify(topics).toLowerCase().includes(query);
          // console.debug(key, { description, name, owner, languages, techUsed, topics }, hasQuery);
          return hasQuery;
        }).map(([key, project]) => key);
    }
  }
};
</script>
