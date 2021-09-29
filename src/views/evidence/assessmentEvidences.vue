<template>
  <div class="animated fadeIn">
    <b-row class="justify-content-end mb-2 init-div">
      <i class="fa fa-star text-primary"></i> = Assessment currently open
    </b-row>
    <b-row v-if="error" class="justify-content-center">
      <b-col sm="8">
        <b-alert show dismissible variant="danger" class="text-center">
          <strong><i class="fa fa-warning"></i> Error:</strong> {{ error }}
        </b-alert>
      </b-col>
    </b-row>
    <b-row>

      <b-col sm="4" class="py-2" v-for="assessment in assessments" :key="assessment._id">
        <b-card class="h-100" :border-variant="progressVariant(assessment.progress)">
          <i v-if="assessment._id === $store.state.openAssessment.assessment._id" class="fa fa-star fa-2x text-primary pull-right"></i>
          <i class="icon-list p-3 font-2x1 mr-3 float-left" v-bind:class="iconBackground(assessment.progress)"></i>
          <router-link :to="'/evidence/' + assessment._id">
            <div class="h4 m-0">{{ assessment.name }} <small>{{ assessment.organisation }}</small></div>
          </router-link>
          <b-progress height={} class="progress-xs my-3" :variant="progressVariant(assessment.progress)" :value="assessment.progress" />
          <div class="text-center align-bottom">This assessment is <strong>{{ assessment.progress || 0 }}%</strong> complete</div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'MyAssessments',
  data () {
    return {
      checked: true,
      error: '',
      assessments: [],
      selectedAssessment: {},
      standards: [],
      assessmentData: {
        name: '',
        type: '',
        organisation: '',
        location: '',
        standards: []
      }
    }
  },
  methods: {
    getAssessments () {
      // this.$store.dispatch('getAssessments')
      //   .then((response) => { this.assessments = response })
      //   .catch((err) => {
      //     this.error = err
      //     console.error(err)
      //   })
      var data = {
        organisation: localStorage.getItem('organisation'),
        user: localStorage.getItem('vuex')
      }
      this.$store.dispatch('getAllAssessments', data)
        .then((response) => {
          this.assessments = response
        })
        .catch((err) => {
          if (err.message === 'Unauthorized') {
            this.$router.push('/login')
          } else {
            this.error = err.message
          }
          console.error(err)
        })
    },
    getStandards () {
      this.$store.dispatch('getStandards')
        .then((response) => {
          this.standards = response.map((standard) => {
            return { value: standard._id, text: standard.name }
          })
        })
        .catch((err) => {
          if (err.message === 'Unauthorized') {
            this.$router.push('/login')
          } else {
            this.error = err.message
          }
          console.error(err)
        })
    },
    handleOk (event) {
      event.preventDefault()
      const form = document.getElementById('assessmentForm')
      if (!form.checkValidity()) {
        event.preventDefault()
        form.classList.add('was-validated')
      } else {
        this.createAssessment()
      }
    },
    createAssessment () {
      this.$store.dispatch('createAssessment', this.assessmentData)
        .then(response => this.$router.push(`/assessments/${response.created}?created=true`))
        .catch(err => alert(err))
    },
    clearAssessmentData () {
      this.assessmentData.name = ''
      this.assessmentData.organisation = ''
      this.assessmentData.location = ''
      this.assessmentData.standards = []
    },
    progressVariant (progress) {
      if (!progress) { return 'danger' }
      return progress < 100 ? 'warning' : 'success'
    },
    deleteAssessment (assessmentId) {
      this.$store.dispatch('deleteAssessment', assessmentId)
        .then(response => {
          this.getAssessments()
          this.$refs['deleteModal'].hide()
        })
        .catch(err => alert(err))
    },
    iconBackground (progress) {
      if (!progress) { return 'bg-danger' }
      return progress < 100 ? 'bg-warning' : 'bg-success'
    }
  },
  mounted () {
    this.getAssessments()
    this.getStandards()
    if ((this.$store.state.user.trialDetails.status === 1) && (this.$store.state.user.trialRemainingDays <= 0)) {
      this.$store.dispatch('showTrialModal')
    }
  }
}
</script>
