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
      <b-col sm="10" class="custom-display-center">
        <b-card id="report" class="text-center" style="width: 70%" border-variant="primary">
          <b-card-body>
            <!--<b-row class="justify-content-end">-->
              <!--<b-button disabled variant="primary" v-b-tooltip.hover title="Download Report" ><i class="fa fa-download" v-on:click="downloadReportAsPdf()"  ></i></b-button>-->
            <!--</b-row>-->
            <b-row class="justify-content-center">
              <div class="page-size-and-border">
                <div class="triangle-down">
                </div>
                <div style="font-size: 50px">System Security Plan</div>
                <h1 style="margin-top: 20px">{{report.name}}</h1>
                <h5 style="margin-top: 20px">{{report.createdAt.split('T')[0]}}</h5>
                <b-row class="justify-content-center">
                  <div class="page-header">
                    <img src="/static/img/jas_emblem.svg" style="width: 180px"/>
                  </div>
                </b-row>

                <div style="font-size: 50px">ACME Consulting, LLC</div>
                <h1 style="margin-top: 20px">{{report.name}}</h1>
                <h5 style="margin-top: 20px">{{report.createdAt.split('T')[0]}}</h5>
              </div>
            </b-row>
            <b-row class="justify-content-center">
              <div class="page-size-and-border">
                <div class="text-center mb-4 break-down-pdf">
                  <h2><strong>Disclaimer</strong></h2>
                  <p>The analysis and data in this report are provided “as is” for informational purposes only. The Justified Assessment Solution (JAS) Corporation does not provide any warranties of any kind regarding any information contained within. In no event shall the JAS Corporation be liable for any damages, including but not limited to, direct, indirect, special, or consequential damages and including damages based on any negligence of users of this software product.</p>
                  <p>The report is prepared and intended for internal use by the organization that made the request. The contents of this report may be subject to intellectual property rights.</p>
                </div>
              </div>
            </b-row>
            <b-row class="justify-content-center">
              <div class="page-size-and-border">
                <div class="text-center mb-4 break-down-pdf">
                  <h2><strong>Executive Summary</strong></h2>
                  <p>This System Security Plan (SSP) provides an overview of the security requirements for the "{{report.name}}"
                    information system and describes the information security controls in place or planned for implementation. This helps to plan for a level of security appropriate for the information which is being transmitted, processed or stored by the "{{report.name}}" information system. This SSP provides an overview of security requirements for the Test1 information system and describes controls in place or planned for implementation which support the processing of Controlled Unclassified Information (CUI).
                  </p>
                  <p>This SSP specifically identifies the manner in which "{{report.name}}" meets or intends to meet the security requirements identified in the National Institute of Standards and Technologies (NIST) Special Publication 800-171 (SP 800-171) Revision 1.</p>
                  <br>
                  <h2><strong>Ownership & Cybersecurity Overview</strong></h2>
                  <p>The objective of the System Security Plan (SSP) document is to have a simple, easy-to-reference document that covers pertinent information about the Controlled Unclassified Information (CUI) environment. This is a “living document” that is meant to be updated as conditions change. The goal of this document is simple - anyone not familiar with the CUI environment should be able to read it and gain a fundamental understanding of the systems involved, the risks, and the security controls required to maintain an acceptable level of security. Essentially, this document provides a centralized repository for knowledge that is specific to the CUI environment and its applicable security controls. The SSP reflects input from those responsible for the systems that make up the CUI environment, including information owners, system operators, and other stakeholders.</p>
                  <br>
                  <h2><strong>Contracts Containing CUI</strong></h2>
                  <p>[list the applicable contracts that contain CUI protection requirements]</p>
                  <br>
                  <h2><strong>Data Protection Considerations</strong></h2>
                  <p>The assets within the CUI environment are assessed, based on data sensitivity and mission criticality to ensure the appropriate level of protection is applied. Typical CUI data which is collected and stored on the "{{report.name}}" information system include;</p>
                  <p>Example: system diagrams, contract information, technical reports, technical processes, data sets, and occasionally executable code or source code.</p>
                </div>
              </div>
            </b-row>
            <b-row class="justify-content-center">
              <div class="page-size-and-border">
                <div class="text-center mb-4 break-down-pdf">
                  <h2>System Infomation</h2>
                  <table>
                    <tbody>
                    <tr>
                      <td>System Name</td>
                      <td>{{report.name}}</td>
                    </tr>
                    <tr>
                      <td>Organization</td>
                      <td>{{report.data.organisation}}</td>
                    </tr>
                    <tr>
                      <td>System Status</td>
                      <td>Operational</td>
                    </tr>
                    </tbody>
                  </table>
                  <br><br>
                  <h2>CUI Operating Environment</h2>
                  <table>
                    <tbody>
                    <tr>
                      <td colspan="3">Operating Environment where CUI exists (check all that apply)</td>
                    </tr>
                    <tr>
                      <td><input type="checkbox"></td>
                      <td>Public Cloud</td>
                      <td>Cloud services and infrastructure supporting multiple organizations and clients</td>
                    </tr>
                    <tr>
                      <td><input type="checkbox"></td>
                      <td>Private Cloud</td>
                      <td>Cloud services and infrastructure dedicated to a specific organization and no other clients</td>
                    </tr>
                    <tr>
                      <td><input type="checkbox"></td>
                      <td>Data Center</td>
                      <td>Company-owned & operated datacenter.</td>
                    </tr>
                    <tr>
                      <td><input type="checkbox"></td>
                      <td>Hybrid</td>
                      <td>Explain: (e.g., cloud services and infrastructure that provides private cloud for secured applications and data where required and public cloud for other applications and data)</td>
                    </tr>
                    <tr>
                      <td><input type="checkbox"></td>
                      <td>Dispersed Endpoints</td>
                      <td>CUI can be found on workstations and other endpoints.</td>
                    </tr>
                    <tr>
                      <td><input type="checkbox"></td>
                      <td>Other</td>
                      <td>Explain:</td>
                    </tr>
                    </tbody>
                  </table>
                  <br><br>
                  <h2>CUI Storage Locations</h2>
                  <table>
                    <tbody>
                    <tr>
                      <td colspan="3">High-Level Overview of where CUI is stored, transmitted or processed (check all that apply)</td>
                    </tr>
                    <tr>
                      <td><input type="checkbox"></td>
                      <td>End User Workstations</td>
                      <td>End user workstations (e.g., desktops & laptops)</td>
                    </tr>
                    <tr>
                      <td><input type="checkbox"></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td><input type="checkbox"></td>
                      <td>Mobile Devices</td>
                      <td>Mobile devices (e.g., tablets or smartphones)</td>
                    </tr>
                    <tr>
                      <td><input type="checkbox"></td>
                      <td>Industrial Control Systems (ICS)</td>
                      <td>Devices that control manufacturing processes</td>
                    </tr>
                    <tr>
                      <td><input type="checkbox"></td>
                      <td>Internal application/service</td>
                      <td>Internal application (e.g., ERM, SAP, ticket system, change control, etc.)</td>
                    </tr>
                    <tr>
                      <td><input type="checkbox"></td>
                      <td>Software as a Service</td>
                      <td>Web-based applications (e.g., Google Apps, O365, Salesforce, GoToMeeting, WebEx)</td>
                    </tr>
                    <tr>
                      <td><input type="checkbox"></td>
                      <td>Infrastructure as a Service</td>
                      <td>Cloud environments (e.g., Azure, AWS, Rackspace)</td>
                    </tr>
                    <tr>
                      <td><input type="checkbox"></td>
                      <td>Other</td>
                      <td>Explain:</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </b-row>
            <b-row class="justify-content-center">
              <div class="page-size-and-border">
                <div class="text-center mb-4 break-down-pdf">
                  <h2><strong>CUI Data Locations</strong></h2>
                  <p>Example: Most CUI data will be stored locally on company laptops, company Storage Area Network (SAN) devices or via cloud-based environments such as Office 365 and Salesforce. The company SAN does not communicate outside of the internal environment and is used to store highly sensitive CUI material</p>
                  <br>
                  <h2><strong>Network Diagram</strong></h2>
                  <p>Example: Provide descriptive information about the information system to include location, data types, data transmission, etc.</p>
                  <p>Insert network diagram and/or system architecture diagram portraying all the basic networking and systems in place for the company.</p>
                  <br>
                  <h2><strong>{{report.data.answers[0].name}} Cybersecurity Controls</strong></h2>
                  <p>The applicable cybersecurity controls from {{report.data.answers[0].name}} are detailed in the “{{report.data.answers[0].name}} CYBERSECURITY CONTROLS” section.</p>
                  <div class="standard-section-padding" v-for="(standard, standardIndex) in report.data.answers">
                    <div v-for="(section, sectionIndex) in standard.sections">
                      <p>{{`${(sectionIndex+1)}.  `}}Section {{ section.name }} {{ `- ${section.control_family}` }}</p>
                    </div>
                  </div>
                </div>

              </div>
            </b-row>

            <b-card v-for="(standard, standardIndex) in report.data.answers" :key="standardIndex" :header="standard.name" header-tag="h3">
              <div v-for="(section, sectionIndex) in standard.sections" :key="sectionIndex" class="mb-4 table-responsive break-down-pdf">
                <h5>Section {{ section.name }} {{ `- ${section.control_family}` }}</h5>
                <table class="table table-sm table-striped text-center">
                  <thead>
                  <tr>
                    <th>Control Number <br>(Section)</th>
                    <th>Control Name</th>
                    <th>CUI Security <br>Requirements</th>
                    <th>Comments</th>
                    <th>Status</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(question, questionIndex) in section.questions" :key="questionIndex">
                    <td>{{ question.section }}</td>
                    <td>{{section.control_family}}</td>
                    <td>{{ question.cui_security_requirement }}</td>
                    <td>{{ question.comments ? question.comments[0].comment : '' }}</td>
                    <td>{{ question.selectedAnswer.answer }}</td>
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
<style>
  .triangle-down {
    width: 0;
    height: 0;
    border-right: 600px solid transparent;
    border-top: 150px solid #0a74ac;
  }
  .page-size-and-border {
    border: 2px solid black;
    height: 1200px;
    width: 900px;
    margin-bottom: 20px;
    padding-top: 50px;
    padding-left: 30px;
    padding-right: 30px;
  }
  .custom-display-center {
    display: flex;
    justify-content: center;
  }
  .standard-section-padding {
    text-align: left;
    padding-left: 30px;
  }
</style>
