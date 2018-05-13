<template>
  <v-container grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card id="tech-used">
          <v-card-title>
            <h3 class="headline">Technologies Used</h3>
          </v-card-title>
          <v-card-text>
            <v-list>
              <template v-for="(tech, i) in siteTechnologies">
                <v-divider v-if="i !== 0" :key="`${i}_divider`"/>
                <v-list-tile
                  :key="i"
                  :href="tech.link"
                  target="_blank">
                  <v-list-tile-avatar>
                    <img :src="tech.icon"/>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-title v-text="tech.name"/>
                  </v-list-tile-content>
                  <v-spacer/>
                  <v-list-tile-avatar>
                    <v-icon>fas fa-external-link-alt</v-icon>
                  </v-list-tile-avatar>
                </v-list-tile>
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card id="contact-links">
          <v-card-title>
            <h3 class="headline">Contact Information</h3>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-lg>
              <v-layout row wrap>
                <v-flex
                  v-for="(item, i) in contactLinks"
                  :key="i"
                  xs12 sm6 md4 lg3>
                  <v-card
                    class="contact-link"
                    :href="item.link"
                    target="_blank"
                    hover>
                    <v-card-title class="pb-1">
                      <!-- only for image padding along top -->
                    </v-card-title>
                    <v-card-media :src="item.icon" height="150px" contain/>
                    <v-card-title class="text-xs-center">
                      <h4 class="title mx-auto">{{ item.name }}</h4>
                    </v-card-title>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['contactLinks', 'siteTechnologies'])
  },
  methods: {
    clickHandler () {
      console.debug(arguments);
    }
  }
};
</script>

<style>
#contact-links .card.contact-link:hover {
  /* based on link list hover color */
  background: hsla(0,0%,100%,0.12);
  border: 1px solid hsla(0,0%,100%,0.25);
  margin: -1px;
}
</style>
