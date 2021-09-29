<template>
  <div class="app profile align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="card mx-4">
            <div class="card-body p-4">
              <div class="row">
                <div class="col-md-12" style="display: flex; justify-content: center;">
                  <h5>Backup All Standards</h5>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12" style="display: flex; margin: 10px;">
                  <span class="input-group-text" style="width: 20%; justify-content: center;">Backup Data Description</span>
                  <input type="text" style="width: 80%;" class="form-control" placeholder="..." title="Must have atleast one character" pattern="[a-zA-Z].{1,25}" v-model="backupDataDescription" required autofocus>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12" style="width: 100%; display: flex; margin: 10px;">
                  <date-picker v-model="backupDate" valueType="format" style="width: 90%!important;"></date-picker>
                  <b-button variant="primary" @click="backupStandards" style="width: 10%;">Backup
                  </b-button>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12" style="display: flex; margin: 10px;">
                  <b-progress v-if="!backupFailed" style="width: 100%;" variant="success" striped animated :value="backupProgressWidth"></b-progress>
                  <b-progress v-else-if="!backupFailed" style="width: 100%;" variant="success" striped animated :value="backupProgressWidth"></b-progress>
                </div>
              </div>
            </div>
          </div>
          <div class="card mx-4">
            <div class="card-body p-4">
              <div class="row">
                <div class="col-md-12" style="display: flex; justify-content: center;">
                  <h5>Fetch All Standards</h5>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12" style="width: 100%; display: flex; margin: 10px;">
                  <span class="input-group-text" style="width: 20%; justify-content: center;">Select BackUp Data</span>
                  <b-form-select id="select_backup_data" style="width: 80%;" v-model="selected" :options="options" place @change="selectChanges">
                  </b-form-select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12" style="display: flex; margin: 10px;">
                  <span class="input-group-text" style="width: 20%; justify-content: center;">Backup Data Infos</span>
                  <input type="text" style="width: 70%;" class="form-control" placeholder="..." title="Must have atleast one character" pattern="[a-zA-Z].{1,25}" v-model="fetchDataDescription" required autofocus>
                  <b-button style="width: 10%;" variant="primary" @click="fetchStandards">Fetch
                  </b-button>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12" style="display: flex; margin: 10px;">
                  <b-progress v-if="!fetchFailed" style="width: 100%;" variant="success" striped animated :value="fetchProgressWidth"></b-progress>
                  <b-progress v-else-if="fetchFailed" style="width: 100%;" variant="danger" striped animated :value="fetchProgressWidth"></b-progress>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/index.css'
  export default {
    name: 'BackupStandards',
    components: { DatePicker },
    data: function () {
      return {
        options: [],
        selected: null,
        fetchSelectedDate: '',
        fetchSelectedDescription: '',
        backupDataInfos: [],
        backupDataDescription: '',
        backupProgressWidth: '',
        fetchProgressWidth: '',
        fetchDataDescription: '',
        nI: 0,
        nId: '',
        FetchNI: 0,
        FetchNId: '',
        bBackupSuccess: false,
        bFetchSuccess: false,
        backupDate: '',
        fetchFailed: false,
        backupFailed: false
      }
    },
    methods: {
      getAllBackupStandardsInfo () {
        this.options = []
        const optionFirstItem = {
          text: 'select backup data...',
          value: null
        }
        this.options.push(optionFirstItem)
        this.$store.dispatch('getAllBackupStandardsInfo')
          .then(backupDataInfos => {
            this.backupDataInfos = backupDataInfos
            for (let i = 0; i < this.backupDataInfos.length; i++) {
              let optionItem = {
                text: this.backupDataInfos[i].backupDate,
                value: this.backupDataInfos[i].description
              }
              this.options.push(optionItem)
            }
          })
          .catch()
      },
      selectChanges () {
        let display = document.getElementById('select_backup_data')
        console.log('selecte option: ', display.__vue__.options[display.selectedIndex].text)
        if (display.selectedIndex !== 0) {
          this.fetchDataDescription = 'Date: ' + this.options[display.selectedIndex].text + '   |    Description: ' + this.options[display.selectedIndex].value
          this.fetchSelectedDescription = this.options[display.selectedIndex].value
          this.fetchSelectedDate = this.options[display.selectedIndex].text
        }
      },
      backupStandards () {
        if (this.backupDataDescription === '') {
          this.$toastr.e('Input Description...')
          return
        }
        if (this.backupDate === '') {
          this.$toastr.e('Select Date...')
          return
        }
        this.backupFailed = false
        this.bBackupSuccess = false
        this.backupProgressWidth = 0
        this.nI = 0
        if (this.nI === 0) {
          this.nI = 1
          this.nId = window.setInterval(this.progressWidthBackup, 150)
        }
        let backupData = {
          date: this.backupDate,
          description: this.backupDataDescription
        }
        this.$store.dispatch('backupStandards', backupData)
          .then(resp => {
            console.log(resp)
            this.$toastr.s('Backup standards successfully...')
            this.bBackupSuccess = true
            this.backupProgressWidth = 100
            const optionItem = {
              text: this.backupDate,
              value: this.backupDataDescription
            }
            this.options.push(optionItem)
          })
          .catch(err => {
            this.$toastr.e(err.message)
            this.backupFailed = true
            window.clearInterval(this.nId)
          })
      },
      fetchStandards () {
        if (this.fetchDataDescription === '') {
          this.$toastr.e('Select Backup Data...')
          return
        }
        this.fetchFailed = false
        this.bFetchSuccess = false
        this.fetchProgressWidth = 0
        this.FetchNI = 0
        if (this.FetchNI === 0) {
          this.FetchNI = 1
          this.FetchNId = window.setInterval(this.progressWidthFetch, 300)
        }
        let backupData = {
          date: this.fetchSelectedDate,
          description: this.fetchSelectedDescription
        }
        this.$store.dispatch('fetchStandards', backupData)
          .then(resp => {
            console.log(resp)
            this.$toastr.s('Fetch standards successfully...')
            this.bFetchSuccess = true
            this.fetchProgressWidth = 100
          })
          .catch(err => {
            this.$toastr.e(err.message)
            this.fetchFailed = true
            window.clearInterval(this.FetchNId)
          })
      },
      progressWidthBackup () {
        if (this.backupProgressWidth >= 90 || this.bBackupSuccess) {
          window.clearInterval(this.nId)
          if (this.bBackupSuccess) {
            this.backupProgressWidth = 100
          }
          this.nI = 0
        } else {
          this.backupProgressWidth = this.backupProgressWidth + 2
        }
      },
      progressWidthFetch () {
        if (this.fetchProgressWidth >= 90 || this.bFetchSuccess) {
          window.clearInterval(this.FetchNId)
          if (this.bFetchSuccess) {
            this.fetchProgressWidth = 100
          }
          this.nI = 0
        } else {
          this.fetchProgressWidth = this.fetchProgressWidth + 2
        }
      }
    },
    mounted () {
      this.getAllBackupStandardsInfo()
      if ((this.$store.state.user.trialDetails.status === 1) && (this.$store.state.user.trialRemainingDays <= 0)) {
        this.$store.dispatch('showTrialModal')
      }
    }
  }
</script>

<style lang="css">

</style>
