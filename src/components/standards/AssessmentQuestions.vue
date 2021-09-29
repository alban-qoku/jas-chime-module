<template>
  <b-row class="justify-content-center">
    <div v-for="(standard, standardIndex) in assessment.answers" :key="standard._id">
      <div v-for="(section, sectionIndex) in standard.assessmentData.data.sections" :key="sectionIndex">
        <div v-show="standardIndex === currentStandard && sectionIndex === currentSection" class="animated fadeIn">
          <b-row class="justify-content-center mb-4">
            <h2>{{ standard.name }}</h2>
          </b-row>
          <h4>{{ section.name }} {{ section.control_family }}</h4>
          <b-list-group class="mt-4">
            <b-list-group-item v-for="(question, questionIndex) in section.questions" :key="questionIndex" class="mb-4 border-primary">
              <b-row class="justify-content-end">
                <b-button-group>
                  <b-button variant="primary" v-b-tooltip.hover title="Comments" v-b-toggle="standard.name + '_' + section.name + '_' + questionIndex + '_comments'"><i class="fa fa-comment"></i></b-button>
                  <b-button variant="primary" v-b-tooltip.hover title="Supporting Documentation"><i class="fa fa-file-text"></i></b-button>
                  <b-button variant="primary" v-b-tooltip.hover title="Additional Information"><i class="fa fa-question-circle"></i></b-button>
                </b-button-group>
              </b-row>
              <p>Section {{ question.section }}</p>
              <p><strong>{{question.question}}</strong></p>
              <b-form-radio-group v-model="question.selectedAnswer" buttons button-variant="outline-primary" size="md">
                <b-form-radio class="m-2" v-for="(answer, answerIndex) in standard.assessmentData.data.answers" :key="answerIndex" :value="answer">
                  {{ answer }}
                </b-form-radio>
              </b-form-radio-group>
              <b-row class="justify-content-center">
                <b-collapse class="col-sm-8 mt-4" :id="standard.name + '_' + section.name + '_' + questionIndex + '_comments'">
                  <b-table v-if="question.comments" striped :items="question.comments"></b-table>
                  <b-form-input v-model="question.pendingComment" type="text" placeholder="Comment"></b-form-input>
                  <b-button class="mt-2" variant="primary" @click="addComment(question)">Add Comment</b-button>
                </b-collapse>
              </b-row>
              <b-row class="justify-content-end">
                <b-form-checkbox v-model="question.markedForReview">Mark for review</b-form-checkbox>
              </b-row>
            </b-list-group-item>
          </b-list-group>
        </div>
      </div>
    </div>
  </b-row>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AssessmentQuestions',
  computed: mapState({
    assessment: state => state.openAssessment.assessment,
    currentStandard: state => state.openAssessment.currentStandard,
    currentSection: state => state.openAssessment.currentSection
  }),
  methods: {}
}
</script>
