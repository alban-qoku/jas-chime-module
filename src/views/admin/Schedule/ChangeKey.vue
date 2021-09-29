<template>
  <div class="app profile align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="card mx-4">
            <div class="card-body p-4">
              <form id="app">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Calendly APP URL</span>
                  </div>
                  <input type="text" class="form-control" placeholder="..." title="Must have atleast one character" pattern="[a-zA-Z].{1,25}" :readonly="true" v-model="currentAppURL" required autofocus>
                  <div class="input-group-prepend" @click="btnUrlChangeClicked()">
                    <span class="input-group-text btn-change">change</span>
                  </div>
                </div>
                <br/>
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Calendly API Key</span>
                  </div>
                  <input type="text" class="form-control" placeholder="..." title="Must have atleast one character" pattern="[a-zA-Z].{1,25}" :readonly="true"  v-model="currentAPIKey" required autofocus>
                  <div class="input-group-prepend" @click="btnKeyChangeClicked()">
                    <span class="input-group-text btn-change">change</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <b-modal  title="CHANGE APP URL" centered header-bg-variant="primary"  v-model="showUrlModal" lazy no-close-on-backdrop no-close-on-esc @ok="changeAppUrlOk">
        <b-form @submit.stop.prevent="" novalidate>
          <b-form-group label="CURRENT APP URL:">
            <b-form-input required :readonly="true" v-model="currentAppURL"></b-form-input>
            <b-form-invalid-feedback>Please provide an assessment name.</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group label="CHANGE APP URL:">
            <b-form-input placeholder="Enter new url" v-model="changeAppURL" required></b-form-input>
            <b-form-invalid-feedback>Please provide the organziation.</b-form-invalid-feedback>
          </b-form-group>
        </b-form>
      </b-modal>
      <b-modal  title="CHANGE API KEY" centered header-bg-variant="primary"  v-model="showKeyModal" lazy no-close-on-backdrop no-close-on-esc @ok="changeApiKeyOk">
        <b-form @submit.stop.prevent="" novalidate>
          <b-form-group label="CURRENT API KEY:">
            <b-form-input required :readonly="true" v-model="currentAPIKey"></b-form-input>
            <b-form-invalid-feedback>Please provide an assessment name.</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group label="CHANGE API KEY:">
            <b-form-input placeholder="Enter new api key" v-model="changeAPIKey" required></b-form-input>
            <b-form-invalid-feedback>Please provide the organziation.</b-form-invalid-feedback>
          </b-form-group>
        </b-form>
      </b-modal>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ChangeAPIKey',
    data () {
      return {
        currentAPIKey: '',
        currentAppURL: '',
        showKeyModal: false,
        showUrlModal: false,
        changeAppURL: '',
        changeAPIKey: ''
      }
    },
    methods: {
      btnUrlChangeClicked () {
        this.showUrlModal = true
      },
      btnKeyChangeClicked () {
        this.showKeyModal = true
      },
      changeAppUrlOk (e) {
        e.preventDefault()
        if (this.changeAppURL !== '') {
          this.$store.dispatch('changedCalendlyAppUrl', {url: this.changeAppURL})
            .then(urlData => {
              this.currentAppURL = this.changeAppURL
              this.changeAppURL = ''
              this.$toastr.s('Calendly app url is changed successfully')
            })
            .catch(err => {
              if (err.message === 'Unauthorized') {
                this.$router.push('/login')
              } else {
                this.error = err.message
              }
            })
          this.showUrlModal = false
        } else {
          this.$toastr.e('Type new app url')
        }
      },
      changeApiKeyOk (e) {
        e.preventDefault()
        if (this.changeAPIKey !== '') {
          this.$store.dispatch('changedCalendlyApiKey', {key: this.changeAPIKey})
            .then(keyData => {
              this.currentAPIKey = this.changeAPIKey
              this.changeAPIKey = ''
              this.$toastr.s('Calendly api key is changed successfully')
            })
            .catch(err => {
              if (err.message === 'Unauthorized') {
                this.$router.push('/login')
              } else {
                this.error = err.message
              }
            })
          this.showKeyModal = false
        } else {
          this.$toastr.e('Type new api key')
        }
      },
      getCalendlyData () {
        this.$store.dispatch('getCalendlyData')
          .then(calendlyData => {
            this.currentAppURL = calendlyData.calendlyAppUrl
            this.currentAPIKey = calendlyData.calendlyAPIKey
          })
          .catch(err => {
            if (err.message === 'Unauthorized') {
              this.$router.push('/login')
            } else {
              this.error = err.message
            }
          })
      }
    },
    mounted () {
      this.getCalendlyData()
    }
  }
</script>
<style>
  .form-control:disabled, .form-control[readonly] {
    background-color: #ffffff!important;
    opacity: 1;
  }
  .input-group-text.btn-change {
    background-color: #26b5e5!important;
    color: #ffffff!important;
  }
</style>
