<template>
  <b-card>
    <div class="animated fadeIn">
      <div class="action">
        <b-row class="justify-content-center">
              <b-button size="lg" variant="success" v-if="selected.length" @click="exportIssue"><span>Export</span></b-button>
        </b-row>
        <div class="alert alert-success" v-if="success">
          <strong>
            <i class="fa fa-warning"></i>
          </strong>
          {{success}}
        </div>
      </div>
      <div class="jira-export-section">
        <table>
          <tr>
            <th style="width: 15%;">Export to Jira Selection</th>
            <th style="width: 65%;">Controls/Articles</th>
            <th style="width: 20%;">Complance Rating</th>
          </tr>
          <tr v-for="(question, questionNavIndex) in list" :key="'qutest_' + questionNavIndex">
            <td><input type="checkbox" @change="checkSelected()" v-model="question.isSelected"></td>
            <td>
              <div style="padding: 10px;">
                <div><strong>Section:</strong> {{question.section.match(/(\d+?\.\d+)\s?.*/)[1]}}</div>
                <div><strong>Title:</strong> {{question.control_objective}}</div>
                <div><strong>Question:</strong> {{question.question}}</div>
              </div>
            </td>
            <td>
              <div v-if="question.selectedAnswer && question.selectedAnswer.answer">
                <span>{{question.selectedAnswer.answer}}</span>
              </div>
              <div v-else>
                No Data Found
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </b-card>
</template>

<script>
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default {
  data () {
    return {
      assessment: [],
      list: [],
      selected: [],
      lastAssessement: {},
      success: ''
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
          this.tempData = []
          if (this.$route.params.id && response.length) {
            response.filter((item) => {
              if (item._id === this.$route.params.id) {
                this.assessment = item
              }
            })
          }
          this.assessment.answers.filter((standard) => {
            standard.assessmentData.data.sections.filter((section) => {
              section.questions.filter((question) => {
                if (question.selectedAnswer && question.selectedAnswer.answer && question.selectedAnswer.answer !== 'Control Met') {
                  this.list.push(question)
                }
              })
            })
          })
          if (this.list.length) {
            this.list.filter((item) => {
              item['isSelected'] = false
            })
          }
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

    checkSelected () {
      this.selected = this.list.filter((item) => item.isSelected)
    },

    async exportIssue () {
      this.$store.dispatch('exportIssue', this.selected).then(response => {
        this.selected.filter((item) => {
          item.isSelected = false
        })
        this.success = 'Jira exported successfully'
        setTimeout(() => {
          this.$router.push({ path: 'list' })
        }, 3000)
      }).catch(err => alert(err))
    }
  },
  mounted () {
    this.getAssessments()
  }
}
</script>

<style lang="css">
  table {
    width: 100%;
    border-spacing: 40px;
  }
  td:first-child {
    width: 180px;
    text-align: center;
  }
  /*td:not(:first-child):not(:last-child) {*/
    /*width: 30%;*/
  /*}*/
  /*th:nth-child(1){*/
    /*width: 180px;*/
  /*}*/
  /*th:nth-child(2){*/
    /*width: 30%;*/
  /*}*/
  .action {
    min-height: 50px;
  }
  input[type="checkbox"] {
    min-height: 20px;
    min-width: 20px;
  }
</style>
