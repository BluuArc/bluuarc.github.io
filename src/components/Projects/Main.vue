<template>
  <v-container grid-list-lg>
    <v-layout>
      <v-flex xs12>
        <p v-if="!projectData">Loading project data...</p>
        <section v-else>
          <v-card id="profile-overview-card">
            <v-container fluid grid-list-lg>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-card-title>
                    <h3 class="headline">Profile Overview</h3>
                  </v-card-title>
                </v-flex>
              </v-layout>
              <v-layout row wrap v-if="userData">
                <v-flex md3 sm12>
                  <v-card-media
                    :src="userData.avatar_url"
                    height="200px"
                    contain/>
                </v-flex>
                <v-flex md9 sm12>
                  <v-card-text class="text-xs-center">
                    <h3 class="headline">{{ userData.name }} ({{ userData.login }})</h3>
                    <p>
                      <span>GitHub user since</span>
                      <v-tooltip top>
                        <span slot="activator">
                          <abbr :title="userCreationDate">
                            <b>{{ getTimeFromNow(userData.created_at) }}</b>
                          </abbr>
                        </span>
                        <span>{{ userCreationDate }}</span>
                      </v-tooltip>
                    </p>
                    <p>Contributed to at least <b>{{ projectData.overall.count.total }} projects</b>, owning {{ projectData.overall.count.mine }} of them.</p>
                    <p>{{ projectData.user.followers }} follower(s) and following {{ projectData.user.following }} user(s)</p>
                    <p>
                      <span>User information last updated</span>
                      <v-tooltip top>
                        <span slot="activator">
                          <abbr :title="userUpdateTime">
                            {{ getTimeFromNow(userData.updated_at) }}
                          </abbr>
                        </span>
                        <span>{{ userUpdateTime }}</span>
                      </v-tooltip>
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
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import LanguageSection from '@/components/Projects/LanguageSection';

export default {
  components: {
    'language-section': LanguageSection
  },
  computed: {
    ...mapState(['projectData']),
    userData () {
      if (!this.projectData) {
        return;
      }
      return this.projectData.user;
    },
    userCreationDate () {
      if (!this.userData) {
        return new Date().toDateString();
      }
      return new Date(this.userData.created_at).toDateString();
    },
    userUpdateTime () {
      if (!this.userData) {
        return new Date().toDateString();
      }
      return new Date(this.userData.updated_at).toDateString();
    }
  },
  methods: {
    getTimeFromNow (input) {
      return moment(input).fromNow();
    }
  }
};
</script>
