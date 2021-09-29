<template>
  <div class="animated fadeIn">
    <b-row v-if="error" class="justify-content-center">
      <b-col sm="8">
        <b-alert show dismissable variand="danger" class="text-center">
          <strong><i class="fa fa-warning"></i> Error:</strong> {{ error }}
        </b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col v-if="reports.length < 1" sm="8" class="offset-sm-2">
        <b-card class="text-center" title="No Reports Found">
          <p>Uh-Oh! It doesn't look like you have any reports yet.</p>
          <p>You will first need to <b-link to="/assessments">Create an Assessment</b-link> before you can view any reports.</p>
        </b-card>
      </b-col>
      <b-col v-else sm="3" class="py-2" v-for="report in reports" :key="report._id">
        <b-card class="h-100" border-variant="primary">
          <router-link :to="'/reports/' + report._id" style="position: absolute; top: 0; left: 0; height: 100%; width: 100%"></router-link>
          <div class="text-center">
            <i class="fa fa-5x fa-file-text-o mb-4 text-primary"></i>
            <h4>{{ report.name }}</h4><small>({{ report.data.assessmentName }})</small>
            <p>{{ report.data.organisation }}</p>
            <p>{{ report.createdAt | formatDate }}</p>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Reports',
  data () {
    return {
      error: '',
      reports: [],
      testReport: {
        _id: 12345
      }
    }
  },
  methods: {
    getReports () {
      this.$store.dispatch('listReports')
        .then((response) => { this.reports = response })
        .catch((err) => {
          if (err.message === 'Unauthorized') {
            this.$router.push('/login')
          } else {
            this.error = err.message
          }
          console.error(err)
        })
    }
  },
  filters: {
    formatDate (date) {
      return moment(String(date)).format('LLL')
    }
  },
  mounted () {
    this.getReports()
    if ((this.$store.state.user.trialDetails.status === 1) && (this.$store.state.user.trialRemainingDays <= 0)) {
      this.$store.dispatch('showTrialModal')
    }
  }
}
</script>
