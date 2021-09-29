<template>
  <b-row>
    <b-col sm="4" class="py-2" v-for="assessment in assessments" :key="assessment._id">
    <b-card class="h-100" :border-variant="progressVariant(assessment.progress)">
        <i
        v-if="assessment._id === $store.state.openAssessment.assessment._id"
        class="fa fa-star fa-2x text-primary pull-right"
        ></i>
        <i
        class="icon-list p-3 font-2x1 mr-3 float-left"
        v-bind:class="iconBackground(assessment.progress)"
        ></i>
        <router-link :to="'/poamgenerator/' + assessment._id + '/answers'">
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
    <p
    class="no-data-found"
    v-if="!assessments.length"
    >There no any assessment belogs to CMMC and NIST assessment</p>
  </b-row>
</template>

<script>
export default {
  name: 'GeneratePoam',
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
          const tempArr = response.filter(
            item =>
              item.progress === 100 &&
              (item.answers[0].name === 'NIST 800-171' ||
                item.answers[0].name.includes('CMMC'))
          )
          this.assessments = tempArr
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
      if (!progress) {
        return 'danger'
      }
      return progress < 100 ? 'warning' : 'success'
    },
    iconBackground (progress) {
      if (!progress) {
        return 'bg-danger'
      }
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

<style scoped>
#cmmcLevels {
  background: none;
}

.no-data-found {
  width: 100%;
  text-align: center;
}
</style>
