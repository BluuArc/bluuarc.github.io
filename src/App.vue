<template>
  <v-app dark v-resize="displayChangeHandler" class="grey darken-4">
    <app-toolbar/>
    <v-content>
      <router-multi-view
        name="slide-y-transition"
        morph="transition-group"/>
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
  mounted () {
    this.loadProjectData();
  },
  methods: {
    ...mapMutations('display', ['updateType']),
    ...mapMutations(['setProjectData']),
    displayChangeHandler () {
      this.updateType(window.innerWidth);
    },
    async loadProjectData () {
      const projectJsonData = await fetch('./static/project-data.json')
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            throw Error(res.statusText);
          }
        });
      this.processProjectData(projectJsonData);
    },
    async processProjectData (data) {
      const projectData = {
        projects: {}, // keyed by "owner/project-name"
        overall: {
          languages: [],
          ownership: [],
          count: {
            total: 0,
            mine: 0
          }
        },
        user: {}
      };
      // TODO: implement techData aggregation
      const languageData = {};
      const ownershipData = {};
      // eslint-disable-next-line no-unused-vars
      const techData = {};

      Object.entries(data)
        // order by most recent first
        .sort(([keyA, entryA], [keyB, entryB]) => new Date(entryB.lastPushedAt) - new Date(entryA.lastPushedAt))
        .forEach(([key, entry]) => {
          projectData.projects[key] = entry;

          entry.languages.forEach(language => {
            if (!languageData[language.name]) {
              languageData[language.name] = {
                name: language.name,
                color: language.color,
                size: 0
              };
            }
            languageData[language.name].size += language.size;
          });

          // count number of projects owned by that person
          if (!ownershipData[entry.owner]) {
            ownershipData[entry.owner] = 0;
          }
          ownershipData[entry.owner]++;

          projectData.overall.count.total++;
        });

        // store into aggregate object
      Object.values(languageData)
        .sort((a, b) => b.size - a.size) // sort by largest size
        .forEach(language => projectData.overall.languages.push(language));

      Object.entries(ownershipData)
        .sort(([keyA, entryA], [keyB, entryB]) => entryB - entryA) // sort by most owned
        .forEach(([name, count]) => {
          projectData.overall.ownership.push({ name, count });
          if (name === 'BluuArc') {
            projectData.overall.count.mine = count;
          }
        });
      try {
        const userData = await this.getGitHubUserData();
        projectData.user = userData;
      } catch (err) {
        console.error(err);
        delete projectData.user;
      }
      this.setProjectData(projectData);
    },
    getGitHubUserData () {
      return fetch('https://api.github.com/users/BluuArc')
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            throw Error(res.statusText);
          }
        });
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

* {
  --primary-background: #212121; /* grey darken-4 */
  --secondary-background: #303030;
}

.card .card__text {
  background-color: var(--secondary-background);
}
</style>
