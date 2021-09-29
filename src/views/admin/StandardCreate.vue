<template>
  <div class="app profile align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="card mx-4">
            <div class="card-body p-4">
              <br/>
              <form id="app" @submit.prevent="updateUserProfile()">
                <div class="input-group mb-3">
                  <b-form-radio-group
                    id="radio-group-1"
                    v-model="file_type"
                    :options="selectOptions"
                    name="radio-options"
                    required
                  ></b-form-radio-group>
                </div>
                <br/>
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Standard Name</span>
                  </div>
                  <input type="text" class="form-control" placeholder="..." title="Must have atleast one character" pattern="[a-zA-Z].{1,25}" v-model="standard_name" required autofocus>
                  <div class="input-group-prepend">
                    <span class="input-group-text">Standard Description</span>
                  </div>
                  <input type="text" class="form-control" placeholder="..." title="Must have atleast one character" pattern="[a-zA-Z].{1,25}" v-model="standard_description" required>
                </div>
                <br/>
                <div class="input-group mb-3 col-md-12 padding-0">
                  <b-form-file class="file-input-label" ref="fileInput" v-model="file" placeholder="Choose a file...">
                  </b-form-file>
                  <b-button variant="primary" @click="uploadStandard_data(file)">Upload
                  </b-button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Profile',
    data: function () {
      return {
        items: [
          {Username: ' ', FirstName: ' ', LastName: ' ', Email: ' '}
        ],
        standard_name: '',
        standard_description: '',
        selectOptions: [
          { text: 'JSON', value: 'json' },
          { text: 'CSV', value: 'csv' }
        ],
        file_type: 'json',
        error: '',
        success: '',
        validationError: '',
        standards_data: '',
        show: true,
        file: null,
        is_checkable: false
      }
    },
    methods: {
      uploadStandard_data (doc) {
        this.$toastr.defaultTimeout = 500000
        if (this.file_type === '') {
          this.$toastr.e('Please select file type (json / csv)')
        } else if (this.standard_name === '') {
          this.$toastr.e('Please input standard name')
        } else if (this.standard_description === '') {
          this.$toastr.e('Please input standard description')
        } else if (this.file === null) {
          this.$toastr.e('Please choose a file')
        }
        let types = ['json', 'csv']
        let indx = doc.name.lastIndexOf('.')
        let fileType = doc.name.slice(indx + 1)
        let AcceptedFile = types.find((ele) => {
          return ele === fileType
        })
        if (fileType === this.file_type) {
          if (doc.size < 26214400 && AcceptedFile) {
            this.$toastr.i('Uploading standards data....')
            this.$store.dispatch('uploadStandard_data', { files: doc, file_type: this.file_type, standard_name: this.standard_name, standard_description: this.standard_description, parentAccount: this.$store.state.user.parentAccount })
              .then(response => {
                this.standards_data = response.standards_data
                this.$toastr.clearAll()
                this.$toastr.defaultTimeout = 5000
                this.$toastr.s('standards data have been uploaded successfully')
              })
              .catch(err => {
                console.log(err)
                this.$toastr.clearAll()
                this.$toastr.defaultTimeout = 5000
                this.$toastr.e('Error, please try again')
              })
          } else if (doc.size > 26214400) {
            this.$toastr.e('Error, file exceeded limit')
          } else {
            this.$toastr.e('Error, accepted files are only json, and csv')
          }
        } else {
          this.$toastr.e('Error, The selected file type is not equal a recommended file.')
        }
      }
    },
    mounted () {
      if ((this.$store.state.user.trialDetails.status === 1) && (this.$store.state.user.trialRemainingDays <= 0)) {
        this.$store.dispatch('showTrialModal')
      }
    }
  }
</script>

<style lang="css">
  .app.profile{
    min-height: auto;
  }
  .file-input-label{
    margin-right: 10px;
  }
  .btn-block{
    width: auto;
  }
  .btn-block + .btn-block{
    margin-top: 0px;
  }
  .img-avatar-profile{
    width: 150px;
    height: 150px;
  }
  .justify-center{
    justify-content: center;
  }
  .custom-btn{
    margin-left: 5px;
    margin-right: 5px;
  }
  .flex{
    display: flex;
  }
  .padding-0{
    padding:0;
  }
  .bold{
    font-weight: bold;
  }
</style>
