<template>
  <b-card class="assessmentNav text-center" header="Assessment Navigation" header-bg-variant="primary" header-class="font-weight-bold">
   <ul class="list-unstyled">
    <li v-for="(standard, standardIndex) in assessment.answers" :key="standardIndex">
      <strong>{{ standard.name }}</strong> <b-badge variant="primary" pill>{{ standard.progress || 0 }}%</b-badge>
      <NIST800171Nav v-if="standard.name === 'NIST 800-171'" :standard="standard" :index="standardIndex"></NIST800171Nav>
      <ISO27001Nav v-else-if="standard.name === 'ISO 27001'" :standard="standard" :index="standardIndex"></ISO27001Nav>
      <SANSTOP20Nav v-else-if="standard.name === 'SANS TOP 20'" :standard="standard" :index="standardIndex"></SANSTOP20Nav>
      <NIST80053Nav v-else-if="standard.name === 'NIST 800-53'" :standard="standard" :index="standardIndex"></NIST80053Nav>
      <CMMCNav v-else-if="standard.name === 'CMMC LEVEL1' || standard.name === 'CMMC LEVEL2' || standard.name === 'CMMC LEVEL3' || standard.name === 'CMMC LEVEL4' || standard.name === 'CMMC LEVEL5' || standard.name === 'COBIT 5'" :standard="standard" :index="standardIndex"></CMMCNav>
      <hr />
    </li>
   </ul>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'
import NIST800171Nav from './NIST_800-171/NIST_800-171_Nav'
import ISO27001Nav from './ISO_27001/ISO_27001_Nav'
import SANSTOP20Nav from './SANS_TOP-20/SANS_TOP-20_Nav'
import NIST80053Nav from './NIST_800-53/NIST_800-53_Nav'
import CMMCNav from './CMMC/CMMC_Nav'

export default {
  name: 'AssessmentNav',
  props: {
    standards: Array
  },
  computed: mapState({
    assessment: state => state.openAssessment.assessment,
    currentStandard: state => state.openAssessment.currentStandard,
    currentSection: state => state.openAssessment.currentSection
  }),
  components: {
    NIST800171Nav,
    ISO27001Nav,
    SANSTOP20Nav,
    NIST80053Nav,
    CMMCNav
  }
}
</script>

<style>
  .assessmentNav {
    min-height: 96.75%;
  }
  .list-scrolable {
    overflow-y: auto;
  }
</style>
