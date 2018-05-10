<template>
  <v-tooltip :top="top" :bottom="bottom" :left="left" :right="right">
    <span slot="activator">
      <span class="date-text">{{ timeFromNow }}</span>
    </span>
    <span>{{ dateString }}</span>
  </v-tooltip>
</template>

<script>
import moment from 'moment';
export default {
  props: ['top', 'bottom', 'left', 'right', 'date'],
  computed: {
    timeFromNow () {
      return moment(this.date).fromNow();
    },
    dateString () {
      return new Date(this.date).toDateString();
    }
  }
};
</script>

<style scoped>
.date-text {
  border-bottom: 1px dotted;
  text-decoration: none;
}
</style>
