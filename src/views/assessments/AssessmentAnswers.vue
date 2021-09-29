<template>
  <div class="animated fadeIn">
    <b-row v-if="error" class="justify-content-center">
      <b-col sm="8">
        <b-alert show dismissable variant="danger" class="text-center">
          <strong><i class="fa fa-warning"></i> Error:</strong> {{ error }}
        </b-alert>
      </b-col>
    </b-row>
    <b-row v-if="loading" class="justify-content-center">
      <h1><i class="fa fa-spinner fa-pulse fa-3x text-primary"></i></h1>
    </b-row>
    <b-row v-if="!loading" class="justify-content-center">
      <b-col sm="2">
        <assessment-nav></assessment-nav>
      </b-col>
      <b-col sm="10">
        <b-card class="text-center">
          <b-row class="justify-content-center init-div">
            <div v-for="(standard, standardIndex) in assessment.answers" :key="standard._id" class="w-100">
              <div v-for="(section, sectionIndex) in standard.assessmentData.data.sections" :key="sectionIndex">
                <div v-if="section.questions[currentQuestion]">
                  <div v-show="standardIndex === currentStandard && sectionIndex === currentSection"
                       class="animated fadeIn">
                    <b-row class="justify-content-center mb-4 standard-title-div">
                      <h2>{{ standard.name }}</h2>
                      <b-button size="md" class="btn-end-assessment" variant="primary" @click="handleClickEndAssessment">End Assessment</b-button>
                    </b-row>
                    <h4>{{ section.name }} {{ section.control_family }}</h4>
                    <b-list-group class="mt-4">
                      <b-list-group-item
                        class="mb-4" :class="questionBorder(section.questions[currentQuestion])">
                        <div class="float-right">
                          <b-btn v-if="assessment.type === 'questions'" variant="primary"
                                 v-b-popover.hover="(section.questions[currentQuestion] && section.questions[currentQuestion].cui_security_requirement) || (section.questions[currentQuestion] && section.questions[currentQuestion].control)"
                                 title="Control Information"><i class="fa fa-info-circle"></i></b-btn>
                          <b-btn v-else variant="primary"
                                 v-b-popover.hover="section.questions[currentQuestion] && section.questions[currentQuestion].question"
                                 title="Control Information"><i class="fa fa-info-circle"></i></b-btn>
                        </div>
                        <p>Section {{ section.questions[currentQuestion] && section.questions[currentQuestion].section }} </p>
                        <p v-if="assessment.type === 'questions'"><strong>{{section.questions[currentQuestion] && section.questions[currentQuestion].question}}</strong></p>
                        <p v-else><strong>{{(section.questions[currentQuestion] && section.questions[currentQuestion].cui_security_requirement) || (section.questions[currentQuestion] && section.questions[currentQuestion].control)}}</strong></p>
                        <b-form-radio-group v-if="section.questions[currentQuestion].notApplicable" v-model="section.questions[currentQuestion].selectedAnswer" buttons
                                            :button-variant="radioVariant(section.questions[currentQuestion])" size="md" :stacked="screenCheck()" disabled>
                          <b-form-radio class="m-2" v-for="(answer, answerIndex) in standard.assessmentData.data.answers"
                                        :key="answerIndex" :value="answer"
                                        @change="$store.dispatch('saveAssessmentSection')">
                            {{ answer.answer }}
                          </b-form-radio>
                        </b-form-radio-group>
                        <b-form-radio-group v-else="section.questions[currentQuestion].notApplicable" v-model="section.questions[currentQuestion].selectedAnswer" buttons
                                            :button-variant="radioVariant(section.questions[currentQuestion])" size="md" :stacked="screenCheck()">
                          <b-form-radio class="m-2" v-for="(answer, answerIndex) in standard.assessmentData.data.answers"
                                        :key="answerIndex" :value="answer"
                                        @change="$store.dispatch('saveAssessmentSection')">
                            {{ answer.answer }}
                          </b-form-radio>
                        </b-form-radio-group>
                        <b-row class="justify-content-center">
                          <b-card no-body class="col-md-8 mt-4" style="padding: 0">
                            <b-tabs pills card>
                              <b-tab title="Comments">
                                <b-table v-if="section.questions[currentQuestion].comments" striped :items="section.questions[currentQuestion].comments"
                                         class="mb-4"></b-table>
                                <b-form-input v-model="section.questions[currentQuestion].pendingComment" type="text"
                                              placeholder="Add Comment..."></b-form-input>
                                <b-button class="mt-2" variant="primary" @click="addComment(section.questions[currentQuestion])">Add Comment
                                </b-button>
                              </b-tab>
                              <b-tab @click="openEvidenceTab(section.questions[currentQuestion].section)" title="Supporting Evidence">
                                <div v-for="(savedEvidence, i) in savedEvidences" :key="i">
                                  <b-link :href="savedEvidence.fileLocation">{{savedEvidence.fileName}}</b-link>
                                  <b-btn variant="primary" @click="deleteEvidence(savedEvidence._id, savedEvidence.section )"><i class="fa fa-trash"></i>
                                  </b-btn>
                                </div>
                                <br>
                                <b-container>
                                  <b-row>
                                    <b-col cols="10" v-for="(evidence, evidenceIndex) in pendingEvidences"
                                           :key="evidenceIndex">
                                      <b-form-file v-model="pendingEvidences[evidenceIndex]" ref="fileInput"
                                                   placeholder="Choose a file..."></b-form-file>
                                    </b-col>
                                    <b-col cols="1">
                                      <b-btn variant="primary" @click="addPendingEvidence()"><i class="fa fa-plus-circle"></i>
                                      </b-btn>
                                    </b-col>
                                    <b-col cols="1">
                                      <b-btn variant="primary" @click="removePendingEvidence()"><i class="fa fa-trash"></i>
                                      </b-btn>
                                    </b-col>
                                  </b-row>
                                </b-container>
                                <b-button class="mt-2" variant="primary"
                                          @click="uploadEvidences(pendingEvidences, section.questions[currentQuestion].section)">Upload
                                </b-button>
                              </b-tab>
                            </b-tabs>
                          </b-card>
                        </b-row>
                        <b-row class="justify-content-between mt-4">
                          <b-form-checkbox v-model="section.questions[currentQuestion].notApplicable" class="m-2">Control Not Applicable
                          </b-form-checkbox>
                          <b-form-checkbox variant="warning" v-model="section.questions[currentQuestion].markedForReview" class="m-2">Mark for
                            review
                          </b-form-checkbox>
                        </b-row>
                      </b-list-group-item>
                    </b-list-group>
                  </div>
                </div>
              </div>
            </div>
          </b-row>
          <b-button class="mr-4" v-if="currentQuestion > 0 || currentSection > 0" size="lg" variant="outline-primary" @click="previousSection">
            Previous
          </b-button>
          <b-button size="lg" variant="primary" @click="nextSection">Next</b-button>
        </b-card>
      </b-col>
    </b-row>
    <b-modal v-model="justStarted" lazy centered header-bg-variant="primary" ok-only no-close-on-backdrop
             no-close-on-esc id="disclaimerModal" title="Assessment Disclaimer">
      <p>The Justified Assessment Solution (JAS) software and the JAS software User Guide are provided for informational
        purposes only.</p>
      <p>Use of this tool is neither required by organisations, nor guarantees compliance with the regulatory compliance
        frameworks and standards available within the tool. Please note that the information presented may not be
        applicable or appropriate for all compliance initiatives.</p>
      <p>The JAS tool is not intended to be an authoritative or exhaustive source on safeguarding information,
        maintaining compliance, or achieving compliance initiatives. The JAS software will assist auditors and
        information security practitioners with the completion of compliance based assessments. If used as intended, it
        will help document and understand an organisation’s current position in relation to the compliance initiative
        they are trying to address with the JAS tool.</p>
      <p>Achieving regulatory compliance often depends on individual interpretations of a regulation or standard.
        Therefore, the JAS software does not offer a guarantee or adherence to compliance initiatives.</p>
      <p>Please contact <a href="mailto:info@jascorp.io">info@jascorp.io</a> if you require further clarification.</p>
    </b-modal>
    <b-modal v-model="assessmentComplete" @ok="returnToOverview" lazy centered header-bg-variant="primary" ok-only
             no-close-on-backdrop no-close-on-esc id="endModal" title="Assessment Complete">
      <div class="text-center">
        <h4><strong>Congratulations!</strong></h4>
        <p>You've completed your assessment. You will now be taken to the assessment overview page where you can
          generate a report.</p>
      </div>
    </b-modal>
    <b-modal v-model="firstVisit" lazy centered header-bg-variant="primary" ok-only
             no-close-on-backdrop no-close-on-esc id="scoringKey" title="JAS Scoring Key" @ok="btnOkClicked">
      <div class="text-left">
        <!--<h5>When answering within assessments, the following options</h5>-->
        <!--<h5 class="text-center">are available when evaluating a given standard.</h5>-->
        <br>
        <div class="text-center" style="width: 100%;">
          <div class="row">
            <div class="col-md-3">
            </div>
            <div class="col-md-6">
              <p class="text-left scoring-key-border-padding">Control Not Met = 0</p>
              <p class="text-left scoring-key-border-padding">Control Somewhat Met = 0.25</p>
              <p class="text-left scoring-key-border-padding">Control Partially Met = 0.50</p>
              <p class="text-left scoring-key-border-padding">Control Mostly Met = 0.75</p>
              <p class="text-left scoring-key-border-padding">Control Met = 1</p>
            </div>
            <div class="col-md-3">
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import AssessmentNav from '../../components/standards/AssessmentNav'
  import {mapState} from 'vuex'

  export default {
    name: 'AssessmentAnswers',
    components: {AssessmentNav},
    data () {
      return {
        loading: true,
        justStarted: Boolean(this.$route.query.justStarted),
        error: '',
        assessmentComplete: false,
        savedEvidences: [],
        pendingEvidences: [{}],
        firstVisit: false,
        intervalId: ''
      }
    },
    computed: mapState({
      assessment: state => state.openAssessment.assessment,
      currentStandard: state => state.openAssessment.currentStandard,
      currentSection: state => state.openAssessment.currentSection,
      currentQuestion: state => state.openAssessment.currentQuestion
    }),
    methods: {
      openAssessment () {
        this.$store.dispatch('getAssessment', {id: this.$route.params.id, open: true})
          .then(() => this.startAssessment())
          .catch((err) => {
            if (err.message === 'Unauthorized') {
              this.$router.push('/login')
            } else {
              this.error = err.message
            }
            console.error(err)
          })
      },
      startAssessment () {
        this.loading = false
        this.$store.dispatch('scrollToTop')
        this.findFirstQuestion()
      },
      findFirstQuestion () {
        const standards = this.assessment.answers
        const standardIndex = standards.findIndex(standard => !standard.progress || standard.progress < 100)
        if (standardIndex === -1) {
          return
        }
        const sections = standards[standardIndex].assessmentData.data.sections
        const sectionIndex = sections.findIndex(section => !section.progress || section.progress < 100)
        const quesIndex = sections[sectionIndex].questions.findIndex(question => !question.selectedAnswer)
        console.log('qu index', quesIndex)
        this.$store.dispatch('assessmentNav', {standard: standardIndex, section: sectionIndex, question: quesIndex})
        console.log('first log', this.$store.getters.currentSection, this.$store.getters.currentQuestion)
      },
      nextSection () {
        if (this.assessment.answers[this.$store.getters.currentStandard].assessmentData.data.sections[this.$store.getters.currentSection].questions[(this.$store.getters.currentQuestion + 1)]) {
          console.log('Moving to next question... ' + (this.$store.getters.currentQuestion + 1))
          this.$store.dispatch('saveAssessmentSection')
            .then(() => {
              this.$store.dispatch('assessmentNav', {
                standard: this.$store.getters.currentStandard,
                section: this.$store.getters.currentSection,
                question: (this.$store.getters.currentQuestion + 1)
              })
              this.$store.dispatch('scrollToTop')
            })
            .catch((err) => {
              if (err.message === 'Unauthorized') {
                this.$router.push('/login')
              } else {
                this.error = err.message
              }
              console.error(err)
            })
        } else if (this.assessment.answers[this.$store.getters.currentStandard].assessmentData.data.sections[(this.$store.getters.currentSection + 1)]) {
          console.log('Moving to next section... ' + (this.$store.getters.currentSection + 1))
          this.$store.dispatch('saveAssessmentSection')
            .then(() => {
              this.$store.dispatch('assessmentNav', {
                standard: this.$store.getters.currentStandard,
                section: (this.$store.getters.currentSection + 1),
                question: 0
              })
              this.$store.dispatch('scrollToTop')
            })
            .catch((err) => {
              if (err.message === 'Unauthorized') {
                this.$router.push('/login')
              } else {
                this.error = err.message
              }
              console.error(err)
            })
        } else {
          this.nextStandard()
        }
      },
      previousSection () {
        if (this.assessment.answers[this.$store.getters.currentStandard].assessmentData.data.sections[this.$store.getters.currentSection].questions[(this.$store.getters.currentQuestion - 1)]) {
          console.log('Moving to previous question... ' + (this.$store.getters.currentQuestion - 1))
          this.$store.dispatch('assessmentNav', {
            standard: this.$store.getters.currentStandard,
            section: this.$store.getters.currentSection,
            question: (this.$store.getters.currentQuestion - 1)
          })
        } else if (this.assessment.answers[this.$store.getters.currentStandard].assessmentData.data.sections[(this.$store.getters.currentSection + 1)]) {
          console.log('Moving to previous section... ' + (this.$store.getters.currentSection - 1))
          this.$store.dispatch('assessmentNav', {
            standard: this.$store.getters.currentStandard,
            section: (this.$store.getters.currentSection - 1),
            question: (this.assessment.answers[this.$store.getters.currentStandard].assessmentData.data.sections[(this.$store.getters.currentSection - 1)].questions.length - 1)
          })
        }
        this.$store.dispatch('scrollToTop')
      },
      nextStandard () {
        console.log('Next Standard!')
        if (this.$store.getters.assessment.answers[(this.$store.getters.currentStandard + 1)]) {
          console.log('Moving to next standard...')
          this.$store.dispatch('saveAssessmentSection')
            .then(() => this.$store.dispatch('assessmentNav', {
              standard: (this.$store.getters.currentStandard + 1),
              section: 0
            }))
            .catch((err) => {
              if (err.message === 'Unauthorized') {
                this.$router.push('/login')
              } else {
                this.error = err.message
              }
              console.error(err)
            })
        } else {
          this.$store.dispatch('saveAssessmentSection')
            .then(this.endAssessment())
        }
      },
      endAssessment () {
        this.assessmentComplete = true
      },
      handleClickEndAssessment () {
        this.$router.push({path: `/assessments/`})
      },
      returnToOverview () {
        this.$router.push({path: `/assessments/${this.assessment._id}`})
      },
      btnOkClicked () {
        this.firstVisit = false
      },
      addComment (question) {
        question.comments = question.comments || []
        question.comments.push({author: this.$store.getters.userFullName, comment: question.pendingComment})
        question.pendingComment = ''
        this.$store.dispatch('saveAssessmentSection')
          .catch((err) => {
            console.log(err)
            if (err.message === 'Unauthorized') {
              this.$router.push('/login')
            } else {
              this.error = err.message
            }
          })
      },
      openEvidenceTab (section) {
        this.savedEvidences = []
        let assessmentId = this.$route.params.id
        this.$toastr.defaultTimeout = 500000
        this.$toastr.i('Loading saved evidences....')
        this.$store.dispatch('loadEvidence', {assessmentId: assessmentId, section: section}).then(evidences => {
          this.$toastr.clearAll()
          this.$toastr.defaultTimeout = 5000
          this.savedEvidences = evidences
        }).catch(err => {
          console.log(err)
          this.$toastr.clearAll()
          this.$toastr.defaultTimeout = 5000
          this.$toastr.e('Error, please try again')
        })
      },
      addPendingEvidence () {
        if (!this.pendingEvidences[this.pendingEvidences.length - 1].name) {
          this.$toastr.e('Choose a file to be able to add more')
          return
        }
        this.pendingEvidences.push({})
      },
      removePendingEvidence () {
        if (this.pendingEvidences.length > 1) {
          this.pendingEvidences.splice(this.pendingEvidences.length - 1, 1)
        }
      },
      deleteEvidence (EvidenceId, section) {
        this.$toastr.i('deleting evidence....')
        this.$store.dispatch('deleteEvidence', EvidenceId)
          .then(response => {
            this.$toastr.s('Evidences have been deleted successfully')
            this.pendingEvidences = [{}]
            this.openEvidenceTab(section)
          })
          .catch(err => alert(err))
      },
      uploadEvidences (docs, section) {
        let assessmentId = this.$route.params.id
        this.$toastr.defaultTimeout = 500000
        let types = ['docx', 'xlsx', 'pptx', 'xls', 'txt']
        let indx = docs[0].name.lastIndexOf('.')
        let fileType = docs[0].name.slice(indx + 1)
        let AcceptedFile = types.find((ele) => {
          return ele === fileType
        })
        if (docs[0].size < 26214400 && AcceptedFile) {
          this.$toastr.i('Uploading evidences....')
          this.$store.dispatch('uploadEvidence', {assessmentId: assessmentId, files: docs, section: section})
            .then(response => {
              this.$toastr.clearAll()
              this.$toastr.defaultTimeout = 5000
              this.$toastr.s('Evidences have been uploaded successfully')
              // load saved evidences
              this.pendingEvidences = [{}]
              this.openEvidenceTab(section)
            })
            .catch(err => {
              console.log(err)
              this.$toastr.clearAll()
              this.$toastr.defaultTimeout = 5000
              this.$toastr.e('Error, please try again')
            })
        } else if (docs[0].size > 26214400) {
          this.$toastr.e('Error, file excedded limit')
        } else {
          this.$toastr.e('Error, accepted files are only docx, xlsx, pptx, xls and txt')
        }
      },
      questionBorder (question) {
        return {
          'border-primary': question && !question.selectedAnswer,
          'border-warning': question && question.markedForReview,
          'border-success': question && question.selectedAnswer && !question.markedForReview,
          'sub-question': question && question.sub,
          'border-danger': question && !question.selectedAnswer && !question.markedForReview && !question.notApplicable
        }
      },
      radioVariant (question) {
        if (question && !question.selectedAnswer && !question.markedForReview) {
          return 'outline-primary'
        }
        if (question && question.markedForReview) {
          return 'outline-warning'
        }
        if (question && question.selectedAnswer && !question.markedForReview) {
          return 'outline-success'
        }
      },
      screenCheck () {
        return window.innerWidth < 991
      },
      showScoringkeyModal () {
        this.firstVisit = true
        window.clearInterval(this.intervalId)
      }
    },
    mounted () {
      this.openAssessment()
      this.intervalId = window.setInterval(this.showScoringkeyModal, 10000)
    }
  }
</script>
<style lang="css">
  .main .container-fluid {
    height: 400px;
  }
  .standard-title-div{
    position: relative;
  }
  .btn-end-assessment{
    position: absolute;
    top: 0px;
    right: 15px;
  }
  .btn-outline-primary.disabled {
    background-color: #ddd;
  }
  .scoring-key-border-padding {
    border-bottom: solid 1px;
    padding-bottom: 10px;
  }
  #scoringKey___BV_modal_header_ {
    justify-content: center;
  }
</style>
