<template>
  <div class="container">
    <b-row class="justify-content-center" v-if="loading">
      <h1><i class="fa fa-spinner fa-pulse fa-3x text-primary"></i></h1>
    </b-row>
    <div class="row init-div" v-else>
      <b-row v-if="error" class="justify-content-center">
        <b-col sm="12">
          <b-alert show dismissible variant="danger" class="text-center">
            <strong><i class="fa fa-warning"></i> Error:</strong> {{ error }}
          </b-alert>
        </b-col>
      </b-row>
      <div class="col-md-12 col-sm-12 init-div" v-else>
        <div class="row init-div mb-3">
          <div class="col-md-6 col-sm-12 init-div">
            <h1>{{this.standard.name}}</h1>
          </div>
          <div class="col-md-6 col-sm-12 init-div text-right submit-btn-content">
            <button  v-if="!$store.state.user.permissions.includes('admin')" class="btn btn-primary px-4" style="margin-right: 5px; width: 155px" @click="showResetStandardModal()">Reset</button>
            <button  class="btn btn-primary px-4" style="width: 155px" @click="updateStandard()">Submit Changes</button>
          </div>
        </div>
        <b-list-group v-for="(sec, ind) in standard.assessmentData.data.sections" :key="ind">

          <b-list-group v-for="(question, index) in sec.questions" :key="index">
            <b-card :header="'section : ' + question.section" header-tag="h4" class="text-center">
              <b-list-group-item class="view-standard">
                <strong>Question : </strong> <textarea row="10" class="edit-question-textarea" contenteditable="true" v-model="question.question" v-on:change="sectionChange(ind, index, question)"></textarea>
              </b-list-group-item>

              <b-list-group-item class="view-standard">
                <strong>Control : </strong><textarea row="10" class="edit-question-textarea" contenteditable="true" v-if="question.cui_security_requirement" v-model="question.cui_security_requirement" v-on:change="sectionChange(ind, index, question)"></textarea>
                <textarea row="10" class="edit-question-textarea" contenteditable="true" v-else v-model="question.control" v-on:change="sectionChange(ind, index, question)"></textarea>
              </b-list-group-item>

              <b-list-group-item  class="view-standard">
                <div class="col-md-6 col-sm-8 init-div">
                  <strong>Tags : </strong>
                  <b-form-select v-model="question.tags" :options="options" multiple :select-size="3" v-on:change="sectionChange(ind, index, question)"></b-form-select>
                </div>
              </b-list-group-item>
            </b-card>
          </b-list-group>

        </b-list-group>
      </div>
    </div>
    <b-modal v-model="bResetStandard" lazy centered header-bg-variant="primary" id="disclaimerModal" title="Reset Standard?"  @cancel="handleResetCancel"
             @ok="handleResetOk">
      <p>Warning: you are about to reset all standards back to their original settings</p>
      <p>Would you like to proceed?</p>
    </b-modal>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        standard: {},
        questions: [],
        error: '',
        loading: true,
        bResetStandard: false,
        options: ['Procedure', 'Technical Implementation', 'Policy'],
        updatedIndex: []
      }
    },
    methods: {
      getStandard () {
        this.$store.dispatch('getStandard', { id: this.$route.params.id })
          .then((response) => {
            this.standard = response
            this.questions = response.assessmentData.data.sections[0].questions
            this.loading = false
          })
          .catch((err) => {
            if (err.message === 'Forbidden') {
              this.error = 'The standards can be updated by only admin.'
            } else {
              if (err.message === 'Unauthorized') {
                this.$router.push('/login')
              } else {
                this.error = err.message
              }
            }
            this.loading = false
          })
      },
      showResetStandardModal () {
        this.bResetStandard = true
      },
      handleResetOk () {
        this.bResetStandard = false
        this.resetStandard()
      },
      handleResetCancel () {
        this.bResetStandard = false
      },
      resetStandard () {
        this.$toastr.i('resetting standard....')
        this.$store.dispatch('resetStandard', this.standard)
          .then((response) => {
            this.$toastr.s('Standard has been reseted successfully')
            this.$router.push(`/standards/list`)
          })
          .catch((err) => {
            if (err.message === 'Unauthorized') {
              this.$router.push('/login')
            } else {
              this.error = err.message
            }
          })
      },
      sectionChange (sectionIndex, questionIndex, question) {
        const indexOfItemInArray = this.updatedIndex.findIndex(q => (q.sectionIndex === sectionIndex && q.questionIndex === questionIndex))
        if (indexOfItemInArray > -1) {
          this.updatedIndex[indexOfItemInArray].question = question
        } else {
          this.updatedIndex.push({sectionIndex: sectionIndex, questionIndex: questionIndex, question: question})
        }
      },
      updateStandard () {
        this.$toastr.i('updating standard....')
        this.standard.updatedIndex = this.updatedIndex
        this.$store.dispatch('updateStandard', this.standard)
          .then((response) => {
            this.$toastr.s('Standard has been updated successfully')
          })
          .catch((err) => {
            if (err.message === 'Unauthorized') {
              this.$router.push('/login')
            } else {
              this.error = err.message
            }
          })
      }
    },
    mounted () {
      this.getStandard()
    }
  }
</script>
<style>
  .submit-btn-content{
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .list-group-item.view-standard{
    text-align: left;
  }
  .list-group-item.view-standard:last-child > .col-md-6.col-sm-8.init-div{
    display: flex;
    align-items: center;
  }
  .custom-select[multiple]{
    overflow: hidden;
    padding-right: 15px;
    margin-left: 10px;
    width: 80%;
  }
</style>
