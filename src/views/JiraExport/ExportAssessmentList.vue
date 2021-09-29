<template>
  <div>
    <b-row>
      <b-col sm="4" class="py-2" v-for="assessment in assessments" :key="assessment._id">
        <b-card class="h-100" :border-variant="progressVariant(assessment.progress)">
          <i
            slot="header"
            @click="confirmDeleteAssessment(assessment)"
            class="fa fa-trash fa-lg float-right text-secondary"
          ></i>
          <i
            v-if="assessment._id === $store.state.openAssessment.assessment._id"
            class="fa fa-star fa-2x text-primary pull-right"
          ></i>
          <i
            class="icon-list p-3 font-2x1 mr-3 float-left"
            v-bind:class="iconBackground(assessment.progress)"
          ></i>
          <router-link :to="'/jiraexport/' + assessment._id">
            <div class="h4 m-0">
              {{ assessment.name }}
              <small>{{ assessment.organisation }}</small>
            </div>
          </router-link>
          <b-progress
            height="{}"
            class="progress-xs my-3"
            :variant="progressVariant(assessment.progress)"
            :value="assessment.progress"
          />
          <div class="text-center align-bottom">
            This assessment is
            <strong>{{ assessment.progress || 0 }}%</strong> complete
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'ExportAssessmentList',
  data () {
    return {
      assessments: []
    }
  },
  methods: {
    getAssessments () {
      var data = {
        organisation: localStorage.getItem('organisation'),
        user: localStorage.getItem('vuex')
      }
      this.$store
        .dispatch('getAllAssessments', data)
        .then(response => {
          this.assessments = response
        })
        .catch(err => {
          if (err.message === 'Unauthorized') {
            this.$router.push('/login')
          } else {
            this.error = err
          }
          console.error(err)
        })
    },
    progressVariant (progress) {
      if (!progress) { return 'danger' }
      return progress < 100 ? 'warning' : 'success'
    },
    iconBackground (progress) {
      if (!progress) { return 'bg-danger' }
      return progress < 100 ? 'bg-warning' : 'bg-success'
    }
  },
  mounted () {
    if (localStorage.getItem('organisation')) {
      this.isOrganisationApplicable = false
    } else {
      this.isOrganisationApplicable = true
    }
    this.getAssessments()
    if ((this.$store.state.user.trialDetails.status === 1) && (this.$store.state.user.trialRemainingDays <= 0)) {
      this.$store.dispatch('showTrialModal')
    }
  }
}
</script>
<style>
#cmmcLevels {
  background: none;
}
</style>
