<template>
  <div>
    <language-bar v-once :languages="languages"/>
    <langauge-list :languages="languages"/>
  </div>
</template>

<script>
import Bar from '@/components/Projects/LanguageBar';
import List from '@/components/Projects/LanguageBarList';
export default {
  components: {
    'language-bar': Bar,
    'langauge-list': List
  },
  props: {
    languages: {
      required: true,
      type: Array
    }
  }
};
</script>
