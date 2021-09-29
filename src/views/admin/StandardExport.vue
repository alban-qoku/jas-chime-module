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
    <b-row>
      <b-col sm="4" class="py-2" v-for="standard in standards" :key="standard._id">
        <b-card class="border-primary" >
          <div class="h1 text-primary text-right mb-4">
            <button class="btn btn-primary spacing" v-on:click="downloadJSON(standard.name, standard._id)"><i class="icon-cloud-download"></i><span>JSON</span></button>
            <button class="btn btn-primary spacing" v-on:click="downloadCSV(standard.name, standard._id)"><i class="icon-cloud-download"></i><span>CSV</span></button>
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
    <b-row class="justify-content-center" v-if="loading">
      <h1><i class="fa fa-spinner fa-pulse fa-3x text-primary"></i></h1>
    </b-row>
    <b-modal v-model="selectedCSV" lazy centered header-bg-variant="primary" id="downloadCSV" title="How to download CSV?"  @cancel="downloadCSVCancel"
             @ok="downloadCSVOk">
      <div class="modal-text-center">
        <p>First, You have to download JSON.</p>
      </div>
      <div class="modal-text-center">
        <p>After that You can use following online service.</p>
      </div>
      <div class="h4 m-0 modal-text-center">
        <a href="https://json-csv.com/" target="_blank">https://json-csv.com/</a>
      </div>
    </b-modal>
    <a id="downloadAnchorElem" style="display:none"></a>
  </div>
</template>

<script>
  export default {
    name: 'MyAssessments',
    data () {
      return {
        error: '',
        selectedCSV: false,
        loading: true,
        routerLink: 'http://json-csv.com/',
        jsonData: '',
        membership: [
          {data: 'small'},
          {data: 'medium'},
          {data: 'large'},
          {data: 'trial'}
        ],
        assessments: [],
        selectedAssessment: {},
        standards: [],
        assessmentData: {
          name: '',
          organisation: '',
          location: '',
          standards: []
        }
      }
    },
    methods: {
      downloadCSVOk () {
        console.log('download csv ok')
      },
      downloadCSVCancel () {
        console.log('download csv cancel')
      },
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
      downloadJSON (standardName, standardId) {
        const data = {
          name: standardName,
          id: standardId
        }
        this.$store.dispatch('downloadJSON', data)
          .then((response) => {
            console.log(response.data.main)
            const filename = response.data.name + '.json'
            let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(response.data.main))
            let dlAnchorElem = document.getElementById('downloadAnchorElem')
            dlAnchorElem.setAttribute('href', dataStr)
            dlAnchorElem.setAttribute('download', filename)
            dlAnchorElem.click()
          })
          .catch((err) => {
            if (err.message === 'Unauthorized') {
              this.$router.push('/login')
            } else {
              this.error = err
            }
          })
      },
      downloadCSV (standardName, standardId) {
        this.selectedCSV = true
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
