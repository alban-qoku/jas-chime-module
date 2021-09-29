<template>
  <ul class="list-unstyled list-scrolable">
    <li v-for="(section, sectionNavIndex) in standard.assessmentData.data.sections" :key="'nav_' + sectionNavIndex">
      <b-btn variant="link" @click="clickNavBar(sectionNavIndex)">
        <i class="fa fa-star" v-if="index === currentStandard && sectionNavIndex === currentSection"></i>
        <span :class="isOpen(sectionNavIndex)">{{ section.name.match(/(\d+?\.\d+)\s?.*/)[1] }}</span> <i v-if="section.progress === 100" class="text-success fa fa-check"></i>
      </b-btn>
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ISO27001Nav',
  props: {
    standard: Object,
    index: Number
  },
  computed: mapState({
    assessment: state => state.openAssessment.assessment,
    currentStandard: state => state.openAssessment.currentStandard,
    currentSection: state => state.openAssessment.currentSection
  }),
  methods: {
    isOpen (sectionIndex) {
      return {
        'font-weight-bold': this.index === this.currentStandard && sectionIndex === this.currentSection
      }
    },
    clickNavBar (sectionNavIndex) {
      this.$store.dispatch('assessmentNav', {
        standard: this.$store.getters.currentStandard,
        section: sectionNavIndex,
        question: 0
      })
      this.$store.dispatch('scrollToTop')
    }
  }
}
</script>
