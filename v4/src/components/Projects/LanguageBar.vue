<template>
  <div role="progressbar" class="mdc-linear-progress languageEntry">
      <v-progress-linear
        v-for="(language, index) in processedLanguages"
        :key="language.name"
        :value="language.barSize * 100"
        background-color="grey darken-3"
        :color="language.color"
        :data-language-color="language.color"
        :data-language-name="language.name"
        :style="getBarStyle(index)"
        :language="language.name"
        height="10"
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
      const elems = this.$el.getElementsByClassName('progress-linear');
      for (let i = 0; i < elems.length; ++i) {
        const elem = elems.item(i);
        const color = elem.dataset.languageColor;
        const name = elem.dataset.languageName;
        if (!color && name !== 'Arduino') {
          console.debug('no color found for', name);
          continue;
        }
        const bar = elem.getElementsByClassName('progress-linear__bar__determinate')[0];
        bar.style.backgroundColor = color || '#fff';
        bar.classList.remove(color);
      }
    },
    getBarStyle (index) {
      if (index === 0) {
        return {
          'border-radius': '0.25rem'
        };
      }
      return {
        position: 'absolute',
        margin: 0,
        top: 0,
        'border-radius': '0.25rem'
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
