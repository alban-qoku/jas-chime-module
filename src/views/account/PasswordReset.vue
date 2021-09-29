<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card mx-4">
            <div class="card-body p-4">

              <div class="alert alert-danger" v-if="error">
                <strong><i class="fa fa-warning"></i></strong> {{ error }}
              </div>
              <div class="row init-div">
                <div class="col-md-12 col-sm-12" v-if="isSent === 0">
                  <form id="app" @submit.prevent="forgotPassword">
                    <h1 class="text-center">Forgot Password?</h1>
                    <p class="text-center">Enter Email address</p>
                    <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        <span class="input-group-text">@</span>
                      </div>
                      <input type="email" class="form-control" placeholder="Email" v-model="user.email" required>
                    </div>
                    <input type="submit" class="btn btn-block btn-success"/>
                  </form>
                </div>
                <b-row v-else-if="isSent === 1" class="justify-content-center full-width init-div">
                  <h1><i class="fa fa-spinner fa-pulse fa-3x text-primary"></i></h1>
                </b-row>
                <div class="col-md-12 col-sm-12 text-center" v-else>
                  <h1 class="text-center">Sent Email</h1>
                  <div class="text-center email-sent-description">
                    Please check your email.<br/>
                    You will be able to see the reset url.
                  </div>
                  <button type="button" class="btn btn-primary mt-3 btn-reset-signin" @click="handleClickSignIn()">Sign In</button>
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
  export default {
    name: 'PasswordReset',
    data: function () {
      return {
        error: '',
        isSent: 0,
        user: {
          username: '',
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          repeatPassword: ''
        }
      }
    },

    methods:
      {
        forgotPassword () {
          this.isSent = 1
          this.$store.dispatch('forgotPassword', this.user)
            .then((data) => {
              this.isSent = 2
              // this.$router.push('/#/login')
            })
            .catch((err) => {
              this.handleError(err)
            })
        },
        // Generic error handling function
        handleError (err) {
          this.user.username = ''
          this.user.firstName = ''
          this.user.lastName = ''
          this.user.email = ''
          this.user.password = ''
          this.user.repeatPassword = ''
          this.error = err.message
        },
        handleClickSignIn () {
          console.log('clicked signin btn')
          this.$router.push('/login')
        }
      }
  }
</script>
<style>
  .email-sent-description{
    font-weight: 600;
    font-size: 15px;
  }
  .btn-reset-signin{
    width: 100%;
  }
  .full-width{
    width: 100%;
  }
</style>
