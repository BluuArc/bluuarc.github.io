<template>
  <v-card>
    <v-card-title primary-title>
      <h3 class="headline">{{ project.name }}</h3>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-sm>
        <v-layout row wrap>
          <v-flex sm12 md6>
            <p><b>Description</b></p>
            <div v-if="project.description">
              {{ project.description }}
            </div>
            <div v-else>
              No description specified.
            </div>
          </v-flex>
          <v-flex sm12 md6>
            <p><b>Project Information</b></p>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-text>
      <language-section :languages="project.languages"></language-section>
    </v-card-text>
    <v-card-text>
      {{ project }}
    </v-card-text>
  </v-card>
</template>

<script>
import LanguageSection from '@/components/Projects/LanguageSection';

export default {
  props: {
    project: {
      required: true,
      type: Object
    }
  },
  components: {
    'language-section': LanguageSection
  }
};
</script>
