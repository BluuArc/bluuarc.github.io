<template>
  <v-card>
    <v-card-title primary-title>
      <h3 class="headline">{{ project.name }}</h3>
    </v-card-title>
    <v-card-text class="pb-0">
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
            <p><b>Owner:</b> {{ project.owner }}</p>
            <p>
              <b>Created:</b>
              <date-text :top="true" :date="project.createdAt"/>
            </p>
            <p>
              <b>Last Commit:</b>
              <date-text :top="true" :date="project.lastPushedAt"/>
            </p>
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
import DateText from '@/components/DateText';
import LanguageSection from '@/components/Projects/LanguageSection';

export default {
  props: {
    project: {
      required: true,
      type: Object
    }
  },
  components: {
    'language-section': LanguageSection,
    'date-text': DateText
  }
};
</script>
