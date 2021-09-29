<template>
  <div class="animated fadeIn">
    <div class="row init-div">
      <div class="col-md-12 col-sm-12 init-div">
        <h1>JAS Security Dashboard</h1>
      </div>
      <div class="col-md-12 col-sm-12 init-div mt-3">
        <span class="font-weight-bold">Welcome to the JAS Security Dashboard. This dashboard provides awareness, education and steps to configure and maintain security compliance.</span>
      </div>

      <div class="col-md-12 col-sm-12 init-div mt-2">
        <b-card title="Your Assessments Summary" >
          <b-tabs v-if="assessments.length > 0" pills card vertical >
            <div v-for="assessment in assessments" :key="assessment._id">
              <b-tab :title="assessment.name" >
                <div>
                  <b-card :header="assessment.name +' - ' + formatDate(assessment.createdAt)" header-tag="h3" class="text-center">
                    <b-row>
                      <div class="row init-div">
                        <div class="col-md-2 col-sm-6 init-div">
                          <VueApexCharts type="radialBar" height="200" :options="chartOptions" :series="getJasScoreSeries(assessment.answers.compliance.totalAverage)" />
                        </div>
                        <div class="col-md-10 col-sm-6 jas-score-description-content">
                          <div class="row init-div" v-if="assessment.answers.compliance.totalAverage > 90 && assessment.answers.compliance.totalAverage <= 100">
                            <div class="col-md-12 col-sm-12">
                              <span class="jas-score-title">What Does my JAS Score Mean?</span>
                            </div>
                            <div class="col-md-12 col-sm-12 mt-2">
                              <span>A compliance score between 90% and 100% indicates that the majority of security controls for this assessment were met. This indicates that the security measures in place are very mature.</span>
                            </div>
                            <div class="col-md-12 col-sm-12 mt-2">
                              <span>Please review all of the controls which were not marked as “Control Met”</span>
                            </div>
                          </div>
                          <div class="row init-div" v-else-if="assessment.answers.compliance.totalAverage > 80 && assessment.answers.compliance.totalAverage <= 90">
                            <div class="col-md-12 col-sm-12">
                              <span class="jas-score-title">What Does my JAS Score Mean?</span>
                            </div>
                            <div class="col-md-12 col-sm-12 mt-2">
                              <span>A compliance score between 80% and 90% indicates that most of the security controls for this assessment were met. This indicates that the security measures in place are mostly effective, but can be improved upon.</span>
                            </div>
                            <div class="col-md-12 col-sm-12 mt-2">
                              <span>Please review all of the controls which were not marked as “Control Met”</span>
                            </div>
                          </div>
                          <div class="row init-div" v-else-if="assessment.answers.compliance.totalAverage > 70 && assessment.answers.compliance.totalAverage <= 80">
                            <div class="col-md-12 col-sm-12">
                              <span class="jas-score-title">What Does my JAS Score Mean?</span>
                            </div>
                            <div class="col-md-12 col-sm-12 mt-2">
                              <span>A compliance score between 70% and 80% indicates that the many of the security controls for this assessment were met. This indicates the security measures in place are above average, but several areas should be reviewed for improvement. </span>
                            </div>
                            <div class="col-md-12 col-sm-12 mt-2">
                              <span>Please review all of the controls which were not marked as “Control Met”</span>
                            </div>
                          </div>
                          <div class="row init-div" v-else-if="assessment.answers.compliance.totalAverage > 50 && assessment.answers.compliance.totalAverage <= 70">
                            <div class="col-md-12 col-sm-12">
                              <span class="jas-score-title">What Does my JAS Score Mean?</span>
                            </div>
                            <div class="col-md-12 col-sm-12 mt-2">
                              <span>A compliance score between 50% and 70% indicates a foundational level of applied security controls were present. A closer review of the security controls should be accomplished to identify areas that can be improved upon. </span>
                            </div>
                            <div class="col-md-12 col-sm-12 mt-2">
                              <span>Please review all of the controls which were not marked as “Control Met”</span>
                            </div>
                          </div>
                          <div class="row init-div" v-else-if="assessment.answers.compliance.totalAverage <= 50">
                            <div class="col-md-12 col-sm-12">
                              <span class="jas-score-title">What Does my JAS Score Mean?</span>
                            </div>
                            <div class="col-md-12 col-sm-12 mt-2">
                              <span>A compliance score less than 50% indicates that a large number of security controls for this assessment were not met. The security assessor should develop a plan to improve the existing security score and then  re-accomplish the assessment at a later date. </span>
                            </div>
                            <div class="col-md-12 col-sm-12 mt-2">
                              <span>Please review all of the controls which were not marked as “Control Met”</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </b-row>
                    <b-row class="mt-3">
                      <b-col sm="6">
                        <b-card class="border-primary">
                          <h4 class="donghut-chart-titel"> Response Breakdown </h4>
                          <p><small>* hover on chart to view data </small></p>
                          <VueApexCharts type="donut" :options="responseChartOptions" :series="generateDoughnutData(assessment.answers)" />
                        </b-card>
                      </b-col>
                      <b-col sm="6">
                        <b-card class="border-primary">
                          <h4 class="donghut-chart-titel"> Category Grades </h4>
                          <p><small>* hover on chart to view data </small></p>
                          <VueApexCharts type="donut" :options="categoryChartOptions" :series="generateBarData(assessment.answers)" />
                        </b-card>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col sm="4">
                        <b-card class="border-primary">
                          <div class="h1 text-primary text-right mb-4">
                            <i>{{ assessment.answers.compliance.totalPossible }}</i>
                          </div>
                          <div class="chart-wrapper">
                          </div>
                          <div class="h4 mb-0">Total Number of Controls Assessed</div>
                          <b-progress height={} class="progress-xs mt-3 mb-0" :value="100"/>
                        </b-card>
                      </b-col>
                      <b-col sm="4">
                        <b-card class="border-primary">
                          <div class="h1 text-primary text-right mb-4">
                            <button class="btn-answer-numbers" @click="showDetailAnswers(assessment.answers, 'Control Met')"><i>{{ assessment.answers.compliance.totalAnswers["Control Met"] || 0 }}</i></button>
                          </div>
                          <div class="h4 mb-0"> Total Number of Controls Met </div>
                          <b-progress height={} class="progress-xs mt-3 mb-0" :value="getAssessmentPercent(assessment.answers.compliance.totalPossible, assessment.answers.compliance.totalAnswers['Control Met'] || 0 )"/>
                        </b-card>
                      </b-col>
                      <b-col sm="4">
                        <b-card class="border-primary">
                          <div class="h1 text-primary text-right mb-4">
                            <button class="btn-answer-numbers" @click="showDetailAnswers(assessment.answers, 'Control Mostly Met')"><i> {{ assessment.answers.compliance.totalAnswers["Control Mostly Met"] || 0 }}</i></button>
                          </div>
                          <div class="h4 mb-0"> Total Number of Controls Mostly Met </div>
                          <b-progress height={} class="progress-xs mt-3 mb-0" :value="getAssessmentPercent(assessment.answers.compliance.totalPossible, assessment.answers.compliance.totalAnswers['Control Mostly Met'] || 0 )"/>
                        </b-card>
                      </b-col>
                      <b-col sm="4">
                        <b-card class="border-primary">
                          <div class="h1 text-primary text-right mb-4">
                            <button class="btn-answer-numbers" @click="showDetailAnswers(assessment.answers, 'Control Partially Met')"><i>{{ assessment.answers.compliance.totalAnswers["Control Partially Met"] || 0 }}</i></button>
                          </div>
                          <div class="chart-wrapper">
                          </div>
                          <div class="h4 mb-0">Total Number of Controls Partially Met </div>
                          <b-progress height={} class="progress-xs mt-3 mb-0" :value="getAssessmentPercent(assessment.answers.compliance.totalPossible, assessment.answers.compliance.totalAnswers['Control Partially Met'] || 0 )"/>
                        </b-card>
                      </b-col>
                      <b-col sm="4">
                        <b-card class="border-primary">
                          <div class="h1 text-primary text-right mb-4">
                            <button class="btn-answer-numbers" @click="showDetailAnswers(assessment.answers, 'Control Somewhat Met')"><i>{{ assessment.answers.compliance.totalAnswers["Control Somewhat Met"] || 0 }}</i></button>
                          </div>
                          <div class="h4 mb-0">  Total Number of Controls Somewhat Met </div>
                          <b-progress height={} class="progress-xs mt-3 mb-0" :value="getAssessmentPercent(assessment.answers.compliance.totalPossible, assessment.answers.compliance.totalAnswers['Control Somewhat Met'] || 0 )"/>
                        </b-card>
                      </b-col>
                      <b-col sm="4">
                        <b-card class="border-primary">
                          <div class="h1 text-primary text-right mb-4">
                            <button class="btn-answer-numbers" @click="showDetailAnswers(assessment.answers, 'Control Not Met')"><i> {{ assessment.answers.compliance.totalAnswers["Control Not Met"] || 0 }}</i></button>
                          </div>
                          <div class="h4 mb-0"> Total Number of Controls Not Met </div>
                          <b-progress height={} class="progress-xs mt-3 mb-0" :value="getAssessmentPercent(assessment.answers.compliance.totalPossible, assessment.answers.compliance.totalAnswers['Control Not Met'] || 0 )"/>
                        </b-card>
                      </b-col>
                    </b-row>
                  </b-card>
                </div>
              </b-tab>
            </div>
          </b-tabs>
          <div v-else-if="assessments.length < 1" >
            <p>  You Do Not have any finished assessments</p>
          </div>
        </b-card>
      </div>
    </div>
  </div>
