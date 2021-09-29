<template>
  <div class="animated fadeIn">
    <b-row v-if="created" class="justify-content-center">
      <b-col sm="8">
        <b-alert show dismissible variant="success" class="text-center">
          <strong><i class="fa fa-warning"></i> Success:</strong> Your new assessment has been created!
        </b-alert>
      </b-col>
    </b-row>
    <b-row v-if="error" class="justify-content-center">
      <b-col sm="8">
        <b-alert show dismissible variant="danger" class="text-center">
          <strong><i class="fa fa-warning"></i> Error:</strong> {{ error }}
        </b-alert>
      </b-col>
    </b-row>
    <b-row class="justify-content-center">
      <b-col sm="8">
        <b-card class="text-center" :title="`Assessment Overview (${assessment.name})`" :sub-title="assessment.organisation" border-variant="primary">
          <b-progress class="mt-5">
            <b-progress-bar variant="success" striped animated :value="assessment.progress || 0"></b-progress-bar>
            <b-progress-bar variant="danger" striped animated :value="100 - (assessment.progress || 0)"></b-progress-bar>
          </b-progress>
          <p class="mb-5">The assessment is <strong>{{ assessment.progress || 0 }}%</strong> complete</p>
          <b-row class="m-4">
            <b-col><strong>Location:</strong> {{ assessment.location }}</b-col>
            <b-col><strong>Created:</strong> {{ assessment.createdAt | formatDate }}</b-col>
            <b-col><strong>Last Updated:</strong> {{ assessment.updatedAt | formatDate }}</b-col>
          </b-row>
          <b-row class="justify-content-center mb-12 assessment-custom-display">
            <b-button v-b-modal.generateReportModal size="lg" variant="success" v-if="assessment.progress === 100">Generate Report</b-button>
            <b-button v-b-modal.generateSSPModal size="lg" variant="success" v-if="assessment.progress === 100 && (assessment.answers[0].name.includes('NIST') || assessment.answers[0].name.includes('CMMC'))">Generate SSP</b-button>
          </b-row>
          <h4 class="mb-4">Security Standards</h4>
          <b-row class="justify-content-center">
            <b-col sm="8">
              <b-card class="mb-2" v-for="standard in assessment.answers" :key="standard._id" :header="standard.name" header-bg-variant="primary">
                <b-card-body>
                  <p>{{ standard.description }}</p>
                  <b-progress class="mt-2">
                    <b-progress-bar variant="success" striped animated :value="standard.progress || 0"></b-progress-bar>
                    <b-progress-bar variant="danger" striped animated :value="100 - (standard.progress || 0)"></b-progress-bar>
                  </b-progress>
                  <p class="mb-4">This standard is <strong>{{ standard.progress || 0 }}%</strong> complete</p>
                  <b-button class="mb-2" v-b-toggle="'sections' + standard._id" variant="primary">Show Sections</b-button>
                  <b-collapse :id="'sections' + standard._id" accordion="standards-accordion" class="mt-4">
                      <StandardSections :standard="standard"></StandardSections>
                  </b-collapse>
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
          <b-row class="justify-content-center">
            <b-button size="lg" variant="success" class="mt-4" @click.prevent="openAssessment">Open Assessment</b-button>
            <!-- <b-button size="lg" variant="success" class="mt-4" @click="sendTaskToJira">send issue</b-button> -->
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-modal id="generateReportModal" ref="modal" title="Generate Report" centered lazy header-bg-variant="primary" @ok="handleOk" @shown="clearReportData">
      <b-form id="reportForm" @submit.stop.prevent="generateReport" novalidate>
        <b-form-group id="reportNameGroup" label="Report Name:">
          <b-form-input id="reportName" v-model="report.name" placeholder="Please give the report a name..." required></b-form-input>
          <b-form-invalid-feedback>Please provide a report name.</b-form-invalid-feedback>
        </b-form-group>
      </b-form>
    </b-modal>
    <b-modal id="generateSSPModal" ref="modal" title="Generate System Security Plan" centered lazy header-bg-variant="primary" @ok="handleGenerateSSPOk" @shown="clearReportData">
      <b-form id="sspForm" @submit.stop.prevent="generateSSP" novalidate>
        <b-form-group id="sspNameGroup" label="SSP Document Name:">
          <b-form-input id="sspName" v-model="report.name" placeholder="Please give the ssp document name..." required></b-form-input>
          <b-form-invalid-feedback>Please provide a ssp document name.</b-form-invalid-feedback>
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import StandardSections from '../../components/standards/StandardSections'
import moment from 'moment'

export default {
  name: 'ViewAssessment',
  data () {
    return {
      created: Boolean(this.$route.query.created),
      error: '',
      assessment: {},
      report: {}
    }
  },
  components: { StandardSections },
  methods: {
    getAssessment () {
      this.$store.dispatch('getAssessment', { id: this.$route.params.id })
        .then((response) => {
          this.assessment = response
        })
        .catch((err) => {
          if (err.message === 'Unauthorized') {
            this.$router.push('/login')
          } else {
            this.error = err
          }
          console.error(err)
        })
    },
    openAssessment () {
      let assessmentPath = `/assessments/${this.$route.params.id}/answers`
      if (!this.assessment.progress || this.assessment.progress === 0) { assessmentPath = assessmentPath + '?justStarted=true' }
      this.$router.push({ path: assessmentPath })
    },
    generateReport () {
      this.$store.dispatch('createReport', {
        name: this.report.name,
        assessment: this.$route.params.id
      })
        .then(response => this.$router.push(`/reports/${response.created}?created=true`))
        .catch(err => {
          if (err.message === 'Unauthorized') {
            this.$router.push('/login')
          } else {
            this.error = err.message
          }
        })
    },
    generateSSP () {
      this.$store.dispatch('createSSP', {
        name: this.report.name,
        assessment: this.$route.params.id
      })
        .then(response => this.$router.push(`/ssp/${response.created}?created=true`))
        .catch(err => {
          if (err.message === 'Unauthorized') {
            this.$router.push('/login')
          } else {
            this.error = err.message
          }
        })
    },
    handleOk (event) {
      event.preventDefault()
      const form = document.getElementById('reportForm')
      if (!form.checkValidity()) {
        event.preventDefault()
        form.classList.add('was-validated')
      } else {
        this.generateReport()
      }
    },
    handleGenerateSSPOk (event) {
      event.preventDefault()
      const form = document.getElementById('sspForm')
      if (!form.checkValidity()) {
        event.preventDefault()
        form.classList.add('was-validated')
      } else {
        this.generateSSP()
      }
    },
    clearReportData () {
      this.report.name = ''
    },
    sendTaskToJira () {
      console.log('sendTaskToJira is called::::')
      this.$store.dispatch('sendTaskToJira', {
        name: 'this.report.name',
        assessment: 'this.$route.params.id'
      })
        .then(response => {
          console.log('response in  sendtaskt to jira :::::', response)
        })
        .catch(err => {
          if (err.message === 'Unauthorized') {
            this.$router.push('/login')
          } else {
            this.error = err.message
          }
        })
    }
  },
  filters: {
    formatDate (date) {
      return moment(String(date)).format('LLL')
    }
  },
  mounted () {
    this.getAssessment()
  }
}
</script>
<style>
.assessment-custom-display {
  display: block;
}
</style>
