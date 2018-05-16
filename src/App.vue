<template>
  <v-app dark v-resize="displayChangeHandler" class="grey darken-4">
    <app-toolbar/>
    <v-content>
      <router-multi-view
        name="slide-y-transition"
        morph="transition-group"/>
      <noscript>
        <div class="statcounter">
          <a title="shopify site analytics" target="_blank" rel="noopener" href="http://statcounter.com/shopify/">
            <img class="statcounter" alt="shopify site analytics" src="//c.statcounter.com/11034084/0/3e7dba9f/1/">
          </a>
        </div>
      </noscript>
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
    this.loadGoogleAnalyticsTracker();
    this.loadStatCounterTracker();
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
        let lastActiveTime;
        try {
          lastActiveTime = await this.getLastActiveTime();
        } catch (err) {
          console.error(err);
        }
        projectData.user = userData;
        if (lastActiveTime) {
          projectData.user.last_active = lastActiveTime;
        }
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
    },
    getLastActiveTime () {
      return fetch('https://api.github.com/users/BluuArc/events')
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            throw Error(res.statusText);
          }
        }).then(jsonResponse => {
          const myEvents = jsonResponse.filter(e => e.actor.login === 'BluuArc');
          // console.debug(jsonResponse, myEvents);
          if (myEvents.length === 0) {
            throw Error('No event data found');
          } else {
            return myEvents[0].created_at;
          }
        });
    },
    appendScript (url) {
      // pure javascript version of appending a script
      // based off of https://howchoo.com/g/mmu0nguznjg/learn-the-slow-and-fast-way-to-append-elements-to-the-dom
      return new Promise(function (resolve, reject) {
        const e = document.createElement('script');
        e.src = url;
        e.onload = () => { resolve(); };
        e.onerror = reject;
        document.body.appendChild(e);
      });
    },
    async loadGoogleAnalyticsTracker () {
      window.dataLayer = window.dataLayer || [];
      function gtag () {
        window.dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', 'UA-80417877-1');
      await this.appendScript('https://www.googletagmanager.com/gtag/js?id=UA-80417877-1');
    },
    async loadStatCounterTracker () {
      window.sc_project = window.sc_project || 11034084;
      window.sc_invisible = window.sc_invisible || 1;
      window.sc_security = window.sc_security || '3e7dba9f';
      await this.appendScript('https://secure.statcounter.com/counter/counter.js');
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

.card p a:visited {
  /* deep-orange lighten-2 */
  color: #FF8A65;
}

.card p a {
  /* deep-orange darken-1 */
  color: #F4511E;
}
</style>
