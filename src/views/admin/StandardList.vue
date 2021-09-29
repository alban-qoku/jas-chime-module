<template>
  <div class="animated fadeIn">
    <b-row class="justify-content-end mb-2 init-div">
      <i class="fa fa-star text-primary"></i> = Standards currently open
    </b-row>
    <b-row v-if="error" class="justify-content-center">
      <b-col sm="8">
        <b-alert show dismissible variant="danger" class="text-center">
          <strong><i class="fa fa-warning"></i> Error:</strong> {{ error }}
        </b-alert>
      </b-col>
    </b-row>
    <b-row class="justify-content-center" v-if="loading">
      <h1><i class="fa fa-spinner fa-pulse fa-3x text-primary"></i></h1>
    </b-row>
    <b-row>
      <b-col sm="4" class="py-2" v-for="standard in standards" :key="standard._id">
        <b-card class="border-primary" >
          <div class="h1 text-primary text-right mb-4">
            <span v-if="$store.state.user.permissions.includes('user_admin') || $store.state.user.permissions.includes('admin')" @click="deleteStandard(standard._id)">
              <i class="icon-trash"></i>
            </span>
            <span>
              <i class="icon-docs"></i>
            </span>
          </div>
          <router-link v-if="$store.state.user.permissions.includes('user')" :to="'/standards/' + standard._id">
            <div class="h4 mb-0"> {{ standard.name }} </div>
          </router-link>
          <router-link v-if="$store.state.user.permissions.includes('admin')" :to="'/standards/standardorigin/' + standard._id">
            <div class="h4 mb-0"> {{ standard.name }} </div>
          </router-link>
          <p> {{ standard.description }} </p>
        </b-card>
      </b-col>
    </b-row>
    <b-modal v-model="boolRemoveStandard" lazy centered header-bg-variant="primary" no-close-on-backdrop no-close-on-esc id="deleteUserModal" title="Remove Standard?"  @cancel="handleRemoveStandardCancel"
             @ok="handleRemoveStandardOk">
      <h5>To remove this standard type, "<span style="color: red">remove</span>" below.</h5>
      <br>
      <div class="col-md-12 col-sm-12 init-div">
        <input type="text" class="form-control custom-input" placeholder="remove" title="Must contain between 5 to 12 characters and no special characters allowed" pattern="[a-zA-Z0-9_.-]{5,25}"  v-model="removeStandardInput" required>
      </div>
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: 'MyAssessments',
    data () {
      return {
        error: '',
        membership: [
          {data: 'small'},
          {data: 'medium'},
          {data: 'large'},
          {data: 'trial'}
        ],
        boolRemoveStandard: false,
        removeStandardInput: '',
        selectedStandardId: '',
        assessments: [],
        selectedAssessment: {},
        standards: [],
        assessmentData: {
          name: '',
          organisation: '',
          location: '',
          standards: []
        },
        loading: true
      }
    },
    methods: {
      getStandards () {
        this.$store.dispatch('getStandards')
          .then((response) => {
            let standardsData = response
            let showedMembership
            if (this.$store.state.user.parentAccount.hasParent) {
              showedMembership = this.membership[this.$store.state.user.parentAccount.parentMembership].data
            } else {
              showedMembership = this.membership[this.$store.state.user.membership].data
            }
            for (let i = 0; i < standardsData.length; i++) {
              if (standardsData[i].membership[showedMembership] === true) {
                this.standards.push(standardsData[i])
              }
            }
            this.loading = false
          })
          .catch((err) => {
            if (err.message === 'Unauthorized') {
              this.$router.push('/login')
            } else {
              this.loading = false
              this.error = err
            }
          })
      },
      deleteStandard (standardId) {
        this.selectedStandardId = standardId
        this.boolRemoveStandard = true
      },
      handleRemoveStandardOk (e) {
        e.preventDefault()
        if (this.removeStandardInput === 'remove') {
          this.$store.dispatch('deleteStandard', this.selectedStandardId)
            .then(res => {
              console.log(res)
              this.$toastr.s('Romoved Standard Successully')
            })
            .catch(err => {
              console.log(err)
              this.$toastr.e('Failed Removing Standard')
            })
          this.boolRemoveStandard = false
        } else {
          this.$toastr.e('Wrong word')
        }
        this.removeStandardInput = ''
      },
      handleRemoveStandardCancel () {
        this.removeStandardInput = ''
        this.boolRemoveStandard = false
      }
    },
    mounted () {
      this.getStandards()
      if ((this.$store.state.user.trialDetails.status === 1) && (this.$store.state.user.trialRemainingDays <= 0)) {
        this.$store.dispatch('showTrialModal')
      }
    }
  }
</script>