</template>
<script>
  /* eslint-disable camelcase */

  import Doughnut from '../components/charts/Doughnut'
  import Bar from '../components/charts/Bar'
  import moment from 'moment'
  import VueApexCharts from 'vue-apexcharts'

  export default {
    name: 'dashboard',
    components: {
      Bar,
      Doughnut,
      VueApexCharts
    },
    data () {
      return {
        documentData: {},
        assessments: [],
        series: [55, 32],
        chartOptions: {
          chart: {
            height: 200,
            type: 'radialBar',
            toolbar: {
              show: false
            }
          },
          plotOptions: {
            radialBar: {
              startAngle: -135,
              endAngle: 225,
              hollow: {
                margin: 0,
                size: '70%',
                background: '#fff',
                image: undefined,
                imageOffsetX: 0,
                imageOffsetY: 0,
                position: 'front',
                dropShadow: {
                  enabled: true,
                  top: 3,
                  left: 0,
                  blur: 4,
                  opacity: 0.24
                }
              },
              track: {
                background: '#fff',
                strokeWidth: '67%',
                margin: 0, // margin is in pixels
                dropShadow: {
                  enabled: true,
                  top: -3,
                  left: 0,
                  blur: 4,
                  opacity: 0.35
                }
              },

              dataLabels: {
                show: true,
                name: {
                  offsetY: -10,
                  show: true,
                  color: '#888',
                  fontSize: '17px'
                },
                value: {
                  formatter: function (val) {
                    return parseInt(val)
                  },
                  color: '#111',
                  fontSize: '36px',
                  show: true
                }
              }
            }
          },
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'dark',
              type: 'horizontal',
              shadeIntensity: 0.5,
              gradientToColors: ['#ABE5A1'],
              inverseColors: true,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 100]
            }
          },
          stroke: {
            lineCap: 'round'
          },
          labels: ['JAS Score']
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              // get the concerned dataset
              var dataset = data.datasets[tooltipItem.datasetIndex]
              // get the current items value
              var currentValue = dataset.data[tooltipItem.index]
              return data.labels[tooltipItem.index] + ' ' + (currentValue + '%')
            }
          }
        },
        responseChartOptions: {
          chart: {
            type: 'donut'
          },
          fill: {
            type: 'gradient'
          },
          colors: [
            '#00B7F9',
            '#2198C8',
            '#307998',
            '#375964',
            '#25414A'],
          labels: ['Control Met', 'Control Mostly Met', 'Control Partially Met', 'Control Somewhat Met', 'Control Not Met'],
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        },
        categoryChartOptions: {
          chart: {
            type: 'donut'
          },
          fill: {
            type: 'gradient'
          },
          colors: [
            '#00B7F9',
            '#2198C8',
            '#307998',
            '#375964',
            '#25414A'],
          labels: ['Policy', 'Procedure', 'Technical Implementation'],
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        }
      }
    },
    methods: {
      getAssessments () {
        // this.$store.dispatch('getAssessments')
        //   .then((response) => {
        //     this.assessments = response.filter((assessment) => {
        //       return assessment.progress === 100
        //     })
        //     for (let i = 0; i < this.assessments.length; i++) {
        //       this.assessments[i].answers.compliance = this.calculateCompliance(this.assessments[i].answers)
        //     }
        //   })
        //   .catch((err) => {
        //     this.error = err
        //   })

        var data = {
          organisation: localStorage.getItem('organisation'),
          user: localStorage.getItem('vuex')
        }
        this.$store.dispatch('getAllAssessments', data)
          .then((response) => {
            this.assessments = response.filter((assessment) => {
              return assessment.progress === 100
            })
            for (let i = 0; i < this.assessments.length; i++) {
              this.assessments[i].answers.compliance = this.calculateCompliance(this.assessments[i].answers)
            }
          })
          .catch((err) => {
            this.error = err
            console.error(err)
            if (err.message === 'Unauthorized') {
              this.$router.push('/login')
            } else {
              this.error = err.message
            }
          })
      },
      generateBarData (data) {
        const datasets = []
        if (Array.isArray(data)) {
          data.forEach((standard) => {
            datasets.push(this.generateStandardStats(standard, 3))
          })
        }
        return datasets[0]
      },
      generateStandardStats (standard, index) {
        const standardr2 = [].concat.apply([], standard.assessmentData.data.sections.map(section => section.questions.map(question => { return !question.notApplicable || question.notApplicable === null ? {tags: question.tags, points: question.selectedAnswer.points} : null })))
        let result = {}
        standardr2.map((el) => {
          if (el != null) {
            el.tags.map(tag => {
              result[tag] = (result[tag] + el.points) || 0
              let sTag = tag.slice(0, 2)
              result[sTag] = (result[sTag] + 1) || 0
            })
          }
        })
        let data = []
        result.Policy ? data.push(Math.round((result.Policy / result.Po) * 100)) : data.push(0)
        result.Procedure ? data.push(Math.round((result.Procedure / result.Pr) * 100)) : data.push(0)
        result['Technical Implementation'] ? data.push(Math.round((result['Technical Implementation'] / result.Te) * 100)) : data.push(0)
        return data
      },
      generateDoughnutData (data) {
        const datasets = []
        data.forEach((standard) => {
          datasets.push(this.generatePercentageStats(standard))
        })
        return datasets[0]
      },
      generatePercentageStats (standard) {
        const totalQuestions = standard.assessmentData.data.sections.map(section => section.questions.length).reduce((prev, curr) => prev + curr)
        const data = [].concat.apply([], standard.assessmentData.data.sections.map(section => section.questions.map(question => !question.notApplicable || question.notApplicable === null ? question.selectedAnswer.answer : null))).reduce((map, answer) => { map[answer] = (map[answer] || 0) + 1; return map }, {})
        return this.aggregateStandardStats(data).map(v => Math.round((v / totalQuestions) * 100))
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
      },
      formatDate (date) {
        return moment(String(date)).format('LL')
      },
      calcAnswers (answers) {
        let keys = []
        answers.map((el) => {
          keys.push(...Object.keys(el))
        })
        let uni = [...new Set(keys)]
        let res = {}
        for (let i = 0; i < uni.length; i++) {
          res[uni[i]] = 0
          for (let x = 0; x < answers.length; x++) {
            if (answers[x][uni[i]]) {
              res[uni[i]] += answers[x][uni[i]]
            }
          }
        }
        return res
      },
      calculateCompliance (standards) {
        const scores = {}
        let answers = []
        standards.forEach((standard) => {
          scores[standard.name] = this.calculateStandardScore(standard)
          answers.push(scores[standard.name].questionAnswers)
        })
        const totalEarned = Object.values(scores).reduce((prev, value) => prev + value.earned, 0)
        const totalPossible = Object.values(scores).reduce((prev, value) => prev + value.possible, 0)
        scores.totalAverage = Math.round((totalEarned / totalPossible) * 100)
        scores.totalEarned = totalEarned
        scores.totalPossible = totalPossible
        console.log('answers: ', answers)
        scores.answers = answers
        scores.totalAnswers = this.calcAnswers(answers)
        return scores
      },
      calculateStandardScore (standard) {
        const totalQuestions = standard.assessmentData.data.sections.map(section => section.questions.map(question => !question.notApplicable || question.notApplicable === null ? 1 : 0).reduce((prev, curr) => prev + curr)).reduce((prev, curr) => prev + curr)
        const totalScore = [].concat.apply([], standard.assessmentData.data.sections.map(section => section.questions.map(question => !question.notApplicable || question.notApplicable === null ? question.selectedAnswer.points : 0))).reduce((prev, curr) => prev + curr)
        var counts = {}
        const questionAnswers = [].concat.apply([], standard.assessmentData.data.sections.map(section => section.questions.map(question => !question.notApplicable || question.notApplicable === null ? question.selectedAnswer.answer : null))).forEach(function (x) { if (x != null) counts[x] = (counts[x] || 0) + 1 })
        console.log(' questionAnswers :', questionAnswers)
        console.log(' calculateStandardScore :', { name: standard.name, possible: totalQuestions, earned: totalScore, questionAnswers: counts })
        return { name: standard.name, possible: totalQuestions, earned: totalScore, questionAnswers: counts }
      },
      getJasScoreSeries (average) {
        var data = []
        data.push(average)
        return data
      },
      getAssessmentPercent (total, cnt) {
        if (cnt === 0) {
          return 0
        } else {
          return Math.round(cnt / total * 100)
        }
      },
      showDetailAnswers (standard, tag_comment) {
        const questions = [].concat.apply([], standard[0].assessmentData.data.sections.map(section => section.questions.map(question => { return !question.notApplicable || question.notApplicable === null ? question : null })))
        var result = []

        for (var i = 0; i < questions.length; i++) {
          var isExsit = false
          var comment = tag_comment
          if (questions[i] != null && questions[i].selectedAnswer.answer === comment) {
            isExsit = true
          }
          if (isExsit) {
            result.push(questions[i])
          }
        }
        this.$store.dispatch('setDashboardInteractData', result)
        this.$router.push('/dashboard/detailanswers')
      }
    },
    mounted () {
      this.getAssessments()
    }
  }
</script>
<style lang="css">
  .apexcharts-text.apexcharts-datalabel-label{
    font-weight: bold;
  }
  .jas-score-title{
    font-size: 18px;
    font-weight: 600;
  }
  .jas-score-subTitle{
    font-weight: bold;
  }
  .jas-score-description-content{
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: left;
  }
  .apexcharts-legend.position-right{
    text-align: left;
  }
  .btn-answer-numbers, .btn-answer-numbers:focus, .btn-answer-numbers:active{
    background: transparent;
    border: none;
    outline: none;
    color: #20a8d8 !important;
    font-weight: 500;
  }
</style>
