<template>
  <v-container grid-list-xs>
    <v-layout row wrap>
      <v-flex
        xs12 md3
        v-for="(language, index) in processedLanguages"
        :key="index">
        <v-btn block flat class="language-btn">
          <v-icon
            small left
            class="language-circle"
            :data-language-color="language.color">
            fas fa-circle
          </v-icon>
          <span>{{ language.name }} ({{ (language.actualSize * 100).toFixed(2) }}%)</span>
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
  },
  mounted () {
    this.convertHexColors();
  },
  methods: {
    convertHexColors () {
      const elems = this.$el.getElementsByClassName('language-circle');
      for (let i = 0; i < elems.length; ++i) {
        const elem = elems.item(i);
        const color = elem.dataset.languageColor;
        if (!color) {
          continue;
        }
        elem.style.color = color;
      }
    }
  }
};
</script>

<style>
.language-circle {
  border: 1.5px solid #EEE;
  border-radius: 50%;
}

.language-btn {
  pointer-events: none;
}
</style>
