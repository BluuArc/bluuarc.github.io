<template>
  <div role="progressbar" class="mdc-linear-progress languageEntry">
      <v-progress-linear
        v-for="(language, index) in processedLanguages"
        :key="language.name"
        :color="language.color"
        :value="language.barSize * 100"
        background-color="grey darken-3"
        :style="getBarStyle(index)"
        :language="language.name"
      />
  </div>
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
        }).reverse();
    }
  },
  mounted () {
    this.convertHexColors();
  },
  methods: {
    convertHexColors () {
      const elems = this.$el.getElementsByClassName('progress-linear__bar__determinate');
      for (let i = 0; i < elems.length; ++i) {
        const elem = elems.item(i);
        const color = elem.classList.value.split(' ').filter(c => c.includes('#'))[0];
        if (!color) {
          continue;
        }
        elem.style.backgroundColor = color;
        elem.classList.remove(color);
      }
    },
    getBarStyle (index) {
      if (index === 0) {
        return;
      }
      return {
        position: 'absolute',
        margin: 0,
        top: 0
      };
    }
  }
};
</script>

<style scoped>
.languageEntry {
  position: relative;
}
</style>
