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
                  target="_blank"
                  rel="noopener">
                  <v-list-tile-avatar>
                    <img :src="tech.icon"/>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title v-text="tech.name"/>
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
                    rel="noopener"
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
      <v-flex xs12>
        <v-card id="site-history">
          <v-card-title>
            <h3 class="headline">Site History</h3>
          </v-card-title>
          <v-card-text>
            <v-container fluid grid-list-md>
              <v-layout row wrap class="hidden-xs-only">
                <v-flex
                  v-for="(item, i) in oldSites"
                  :key="i"
                  xs12> 
                  <v-card>
                    <v-container fluid grid-list-lg>
                      <v-layout row wrap>
                        <v-flex xs12 sm6>
                          <v-card-title class="pb-0" style="background-color: var(--secondary-background);">
                            <h3 class="title">{{ item.name }}</h3>
                          </v-card-title>
                          <v-card-title class="pt-1" style="background-color: var(--secondary-background);">
                            <h4 class="subheading" v-if="item.lastUpdated">
                              <span>Last Used/Updated:</span>
                              <date-text :top="true" :date="item.lastUpdated"/>
                            </h4>
                            <h4 class="subheading" v-else>Current Version</h4>
                          </v-card-title>
                          <v-card-text v-html="item.description"/>
                          <v-card-actions style="background-color: var(--secondary-background);">
                            <v-btn outline block :href="item.link" target="_blank" rel="noopener">Visit Site</v-btn>
                          </v-card-actions>
                        </v-flex>
                        <v-flex xs12 sm6 class="hidden-xs-only">
                          <v-card-media
                          :src="item.image"
                          height="100%"/>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-flex>
              </v-layout>
              <v-layout row wrap class="hidden-sm-and-up">
                <v-flex
                  v-for="(item, i) in oldSites"
                  :key="i"
                  xs12 sm6 md4>
                  <v-card raised>
                    <v-card-media
                      v-if="item.image"
                      :src="item.image"
                      height="12rem"/>
                    <v-card-title>
                      <h3 class="title">{{ item.name }}</h3>
                    </v-card-title>
                    <v-card-title class="pt-0">
                      <h4 class="subheading" v-if="item.lastUpdated">
                        <span>Last Used/Updated:</span>
                        <date-text :top="true" :date="item.lastUpdated"/>
                      </h4>
                      <h4 class="subheading" v-else>Current Version</h4>
                    </v-card-title>
                    <v-card-text style="background-color: var(--primary-background);" v-html="item.description"/>
                    <v-card-actions>
                      <v-btn flat :href="item.link" target="_blank" rel="noopener">Visit Site</v-btn>
                    </v-card-actions>
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
import DateText from '@/components/DateText';

export default {
  components: {
    'date-text': DateText
  },
  computed: {
    ...mapState(['contactLinks', 'siteTechnologies', 'oldSites'])
  },
  methods: {
    clickHandler () {
      console.debug(arguments);
    }
  },
  mounted () {
    // make site image positions (center, top)
    const siteHistoryCard = document.querySelector('#site-history');
    const historyImages = Array.from(siteHistoryCard.getElementsByClassName('card__media__background'));
    historyImages.forEach(elem => {
      elem.style.backgroundPositionY = 'top';
    });
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

#contact-links a, #tech-used a {
  color: white;
}
</style>
