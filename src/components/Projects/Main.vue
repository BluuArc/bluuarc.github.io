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
        <v-card>
          <v-card-text class="pa-0">
            <v-container grid-list-md>
              <v-layout row class="pl-2 pr-2">
                <v-flex xs6>
                  <v-text-field
                    color="secondary"
                    v-model="searchQuery"
                    name="project-search"
                    label="Search Projects"/>
                </v-flex>
                <v-flex xs6 class="text-xs-center" style="margin: auto">
                  <h3 class="subheading">Showing {{ projectKeys.length }} {{ projectKeys.length === 1 ? 'project' : 'projects' }}</h3>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 class="pa-0">
                  <v-expansion-panel>
                    <v-expansion-panel-content>
                      <div slot="header">
                        <span>Filters</span>
                        <v-chip small>{{ filters.languages.length }} {{ filters.languages.length === 1 ? 'Language' : 'Languages' }}</v-chip>
                      </div>
                      <v-card>
                        <v-card-text>
                          <section>
                            <h3 class="subheading">Languages</h3>
                            <v-container fluid>
                              <v-layout row wrap>
                                <v-flex
                                  v-for="(language, i) in possibleLanguages"
                                  :key="i"
                                  xs12 md3>
                                  <v-checkbox
                                    v-model="filters.languages"
                                    :label="language"
                                    :value="language"/>
                                </v-flex>
                              </v-layout>
                            </v-container>
                          </section>
                        </v-card-text>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-divider/>
                  <v-expansion-panel>
                    <v-expansion-panel-content style="border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;">
                      <div slot="header">
                        <span>Sort By:</span>
                        <span>{{ sortMapping[sortOptions.type] }} ({{ sortOptions.isAscending ? 'Ascending': 'Descending' }} order)</span>
                      </div>
                      <v-card style="border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;">
                        <v-card-text>
                          <section>
                            <h3 class="subheading">Sort Type</h3>
                            <v-radio-group v-model="sortOptions.type" row>
                              <v-radio
                                v-for="(key, value) in sortMapping"
                                :key="value"
                                :value="value"
                                :label="key"
                              />
                            </v-radio-group>
                          </section>
                          <section>
                            <h3 class="subheading">Sort Order</h3>
                            <v-radio-group v-model="sortOptions.isAscending" row>
                              <v-radio :value="true" label="Ascending"/>
                              <v-radio :value="false" label="Descending"/>
                            </v-radio-group>
                          </section>
                        </v-card-text>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
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
    },
    sortMapping () {
      return {
        lastPushedAt: 'Last Commit Date',
        createdAt: 'Creation Date',
        name: 'Project Name',
        owner: 'Project Owner'
      };
    },
    possibleLanguages () {
      if (!this.projectData) {
        return [];
      }

      return this.projectData.overall.languages.map(lang => lang.name).sort();
    }
  },
  data () {
    return {
      searchQuery: '',
      projectKeys: [],
      sortOptions: {
        type: 'lastPushedAt',
        isAscending: false
      },
      filters: {
        languages: []
      }
    };
  },
  watch: {
    searchQuery (newValue) {
      this.searchHandler(newValue);
    },
    projectData () {
      this.searchHandler();
    },
    'sortOptions.type' (newValue) {
      this.projectKeys = this.sortKeys(this.sortOptions, this.projectKeys);
    },
    'sortOptions.isAscending' (newValue) {
      this.projectKeys = this.sortKeys(this.sortOptions, this.projectKeys);
    },
    possibleLanguages (newValue) {
      this.filters.languages = newValue;
    },
    'filters.languages' () {
      this.searchHandler(this.searchQuery, this.filters);
    }
  },
  mounted () {
    this.filters.languages = this.possibleLanguages;
    this.searchHandler();
  },
  methods: {
    searchHandler: debounce(function (query, filters) {
      this.projectKeys = this.sortKeys(this.sortOptions, this.searchProjects(query, filters || this.filters));
    }, 150),
    searchProjects (query, filters) {
      if (!this.projectData) {
        return [];
      }

      const projects = this.projectData.projects;

      return Object.entries(projects)
        .filter(([key, project]) => {
          const hasQuery = this.projectFitsQuery(project, query);
          const fitFilter = this.projectFitsFilter(project, filters);
          return hasQuery && fitFilter;
        }).map(([key, project]) => key);
    },
    projectFitsQuery (project, query) {
      const { description = '', name = '', owner = '', languages = [], techUsed = [], topics = [] } = project;
      const hasQuery = (description || '').toLowerCase().includes(query) ||
        name.toLowerCase().includes(query) ||
        owner.toLowerCase().includes(query) ||
        JSON.stringify(languages).toLowerCase().includes(query) ||
        JSON.stringify(techUsed).toLowerCase().includes(query) ||
        JSON.stringify(topics).toLowerCase().includes(query);
      return hasQuery;
    },
    projectFitsFilter (project, filter) {
      const { languages: filterLanguages } = filter;
      const { languages: projectLanguages } = project;

      const languageNames = projectLanguages.map(lang => lang.name);

      const hasSomeLanguage = filterLanguages.some(lang => languageNames.includes(lang));
      // console.debug(languageNames, filterLanguages, hasSomeLanguage);

      return hasSomeLanguage;
    },
    sortKeys (options = {}, inputKeys = []) {
      const dateFields = ['lastPushedAt', 'createdAt'];
      const textFields = ['name', 'owner'];
      // default to sort by last pushed at in descending order
      const { type = 'lastPushedAt', isAscending = false } = options;

      if (inputKeys.length < 1) {
        return inputKeys;
      }

      const projectKeys = inputKeys.slice();
      const projects = this.projectData.projects;
      if (dateFields.includes(type)) {
        return projectKeys.sort((keyA, keyB) => {
          const difference = new Date(projects[keyA][type]) - new Date(projects[keyB][type]);
          return isAscending ? difference : -difference;
        });
      } else if (textFields.includes(type)) {
        return projectKeys.sort((keyA, keyB) => {
          const [projectA, projectB] = [projects[keyA], projects[keyB]];
          const difference = projectA[type] < projectB[type] ? -1 : 1;
          return isAscending ? difference : -difference;
        });
      } else {
        // use defaults
        return this.sortKeys();
      }
    }
  }
};
</script>
