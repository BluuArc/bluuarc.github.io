<template>
  <v-container grid-list-lg>
    <v-layout>
      <v-flex xs12>
        <v-list>
          <template v-for="(item, i) in contactLinks">
            <v-divider
              v-if="i > 0 && i < contactLinks.length"
              :key="`${i}_divider`"
              :inset="true"
              :divider="true"/>
            <v-list-tile
              :key="i"
              :href="item.link"
              avatar>
              <v-list-tile-avatar tile>
                <img :src="item.icon" :alt="`${item.name} icon`">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon color="grey lighten-1">fas fa-external-link-alt</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['contactLinks'])
  },
  methods: {
    clickHandler () {
      console.debug(arguments);
    }
  }
};
</script>
