<template>
  <div class="animated fadeIn">
    <b-row v-if="created" class="justify-content-center">
      <b-col sm="10">
        <b-alert show dismissible variant="success" class="text-center">
          <strong><i class="fa fa-warning"></i> Success:</strong> Your new report has been created!
        </b-alert>
      </b-col>
    </b-row>
    <b-row v-if="error" class="justify-content-center">
      <b-col sm="10">
        <b-alert show dismissible variant="danger" class="text-center">
          <strong><i class="fa fa-warning"></i> Error:</strong> {{ error }}
        </b-alert>
      </b-col>
    </b-row>
    <b-row v-if="loading" class="justify-content-center">
      <h1><i class="fa fa-spinner fa-pulse fa-3x text-primary"></i></h1>
    </b-row>
    <b-row v-if="!loading" class="justify-content-center">
      <b-col sm="10">
        <b-card id="report" class="text-center" border-variant="primary">
          <b-card-body>
            <b-row class="justify-content-end">
              <b-button disabled variant="primary" v-b-tooltip.hover title="Download Report" ><i class="fa fa-download" v-on:click="downloadReportAsPdf()"  ></i></b-button>
            </b-row>
            <b-row class="justify-content-center">
              <div class="page-header">
                <img src="/static/img/JAS_Full_Logo.svg" class="mb-4" />
                <h1>{{ report.name }}</h1> <small>{{ report.data.organisation }} - {{ report.createdAt | formatDate }}</small>
              </div>
            </b-row>
            <h2><i>Disclaimer</i></h2>
            <p><i>The analysis, data, and reports in the Justified Assessment Solution (JAS)® are provided “as is” for informational purposes only. Using this assessment software does not provide any warranties of any kind regarding any information contained within. In no event shall the developers of the JAS tool be liable for any damages, including but not limited to, direct, indirect, special, or consequential damages and including damages based on any negligence or misuse of this product.</i></p>
            <p><i>The report is prepared and intended for internal use by the organisation that made the request. The contents of this report may be subject to organisational intellectual property rights. The contents of this report may be reproduced or incorporated into other reports, but may not be modified without the prior express written permission of the data owners or content creators.</i></p>
            <h2 id="introduction">Introduction</h2>
            <p>This security assessment report is intended to be used as an approach for understanding the overall status of security controls in your respective environment. This report will aid you in identifying the controls in place and those needing further implementation based upon the answers provided in the accompanying the Justified Assessment Solution(JAS) tool.</p>
            <p>The security assessment should be viewed as documentation to identify and help provide a roadmap for organisation in relation to achieving; adequate planning, identifying security initiatives and achieving a standardized approach to control information about your information systems. This security assessment report should reflect input from various managers with responsibilities concerning the information systems and assets within your environment.</p>
            <div class="text-center mb-4 break-down-pdf">
                <h1><strong>Your overall compliance average is...</strong></h1>
                <p class="text-success display-1 mb-4"><strong>{{compliance.totalAverage}}%</strong></p>
                <div class="text-center" style="display: flex; justify-content: center;">
                  <doughnut
                    :data="generateDoughnutData(report.data.answers)"
                    :options="{responsive: true, maintainAspectRatio: false}"
                  >
                  </doughnut>
                </div>
            </div>
            <b-card v-for="(standard, standardIndex) in report.data.answers" :key="standardIndex" :header="standard.name" header-tag="h3">
              <h4 class="mb-4"><i>{{ standard.description }}</i></h4>
              <p>Standard Compliance is...</p>
              <p class="text-success display-4 mb-4">{{ Math.round((compliance[standard.name].earned / compliance[standard.name].possible) * 100) }}%</p>
              <h4 class="page-header">Answers</h4>
              <div v-for="(section, sectionIndex) in standard.sections" :key="sectionIndex" class="mb-4 table-responsive break-down-pdf">
                <h5>Section {{ section.name }} {{ `- ${section.control_family}` }}</h5>
                <table class="table table-sm table-striped text-center">
                  <thead>
                    <tr>
                      <th>Section</th>
                      <th>Question</th>
                      <th>Selected Answer</th>
                      <th>Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(question, questionIndex) in section.questions" :key="questionIndex">
                      <td>{{ question.section }}</td>
                      <td>{{ question.question }}</td>
                      <td>{{ question.selectedAnswer.answer }}</td>
                      <td>{{ question.comments ? question.comments[0].comment : '' }}</td>
                      <td>
                        <i class="fa fa-check text-success" v-if="question.selectedAnswer.answer === 'Control Met'"></i>
                        <i class="fa fa-check text-warning" v-if="question.selectedAnswer.answer === 'Control Mostly Met'"></i>
                        <i class="fa fa-exclamation text-info" v-else-if="question.selectedAnswer.answer === 'Control Partially Met'"></i>
                        <i class="fa fa-times text-warning" v-else-if="question.selectedAnswer.answer === 'Control Somewhat Met'"></i>
                        <i class="fa fa-times text-danger" v-else-if="question.selectedAnswer.answer === 'Control Not Met'"></i>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </b-card>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Radar from '../../components/charts/Radar'
