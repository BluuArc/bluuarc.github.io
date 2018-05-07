<template>
  <v-container grid-list-lg id="home-page" v-resize="checkIfIsXsMobile">
    <v-layout row wrap>
      <v-flex xs12>
        <v-card id="about-card">
          <v-card-media
            v-show="isXsMobile"
            :src="require('../../assets/img/avatar.jpg')"
            height="12rem"
            id="avatar"/>
          <v-card-title v-show="isXsMobile" primary-title style="display: inline-block">
            <div v-html="aboutMeHtml"/>
          </v-card-title>
          <v-container fluid grid-list-lg v-show="!isXsMobile">
            <v-layout row>
              <v-flex xs3>
                <v-card-media
                  :src="require('../../assets/img/avatar.jpg')"
                  height="150px"
                  contain
                  id="avatar"/>
              </v-flex>
              <v-flex xs9>
                <div v-html="aboutMeHtml"/>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card id="work-card">
          <v-card-title primary-title>
            <h3 class="headline">Work Experience</h3>
          </v-card-title>
          <v-card-text>
            <v-stepper vertical non-linear color="transparent">
              <template v-for="(job, i) in jobs">
                <v-stepper-step
                editable
                :key="`${i}_step`"
                :step="i + 1"
                edit-icon="">
                  {{ job.name }}
                  <small>{{ job.time }}</small>
                </v-stepper-step>
                <v-stepper-content :key="`${i}_content`" :step="i + 1">
                  <h4 class="subheading">{{ job.company }} | {{ job.location }}</h4>
                  <p class="body-2" v-html="job.desc.join('')"/>
                </v-stepper-content>  
              </template>
            </v-stepper>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card id="course-card">
          <v-card-title primary-title>
            <h3 class="headline">Coursework</h3>
            <v-spacer/>
            <v-text-field
              v-model="courseSearch"
              append-icon="search"
              label="Search Courses"
              single-line
              hide-details
              color="secondary"/>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :search="courseSearch"
              :custom-sort="sortCourses"
              :headers="courseHeaders"
              :items="courses"
              item-key="CourseName"
              disable-initial-sort>
              <template slot="items" slot-scope="props">
                <td>{{ props.item.CourseName }}</td>
                <td>{{ props.item.Semester }}</td>
                <td>{{ props.item['Languages/Technologies/Techniques'] }}</td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapGetters('display', ['breakpointToDisplaySize']),
    ...mapState(['jobs', 'courses']),
    aboutMeHtml () {
      return `
        <h3 class="headline">About Me</h3>
        <p class="body-2">
          I am Joshua Castor, and I enjoy programming stuff.
          My current focus is on frontend (and some backend) with JavaScript,
          but I'm open to learning other languages and technologies.
        </p>
        <p class="body-2">
          <b>Education:</b> BS in Computer Science (Software Engineering Concentration) @ University of Illinois at Chicago, Fall 2015 - Fall 2018
          <br>
          <b>Interests:</b> web development, visual analytics, cybersecurity
        </p>
      `;
    },
    courseHeaders () {
      return [
        { text: 'Course Name', value: 'CourseName' },
        { text: 'Semester', value: 'Semester' },
        { text: 'Languages/Technologies/Techniques', value: 'Languages/Technologies/Techniques' }
      ];
    },
    courseSortMethods () {
      return {
        CourseName: (items, isDescending) => {
          return items.sort((a, b) => {
            let isBefore = a.CourseName < b.CourseName;
            if (isDescending) {
              isBefore = !isBefore;
            }
            if (isBefore) {
              return -1;
            } else {
              return 1;
            }
          });
        },
        'Languages/Technologies/Techniques': (items, isDescending) => {
          return items.sort((a, b) => {
            let isBefore = a['Languages/Technologies/Techniques'] < b['Languages/Technologies/Techniques'];
            if (isDescending) {
              isBefore = !isBefore;
            }
            if (isBefore) {
              return -1;
            } else {
              return 1;
            }
          });
        },
        Semester: (items, isDescending) => {
          const convertSemesterToDate = (semester) => new Date(semester.replace('Fall', 'August').replace('Spring', 'January'));
          return items.sort((a, b) => {
            const diff = convertSemesterToDate(a.Semester) - convertSemesterToDate(b.Semester);
            return isDescending ? -diff : diff;
          });
        }
      };
    }
  },
  data () {
    return {
      isXsMobile: false,
      courseSearch: ''
    };
  },
  methods: {
    checkIfIsXsMobile () {
      const smallBreakpointCutoff = this.breakpointToDisplaySize('xs');
      this.isXsMobile = window.innerWidth <= smallBreakpointCutoff;
    },
    sortCourses (items, sortColumn, isDescending) {
      return this.courseSortMethods[sortColumn || 'Semester'](items, isDescending);
    }
  }
};
</script>

<style>
#work-card li {
  margin-left: 1em;
}

#work-card a {
  /* deep-orange lighten-2 */
  color: #FF8A65;
}

#work-card a:visited {
  /* deep-orange darken-1 */
  color: #F4511E;
}
</style>
