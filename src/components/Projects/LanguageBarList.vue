<template>
  <v-container grid-list-xs>
    <v-layout row wrap>
      <v-flex
        xs4 md3
        v-for="(language, index) in processedLanguages"
        :key="index">
        <v-btn>
          <v-icon>mdi-anchor</v-icon>
          <span>{{ language.name }}</span>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: {
    languages: {
      required: true,
      type: Array
    }
  },
  computed: {
    processedLanguages () {
      const languages = this.languages.slice();
      const maxSize = languages.reduce((acc, current) => acc + current.size, 0);
      let cumulativeSize = 0.0; // used for "stacking" of bars
      return languages
        .sort((a, b) => b.size - a.size)
        .map(({size, name, color}) => {
          const actualSize = size / maxSize;
          const barSize = cumulativeSize + actualSize;
          cumulativeSize += actualSize;
          return {
            actualSize,
            barSize,
            name,
            color
          };
        });
    }
  }
};
</script>
