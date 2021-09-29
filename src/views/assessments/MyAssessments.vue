<template>
  <div class="animated fadeIn">
    <b-row class="justify-content-end mb-2 init-div">
      <i class="fa fa-star text-primary"></i> = Assessment currently open
    </b-row>
    <b-row v-if="error" class="justify-content-center">
      <b-col sm="8">
        <b-alert show dismissible variant="danger" class="text-center">
          <strong><i class="fa fa-warning"></i> Error:</strong> {{ error }}
        </b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="4" class="py-2">
        <b-card class="h-100" border-variant="primary">
          <b-btn v-b-modal.createModal style="background: transparent; position: absolute; top: 0; left: 0; height: 100%; width: 100%"></b-btn>
          <i class="fa fa-plus bg-primary p-3 font-2x1 mr-3 float-left"></i>
          <div class="h4 m-0">Create New Assessment</div>
          <b-progress height={} class="progress-xs my-3" variant="success" :value="0" />
          <div class="text-center">Create new security compliance assessment</div>
        </b-card>
      </b-col>
      <b-col sm="4" class="py-2" v-for="assessment in assessments" :key="assessment._id">
        <b-card class="h-100" :border-variant="progressVariant(assessment.progress)">
          <i v-if="$store.state.user.permissions.includes('user_admin')" slot="header" @click="confirmDeleteAssessment(assessment)" class="fa fa-trash fa-lg float-right text-secondary"></i>
          <i v-if="assessment._id === $store.state.openAssessment.assessment._id" class="fa fa-star fa-2x text-primary pull-right"></i>
          <i class="icon-list p-3 font-2x1 mr-3 float-left" v-bind:class="iconBackground(assessment.progress)"></i>
          <router-link :to="'/assessments/' + assessment._id">
            <div class="h4 m-0">{{ assessment.name }} <small>{{ assessment.organisation }}</small></div>
          </router-link>
          <b-progress height={} class="progress-xs my-3" :variant="progressVariant(assessment.progress)" :value="assessment.progress" />
          <div class="text-center align-bottom">This assessment is <strong>{{ assessment.progress || 0 }}%</strong> complete</div>
        </b-card>
      </b-col>
    </b-row>
    <b-modal id="createModal" ref="modal" title="Create a New Assessment" centered header-bg-variant="primary" @ok="handleOk" @shown="clearAssessmentData" lazy no-close-on-backdrop no-close-on-esc>
      <b-form id="assessmentForm" @submit.stop.prevent="createAssessment" novalidate>
        <b-form-group id="assessmentNameGroup" label="Assessment Name:">
          <b-form-input id="assessmentName" v-model="assessmentData.name" placeholder="Enter Assessment Name" required></b-form-input>
          <b-form-invalid-feedback>Please provide an assessment name.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="assessmentorganisationGroup" label="organisation:" v-if="isOrganisationApplicable">
          <b-form-input id="assessmentorganisation" v-model="assessmentData.organisation" placeholder="Enter organisation" required></b-form-input>
          <b-form-invalid-feedback>Please provide the organziation.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="assessmentLocationGroup" label="Location:">
          <b-form-input id="assessmentLocation" v-model="assessmentData.location" placeholder="Enter Location" required></b-form-input>
          <b-form-invalid-feedback>Please provide the location.</b-form-invalid-feedback>
        </b-form-group>
        <!--<b-form-group id="assessmentStandardsType" label="Question Preference :" description="Select your assesment type.">-->
          <!--<b-form-radio-group-->
            <!--id="radio-group-1"-->
            <!--v-model="assessmentData.type"-->
            <!--:options="selectOptions"-->
            <!--name="radio-options"-->
            <!--required-->
          <!--&gt;</b-form-radio-group>-->
          <b-form-invalid-feedback>Please select at least one security standard.</b-form-invalid-feedback>
        <b-form-group id="assessmentStandardsGroup" label="Security Standards:" description="Select the standards to include in this assessment.">
          <b-form-select id="standardsSelections" multiple plain :select-size="3" v-model="assessmentData.standards" :options="standards" @change="selectChanges" ref="standards" class="mb-3" required></b-form-select>
          <b-form-select id="cmmcLevels" v-model="assessmentData.selectedLevel" v-if="isCMMC" :options="levels" size="sm" ref="cmmcLevels" class="mb-3" required></b-form-select>
        </b-form-group>
      </b-form>
    </b-modal>
    <b-modal id="deleteModal" ref="deleteModal" title="Confirm delete" centered lazy header-bg-variant="primary" hide-footer>
      <p>Are you sure you want to delete <strong>{{selectedAssessment.name}}</strong>?</p>
      <footer class="modal-footer">
        <button class="btn btn-primary" @click="deleteAssessment(selectedAssessment._id)" type="button">Yes</button>
        <button class="btn btn-secondary" @click="$refs.deleteModal.hide()" type="button">No</button>
      </footer>
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: 'MyAssessments',
    data () {
      return {
        checked: true,
        error: '',
        membership: [
          {data: 'small'},
          {data: 'medium'},
          {data: 'large'},
          {data: 'trial'}
        ],
        isOrganisationApplicable: false,
        assessments: [],
        selectedAssessment: {},
        standards: [],
        isCMMC: false,
        selectOptions: [
          { text: 'Display Sub-Questions', value: 'questions' },
          { text: 'Hide Sub-Questions', value: 'verbatim' }
        ],
        levels: [
          {value: 'Level 1', text: 'Level 1'},
          {value: 'Level 2', text: 'Level 2'},
          {value: 'Level 3', text: 'Level 3'},
          {value: 'Level 4', text: 'Level 4'},
          {value: 'Level 5', text: 'Level 5'}
        ],
        assessmentData: {
          name: '',
          type: '',
          organisation: 'my organisation',
          organisationWebsite: 'www.example.com',
          location: '',
          standards: [],
          selectedLevel: 'Level 1'
        }
      }
    },
    methods: {
      getAssessments () {
        // this.$store.dispatch('getAssessments')
        //   .then((response) => { this.assessments = response })
        let data = {
          organisation: localStorage.getItem('organisation'),
          user: localStorage.getItem('vuex')
        }
        this.$store.dispatch('getAllAssessments', data)
          .then((response) => {
            this.assessments = response
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
      getStandards () {
        let user = JSON.parse(localStorage.getItem('vuex'))
        let userId = user.user.id
        let data
        if (this.$store.state.user.parentAccount.hasParent) {
          data = {
            id: this.$store.state.user.parentAccount.parentId,
            organisation: localStorage.getItem('organisation')
          }
        } else {
          data = {
            id: userId,
            organisation: localStorage.getItem('organisation')
          }
        }
        this.$store.dispatch('getUserStandards', data)
          .then((response) => {
            if (response.standard.length > 0) {
              // var result = response.standard
              let standardData = response.standard
              let result = []
              let resultNotCmmc
              let resultCmmc
              let showedMembership
              if (this.$store.state.user.parentAccount.hasParent) {
                showedMembership = this.membership[this.$store.state.user.parentAccount.parentMembership].data
              } else {
                showedMembership = this.membership[this.$store.state.user.membership].data
              }
              for (let i = 0; i < standardData.length; i++) {
                if (standardData[i].membership[showedMembership] === true) {
                  result.push(standardData[i])
                }
              }
              resultNotCmmc = result.filter(standard => standard.name.includes('CMMC') === false)
              this.standards = resultNotCmmc.map((standard) => {
                return { value: standard._id, text: standard.name }
              })
              resultCmmc = result.filter(standard => standard.name.includes('CMMC') === true)
              if (resultCmmc.length !== 0) {
                this.standards.push({value: 'CMMC', text: 'CMMC'})
              }
            }
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
      handleOk (event) {
        console.log('type: ', this.assessmentData.type)
        event.preventDefault()
        const form = document.getElementById('assessmentForm')
        if (!form.checkValidity()) {
          event.preventDefault()
          form.classList.add('was-validated')
        } else {
          this.createAssessment()
        }
      },
      createAssessment () {
        // this.assessmentData.organisation = localStorage.getItem('organisation')
        this.assessmentData.type = 'questions'
        if (localStorage.getItem('organisation')) {
          this.assessmentData.organisation = localStorage.getItem('organisation')
          this.assessmentData.organisationWebsite = JSON.parse(localStorage.getItem('vuex')).user.organisationWebsite || ''
        }
        console.log('assesement data is some thing:::,', this.assessmentData)
        this.$store.dispatch('createAssessment', this.assessmentData)
          .then(response => this.$router.push(`/assessments/${response.created}?created=true`))
          .catch(err => alert(err))
      },
      clearAssessmentData () {
        this.assessmentData.name = ''
        this.assessmentData.organisation = ''
        this.assessmentData.location = ''
        this.assessmentData.standards = []
        this.assessmentData.selectedLevel = 'Level 1'
        this.isCMMC = false
      },
      progressVariant (progress) {
        if (!progress) { return 'danger' }
        return progress < 100 ? 'warning' : 'success'
      },
      confirmDeleteAssessment (assessment) {
        this.selectedAssessment = assessment
        this.$refs['deleteModal'].show()
      },
      deleteAssessment (assessmentId) {
        this.$store.dispatch('deleteAssessment', assessmentId)
          .then(response => {
            if (response.success === 201) {
              this.$toastr.e(response.message)
              this.$refs['deleteModal'].hide()
            } else {
              this.getAssessments()
              this.$refs['deleteModal'].hide()
            }
          })
          .catch(err => alert(err))
      },
      iconBackground (progress) {
        if (!progress) { return 'bg-danger' }
        return progress < 100 ? 'bg-warning' : 'bg-success'
      },
      selectChanges (e) {
        var display = document.getElementById('standardsSelections')
        console.log('selecte option: ', display.__vue__.options[display.selectedIndex].text)
        if (display.__vue__.options[display.selectedIndex].text === 'CMMC') {
          this.isCMMC = true
        } else {
          this.isCMMC = false
        }
      }
    },
    mounted () {
      if (localStorage.getItem('organisation')) {
        this.isOrganisationApplicable = false
      } else {
        this.isOrganisationApplicable = true
      }
      this.getAssessments()
      this.getStandards()
      if ((this.$store.state.user.trialDetails.status === 1) && (this.$store.state.user.trialRemainingDays <= 0)) {
        this.$store.dispatch('showTrialModal')
      }
    }
  }
</script>
<style>
  #cmmcLevels{
    background: none;
  }
</style>
