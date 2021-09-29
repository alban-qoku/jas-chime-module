<template>
  <div class="table-responsive">
    <b-table striped :items="standard.assessmentData.data.sections" :fields="fields" style="background: white">
      <template slot="name" slot-scope="data">
        {{ data.item.name }}
      </template>
      <template slot="control_family" slot-scope="data">
        {{ data.item.control_family }}
      </template>
      <template slot="totalQuestions" slot-scope="data">
        <b-badge variant="primary" pill>{{ data.item.questions.length }}</b-badge>
      </template>
      <template slot="questionsRemaining" slot-scope="data">
        <b-badge variant="primary" pill>{{ questionsRemaining(data.item.questions) }}</b-badge>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'NIST80053Sections',
  props: {
    standard: Object
  },
  data () {
    return {
      fields: [
        { key: 'name', label: 'Section' },
        { key: 'control_family', label: 'Control Family' },
        { key: 'totalQuestions', label: 'Total Questions' },
        { key: 'questionsRemaining', label: 'Questions Remaining' }
      ]
    }
  },
  methods: {
    questionsRemaining (questions) {
      return questions.length - questions.filter(question => question.selectedAnswer && !question.markedForReview).length
    }
  }
}
</script>
