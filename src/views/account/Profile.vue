<template>
  <div class="app profile align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="card mx-4">
            <div class="card-body p-4">
              <div class="alert alert-success" v-if="success">
                <strong><i class="fa fa-warning"></i> Updated Password:</strong> {{ success }}
              </div>
              <div class="alert alert-danger" v-if="error">
                <strong><i class="fa fa-warning"></i> Registration ERROR:</strong> {{ error }}
              </div>
              <h1 class="text-center" v-show="showProfileText">Profile</h1>
              <br/>
              <div v-if="!editProfile">

                <img :src="avatar" class="img-avatar-profile" alt="profile image">
                <table class="table table-striped">
                  <thead>
                  <tr>
                    <td>First Name</td><td class="bold">{{user.firstName}}</td>
                    <td>Last Name</td><td class="bold text-left">{{user.lastName}}</td>
                  </tr>
                  <tr>
                    <td>User Name</td><td class="bold">{{user.username}}</td>
                    <td>Email</td><td class="bold">{{user.email}}</td>
                  </tr>
                  <tr>
                    <!--<td width="25%">organization</td><td class="bold" colspan="3">{{user.organisation}}</td>-->
                    <td>Account Id</td><td v-if="user.accountId !== 0" class="bold">{{user.accountId}}</td><td v-else-if="user.accountId === 0" class="bold"></td>
                    <td>organization</td><td class="bold">{{user.organisation}}</td>
                  </tr>
                  <tr>
                    <td width="25%">organization Website</td><td class="bold" colspan="3">{{user.organisationWebsite}}</td>
                  </tr>
                  <!--<tr>-->
                    <!--<td width="25%">Website</td><td class="bold" colspan="3">{{user.website}}</td>-->
                  <!--</tr>-->
                  </thead>

                </table>

                <div class="input-group mb-3 justify-center">
                  <div class="col-md-6 flex justify-center">
                    <button  v-on:click="showButton()"  class="btn btn-block btn-success custom-btn">Edit Profile</button>
                    <b-btn  v-b-modal.modal1 v-bind:class="[classOfResetButton]" class="custom-btn">Reset Password</b-btn>
                  </div>
                </div>
              </div>
              <b-modal id="modal1" ref="modal" title="Reset Password" centered lazy header-bg-variant="primary" @ok="handleOk">
                <b-form id="ResetForm"  @submit.stop.prevent="updatePassword" novalidate>
                  <b-form-group id="ResetFormGroup" label="New Password:">
                    <b-form-input type="password" id="newPassword"  placeholder="Enter New Password" v-model="user.password" required></b-form-input>
                    <b-form-invalid-feedback>Please Enter new Password.</b-form-invalid-feedback>
                  </b-form-group>
                  <b-form-group id="resetFormGroup" label="Confirm Password:">
                    <b-form-input type="password" id="confirmPassword" placeholder="Enter Confirm Password"  v-model="user.repeatPassword"  required></b-form-input>
                    <b-form-invalid-feedback>Please confirm the password</b-form-invalid-feedback>
                  </b-form-group>
                </b-form>
              </b-modal>

              <form id="app" v-if="editProfile" @submit.prevent="updateUserProfile()">
                <h1 class="text-center">Edit Profile</h1>

                <img :src="avatar" class="img-avatar-profile" alt="admin@hpssec.com">

                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text">First name</span>
                  </div>
                  <input type="text" class="form-control" placeholder="First name" title="Must have atleast one character" pattern="[a-zA-Z].{1,25}" v-model="user.firstName" required autofocus>
                  <div class="input-group-prepend">
                    <span class="input-group-text">Last name</span>
                  </div>
                  <input type="text" class="form-control" placeholder="Last name" title="Must have atleast one character" pattern="[a-zA-Z].{1,25}" v-model="user.lastName" required>
                </div>

                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text"><i class="icon-user"></i></span>
                  </div>
                  <input type="text" class="form-control" placeholder="Username" title="Must contain between 5 to 12 characters and no special characters allowed" pattern="[a-zA-Z0-9_.-]{5,25}"  v-model="user.username" required>
                  <div class="input-group-prepend">
                    <span class="input-group-text">@</span>
                  </div>
                  <input type="email" class="form-control" placeholder="Email" v-model="user.email" required>
                </div>

                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text">organization</span>
                  </div>
                  <input type="text" class="form-control" placeholder="organization" title="Must have atleast one character" pattern="[a-zA-Z].{1,25}" v-model="user.organisation" required>
                </div>

                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text">organization Website</span>
                  </div>
                  <input type="text" class="form-control" placeholder="organization Website" title="Please enter the website URL"  pattern="[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)" v-model="user.organisationWebsite" required>
                </div>
                <!--<div class="input-group mb-3">-->
                  <!--<div class="input-group-prepend">-->
                    <!--<span class="input-group-text">Website</span>-->
                  <!--</div>-->
                  <!--<input type="text" class="form-control" placeholder="Website" title="Please enter the website URL"  pattern="[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)" v-model="user.website" required>-->
                <!--</div>-->
                <div class="input-group mb-3 col-md-6 padding-0">
                  <b-form-file class="file-input-label" ref="fileInput" v-model="file" placeholder="Choose a file...">
                  </b-form-file>
                  <b-button variant="primary" @click="uploadAvatar(file)">Upload
                  </b-button>
                </div>

                <div class="input-group mb-3">
                  <b-form-checkbox
                    v-model="user.mfa"
                    value="enable"
                    unchecked-value="disable"
                  >
                    Enable/Diable MFA
                  </b-form-checkbox>
                </div>

                <div class="input-group mb-3 justify-center">
                  <div class="col-md-6 flex justify-center">
                    <button type="submit" class="btn btn-block btn-success custom-btn">Update Account</button>
                    <button type="button"  v-on:click="cancelEditProfile()" class="btn btn-block btn-success custom-btn">Cancel</button>
                  </div>
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
        error: '',
        success: '',
        validationError: '',
        avatar: '',
        user: {
          id: '',
          username: '',
          firstName: '',
          lastName: '',
          email: '',
          password: ' ',
          repeatPassword: '',
          organisation: '',
          organisationWebsite: '',
          jobTitle: '',
          website: '',
          mfa: ''
        },
        editProfile: false,
        show: true,
        showProfileText: true,
        classOfResetButton: 'btn btn-block btn-success',
        file: null
      }
    },

    methods: {
      updatePasswordFromProfilePage () {
        if (this.user.password !== this.user.repeatPassword) {
          this.handleError({message: 'Passwords do not match'})
        } else {
          this.$store.dispatch('updatePasswordFromProfilePage', {userId: this.user._id, user: this.user, password: this.user.password})
            .then((data) => {
              // this.success = 'Your Password is updated'
              this.$toastr.s('Your Password is updated')
              this.$refs['modal'].hide()
            })
            .catch((err) => {
              this.handleError(err)
            })
        }
      },
      getUserProfile () {
        this.$store.dispatch('getProfile')
          .then((response) => {
            this.user = response.user
            this.avatar = this.getAvatar(this.user.avatar)
          })
          .catch((err) => {
            this.handleError(err)
          })
      },
      updateUserProfile () {
        this.$toastr.defaultTimeout = 1000
        // if ((this.user.website !== '' && /^(http|https):\/\/[^ "]+$/.test(this.user.website) === false) || (this.user.organisationWebsite !== '' && /^(http|https):\/\/[^ "]+$/.test(this.user.organisationWebsite) === false)) {
        //   this.$toastr.e('Invalid URL!')
        // } else {
        //
        // }
        this.$store.dispatch('updateProfile', this.user)
          .then((data) => {
            this.editProfile = false
            this.show = true
            this.$toastr.s('Your profile is updated successfully.')
          })
          .catch((err) => {
            this.$toastr.e(err.message)
            this.handleError(err)
          })
      },
      showButton () {
        this.show = false
        this.editProfile = true
        this.showProfileText = false
      },
      cancelEditProfile () {
        this.show = true
        this.editProfile = false
        this.showProfileText = true
      },
      handleOk (event) {
        event.preventDefault()
        const form = document.getElementById('ResetForm')
        if (!form.checkValidity()) {
          event.preventDefault()
          form.classList.add('was-validated')
        } else {
          this.updatePasswordFromProfilePage()
        }
      },
      handleError (err) {
        if (err.message === 'Unauthorized') {
          this.$router.push('/login')
        } else {
          this.error = err.message
        }
      },
      uploadAvatar (doc) {
        this.$toastr.defaultTimeout = 500000
        let types = ['png', 'jpg', 'jpeg']
        let indx = doc.name.lastIndexOf('.')
        let fileType = doc.name.slice(indx + 1)
        let AcceptedFile = types.find((ele) => {
          return ele === fileType
        })
        if (doc.size < 26214400 && AcceptedFile) {
          this.$toastr.i('Uploading profile picture....')
          this.$store.dispatch('uploadAvatar', { files: doc })
            .then(response => {
              this.avatar = response.avatar
              this.$store.dispatch('setAvatar', this.avatar)
              this.$toastr.clearAll()
              this.$toastr.defaultTimeout = 5000
              this.$toastr.s('profile image have been uploaded successfully')
            })
            .catch(err => {
              console.log(err)
              this.$toastr.clearAll()
              this.$toastr.defaultTimeout = 5000
              this.$toastr.e('Error, please try again')
            })
        } else if (doc.size > 26214400) {
          this.$toastr.e('Error, file excedded limit')
        } else {
          this.$toastr.e('Error, accepted files are only docx, xlsx, pptx, xls and txt')
        }
      },
      getAvatar (avatar) {
        if (avatar) return avatar
        return 'https://jasavatar.s3.us-east-2.amazonaws.com/avatar-placeholder.png'
      }
    },
    mounted () {
      this.getUserProfile()
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