import Polar from '../../components/charts/Polar'
import Doughnut from '../../components/charts/Doughnut'
import moment from 'moment'
// import JsPDF from 'jspdf'
import html2pdf from 'html2pdf.js'

export default {
  name: 'ViewReport',
  data () {
    return {
      loading: true,
      created: Boolean(this.$route.query.created),
      error: '',
      report: {},
      compliance: {},
      items: {
        // divextracted: document.getElementById('report'),
        reportId: this.$route.params.id
      }

    }
  },
  components: { Radar, Polar, Doughnut },
  methods: {
    getReport () {
      this.$store.dispatch('getReport', { id: this.$route.params.id })
        .then((response) => {
          this.loading = false
          this.report = response
          this.calculateCompliance(response.data.answers)
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
    downloadReportAsPdf () {
      var element = document.getElementById('report')
      html2pdf().from(element).set({
        pagebreak: { before: '.break-down-pdf' },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }).save()
    },
    downloadReportAsHtml (element, filename = ' ') {
      // console.log('Downloading report...')
      //
      // alert('the report is downloaded')
      //
      // // console.log(document.getElementById('report').outerHTML)
      // this.$store.dispatch('downloadReportAsHtml', {reportId: this.items.reportId, html: document.getElementById('report').outerHTML})
      //   .then((data) => {
      //     console.log('report is downloaded' + data)
      //     alert('The report is downloaded')
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //   })

      /// //////////////////////////

      var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>"
      var postHtml = '</body></html>'
      var html = preHtml + document.getElementById(element).innerHTML + postHtml

      var blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
      })

      // Specify link url
      var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html)

      // Specify file name
      filename = filename ? filename + '.doc' : 'document.doc'

      // Create download link element
      var downloadLink = document.createElement('a')

      document.body.appendChild(downloadLink)

      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename)
      } else {
        // Create a link to the file
        downloadLink.href = url

        // Setting the file name
        downloadLink.download = filename

        // triggering the function
        downloadLink.click()
      }

      document.body.removeChild(downloadLink)
    },
    createImage (file) {
      // const image22 = new Image()
      const reader = new FileReader()
      const vm = this

      reader.onload = (e) => {
        vm.image = e.target.result
      }
      reader.readAsDataURL(file)
    },
    calculateCompliance (standards) {
      const scores = {}
      standards.forEach((standard) => {
        scores[standard.name] = this.calculateStandardScore(standard)
      })
      const totalEarned = Object.values(scores).reduce((prev, value) => prev + value.earned, 0)
      const totalPossible = Object.values(scores).reduce((prev, value) => prev + value.possible, 0)
      scores.totalAverage = Math.round((totalEarned / totalPossible) * 100)
      scores.totalEarned = totalEarned
      scores.totalPossible = totalPossible
      console.log(scores)
      this.compliance = scores
    },
    calculateStandardScore (standard) {
      const totalQuestions = standard.sections.map(section => section.questions.length).reduce((prev, curr) => prev + curr)
      const totalScore = [].concat.apply([], standard.sections.map(section => section.questions.map(question => question.selectedAnswer.points))).reduce((prev, curr) => prev + curr)
      return { name: standard.name, possible: totalQuestions, earned: totalScore }
    },
    generateDoughnutData (data) {
      const datasets = []
      data.forEach((standard) => {
        datasets.push(this.generatePercentageStats(standard))
      })
      return {
        labels: ['Control Met', 'Control Mostly Met', 'Control Partially Met', 'Control Somewhat Met', 'Control Not Met'],
        datasets
      }
    },
    generateStandardStats (standard, index) {
      const standardStats = [].concat.apply([], standard.sections.map(section => section.questions.map(question => question.selectedAnswer.answer))).reduce((map, answer) => { map[answer] = (map[answer] || 0) + 1; return map }, {})
      const data = this.aggregateStandardStats(standardStats)
      const colors = this.generateStandardColors(index)
      return {
        label: standard.name,
        backgroundColor: colors.backgroundColor,
        pointBackgroundColor: colors.pointBackgroundColor,
        pointBorderColor: colors.pointBorderColor,
        pointHoverBackgroundColor: colors.pointHoverBackgroundColor,
        pointHoverBorderColor: colors.pointHoverBackgroundColor,
        data
      }
    },
    generatePercentageStats (standard) {
      const totalQuestions = standard.sections.map(section => section.questions.length).reduce((prev, curr) => prev + curr)
      const data = [].concat.apply([], standard.sections.map(section => section.questions.map(question => question.selectedAnswer.answer))).reduce((map, answer) => { map[answer] = (map[answer] || 0) + 1; return map }, {})
      return {
        backgroundColor: [
          '#41B883',
          '#00D8FF',
          'rgb(19,68,111)',
          'rgb(255,209,77)',
          '#DD1B16',
          '#b3b5c6'
        ],
        data: this.aggregateStandardStats(data).map(v => Math.round((v / totalQuestions) * 100))
      }
    },
    aggregateStandardStats (standardStats) {
      const stats = []
      stats.push(standardStats['Control Met'] || 0)
      stats.push(standardStats['Control Mostly Met'] || 0)
      stats.push(standardStats['Control Partially Met'] || 0)
      stats.push(standardStats['Control Somewhat Met'] || 0)
      stats.push(standardStats['Control Not Met'] || 0)
      return stats
    },
    generateStandardColors (index) {
      const colors = [
        {
          backgroundColor: 'rgb(58,164,207),0.2',
          pointBackgroundColor: 'rgb(58,164,207)',
          pointBorderColor: 'rgb(58,164,207)',
          pointHoverBackgroundColor: 'rgb(58,164,207)',
          pointHoverBorderColor: 'rgb(58,164,207)'
        },
        {
          backgroundColor: 'rgb(57,187,185,0.2)',
          pointBackgroundColor: 'rgb(57,187,185)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(57,187,185)'
        },
        {
          backgroundColor: 'rgb(207,178,87)',
          pointBackgroundColor: 'rgb(207,178,87)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(207,178,87)'
        },
        {
          backgroundColor: 'rgb(171,113,71)',
          pointBackgroundColor: 'rgb(171,113,71)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(171,113,71)'
        },
        {
          backgroundColor: 'rgb(203,61,84,0.2)',
          pointBackgroundColor: 'rgb(203,61,84)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(203,61,84)'
        }
      ]
      return colors[index]
    }
  },
  filters: {
    formatDate (date) {
      return moment(String(date)).format('LL')
    }
  },
  mounted () {
    this.getReport()
  }
}
</script>
