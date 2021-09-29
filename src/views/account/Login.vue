<template>
  <div class="app flex-row align-items-center" id="loginView">
    <div class="container">
      <div class="row justify-content-center init-div">
        <div class="col-md-7 col-sm-10">
          <div class="card p-4 col-md-12 col-sm-12 col-xs-12 init-div">
            <div class="card-body">
              <div class="row justify-content-center">
                <img src="static/img/JAS_Full_Logo.svg" class="logo-img" />
              </div>
              <div class="alert alert-danger mt-2" v-if="error">
                <strong><i class="fa fa-warning"></i> LOGIN ERROR:</strong> {{ error }}
              </div>
              <div class="alert alert-danger mt-2" v-if="passwordTimes === 0">
                <strong><i class="fa fa-warning"></i> LOGIN ERROR:</strong> Too many failed attempts. Please click <button class="btn btn-signin" v-on:click="$router.push('/passwordReset')">Forgot Password</button> to continue.
              </div>
              <b-alert show dismissible variant="success" class="text-center mt-2" v-if="created">
                <strong><i class="fa fa-warning"></i> Success:</strong> Your user account has been created. Please log in to continue.
              </b-alert>
              <b-alert show dismissible variant="success" class="text-center mt-2" v-if="reset">
                <strong><i class="fa fa-warning"></i> Success:</strong> Your password has been updated.
              </b-alert>
              <form @submit.prevent="login(creds)" v-if="step === 0">
                <p class="text-muted text-center">Login to your account or register below</p>
                <div class="input-group mb-4">
                  <div class="input-group-prepend">
                    <span class="input-group-text"><i class="icon-user"></i></span>
                  </div>
                  <input type="text" ref="username" class="form-control" placeholder="Username" v-model="creds.username" requried autofocus>
                </div>
                <div class="input-group mb-4">
                  <div class="input-group-prepend">
                    <span class="input-group-text"><i class="icon-lock"></i></span>
                  </div>
                  <input type="password" class="form-control" placeholder="Password" v-model="creds.password" required>
                </div>
                <div class="row init-div">
                  <div class="col-md-12 col-sm-12 col-xs-12 init-div">
                    <button type="submit" id="login-btn" class="btn btn-primary px-4">Login</button>
                    <button type="button" class="btn btn-primary ml-2" v-on:click="$router.push('/passwordReset')">Forgot Password?</button>
                  </div>
                </div>
                <div class="row init-div mt-3">
                  <div class="col-md-12 col-sm-12 oAuth-content init-div">
                    <div class="row init-div">
                      <GoogleLogin :params="params" :onSuccess="onSuccess" :onFailure="onFailure">
                        <b-btn id="google-signin-button" type="button" class="social-btn">
                          <span class="social-sign-content">
                            <span class="social-btn-content">
                              <img src="https://aid-frontend.prod.atl-paas.net/atlassian-id/front-end/5.0.93/static/media/google-logo.c21ca9d1.svg" alt="" style="height: 18px; margin-right: 8px; width: 18px;">
                              <span>Continue with Google</span>
                            </span>
                          </span>
                        </b-btn>
                      </GoogleLogin>
                      <b-btn id="microsoft-signin-button" type="button" class="social-btn mt-3" @click="loginWithMSAL">
                        <span class="social-sign-content">
                          <span class="social-btn-content">
                            <img src="https://aid-frontend.prod.atl-paas.net/atlassian-id/front-end/5.0.93/static/media/microsoft-logo.319d9b9a.svg" alt="" style="height: 18px; margin-right: 8px; width: 18px;">
                            <span>Continue with Microsoft</span>
                          </span>
                        </span>
                      </b-btn>
                    </div>
                  </div>
                </div>
              </form>
              <form v-else-if="step === 1" >
                <VuePhoneNumberInput class="mt-4" v-model="mobileNumber" requried @update="updatePhoneNumber"/>
                <div class="row init-div">
                  <div class="col-md-12 col-sm-12 col-xs-12 init-div">
                    <button :onclick="phoneVerification()" type="button" class="btn btn-primary px-4 mt-3 full-width">Send Code</button>
                  </div>
                </div>
              </form>
              <form @submit.prevent="verifyCode()" v-else-if="step === 2" >
                <div class="alert alert-danger mt-2" v-if="phoneVerificationError">
                  <strong><i class="fa fa-warning"></i> Failed:</strong> {{ phoneVerificationError }}
                </div>
                <div class="input-group mt-4">
                  <input type="text" ref="verificationCode" class="form-control" placeholder="6-digit number" v-model="credsforVerification.verificationCode" requried autofocus>
                </div>
                <div class="row init-div">
                  <div class="col-md-12 col-sm-12 col-xs-12 init-div">
                    <button type="submit" class="btn btn-primary px-4 mt-3 full-width">Verify</button>
                  </div>
                </div>
              </form>

            </div>

          </div>
        </div>
      </div>
      <div class="row justify-content-center init-div" v-if="step == 0">
        <div class="col-md-7 col-sm-10">
          <div class="card text-white bg-primary col-md-12 col-sm-12 col-xs-12 init-div">
            <div class="card-body text-center">
              <div>
                <h4>Don't have an account?</h4>
                <button type="button" class="btn btn-primary active mt-3" v-on:click="$router.push('/register')">Registration</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css">
  .logo-img{
    width: 100%
  }
  .padding-0{
    padding-left: 0px;
  }
</style>

<script>
  import GoogleLogin from 'vue-google-login'
  import AuthService from './auth.service'
  import VuePhoneNumberInput from 'vue-phone-number-input'
  import 'vue-phone-number-input/dist/vue-phone-number-input.css'

  export default {
    name: 'Login',
    components: {GoogleLogin, VuePhoneNumberInput},
    created () {
      this.authService = new AuthService()
      console.log(this.authService)
    },
    mounted () {
      document.getElementsByTagName('button')[2].type = 'button'
    },
    data: function () {
      return {
        error: '',
        created: Boolean(this.$route.query.created),
        reset: Boolean(this.$route.query.reset),
        passwordTimes: 3,
        user: {
          username: '',
          firstName: '',
          lastName: '',
          email: '',
          password: ''
        },
        creds: {
          username: '',
          password: ''
        },
        params: {
          client_id: '1039180775371-tbq6vc7rrafcnr2hkk2ldrae2ea4d5sd.apps.googleusercontent.com'
        },
        credsforphone: {
          username: '',
          password: '',
          mobileNumber: ''
        },
        credsforVerification: {
          username: '',
          password: '',
          verificationCode: ''
        },
        mobileNumber: '',
        verificationCode: '',
        phoneVerificationError: '',
        step: 0,
        price: []
      }
    },
    methods: {
      login () {
        this.$store.dispatch('login', this.creds)
          .then((response) => {
            if (response.statusCode === 200) {
              if (response.mfa === 'enable') {
                console.log('success')
                this.credsforphone.username = this.creds.username
                this.credsforphone.password = this.creds.password
                this.step = 1
              } else {
                this.$store.dispatch('saveSession', response)
                this.$store.dispatch('getPrice')
                  .then((response) => {
                    this.price = response[0]
                    console.log(this.price)
                    this.$store.dispatch('setPrice', this.price)
                  })
                  .catch((err) => {
                    this.price = []
                    this.error = err.message
                  })
                if (this.$store.state.user.permissions.includes('admin')) {
                  this.$router.push('/jas-admin/users')
                } else {
                  this.$router.push('/')
                }
              }
            } else {
              this.step = 0
              this.error = response.message
            }
          })
          .catch((err) => {
            this.step = 0
            this.creds.username = ''
            this.creds.password = ''
            this.passwordTimes = this.passwordTimes - 1
            if (this.passwordTimes === 0) {
              this.error = ''
              setTimeout(function () {
                this.$router.push('/passwordReset')
              }, 3000)
            } else {
              this.error = err.message
            }
            this.$refs.username.focus()
          })
      },
      onSuccess (googleUser) {
        console.log('google user: ', googleUser.getBasicProfile())
        this.user.firstName = (googleUser.getBasicProfile().ofa ? googleUser.getBasicProfile().ofa : googleUser.getBasicProfile().vW) ? googleUser.getBasicProfile().ofa ? googleUser.getBasicProfile().ofa : googleUser.getBasicProfile().vW : googleUser.getBasicProfile().pW
        this.user.lastName = (googleUser.getBasicProfile().wea ? googleUser.getBasicProfile().wea : googleUser.getBasicProfile().wU) ? (googleUser.getBasicProfile().wea ? googleUser.getBasicProfile().wea : googleUser.getBasicProfile().wU) : googleUser.getBasicProfile().qU
        this.user.username = this.user.firstName.toLowerCase() + this.user.lastName.toLowerCase()
        this.user.email = (googleUser.getBasicProfile().U3 ? googleUser.getBasicProfile().U3 : googleUser.getBasicProfile().zu) ? (googleUser.getBasicProfile().U3 ? googleUser.getBasicProfile().U3 : googleUser.getBasicProfile().zu) : googleUser.getBasicProfile().yu
        var current = new Date()
        var currentTime = current.getHours() + ':' + current.getMinutes() + ':' + current.getSeconds()
        this.user.password = currentTime

        this.$store.dispatch('registerSocial', this.user)
          .then((res) => {
            this.creds = {
              username: res.result.username,
              password: res.result.registerTime
            }
            this.$store.dispatch('login', this.creds)
              .then((response) => {
                if (response.statusCode === 200) {
                  if (response.mfa === 'enable') {
                    console.log('success')
                    this.credsforphone.username = this.creds.username
                    this.credsforphone.password = this.creds.password
                    this.step = 1
                  } else {
                    this.$store.dispatch('saveSession', response)
                    this.$router.push('/')
                  }
                } else {
                  this.step = 0
                  this.error = response.message
                }
              })
              .catch((err) => {
                this.handleError(err)
              })
          })
          .catch((err) => {
            this.handleError(err)
          })
      },
      onFailure (error) {
        console.log('signin error: ', error)
      },
      loginWithMSAL () {
        this.authService.login().then(
          user => {
            console.log('user: ', user)
            if (user) {
              this.user.email = user.displayableId
              var x = user.name.split(' ')
              this.user.firstName = x[0]
              this.user.lastName = x[1] ? x[1] : ''
              this.user.username = this.user.firstName.toLowerCase() + this.user.lastName.toLowerCase()
              var current = new Date()
              var currentTime = current.getHours() + ':' + current.getMinutes() + ':' + current.getSeconds()
              this.user.password = currentTime

              this.$store.dispatch('registerSocial', this.user)
                .then((res) => {
                  this.creds = {
                    username: res.result.username,
                    password: res.result.registerTime
                  }
                  console.log('credential: ', this.creds.username, this.creds.password)
                  this.$store.dispatch('login', this.creds)
                    .then((response) => {
                      if (response.statusCode === 200) {
                        console.log('success')
                        this.credsforphone.username = this.creds.username
                        this.credsforphone.password = this.creds.password
                        this.step = 1
                      } else {
                        this.step = 0
                        this.error = response.message
                      }
                    })
                    .catch((err) => {
                      this.handleError(err)
                    })
                })
                .catch((err) => {
                  this.handleError(err)
                })
            } else {
              console.log('status: ', 'fail')
            }
          },
          () => {
            console.log('status: ', '---fail')
          }
        )
      },
      phoneVerification () {
        this.$store.dispatch('phoneVerification', this.credsforphone)
          .then((response) => {
            console.log('response: ', response)
            if (response.statusCode === 200) {
              console.log('sms sent')
              this.credsforVerification.username = this.creds.username
              this.credsforVerification.password = this.creds.password
              this.step = 2
            } else {
              this.step = 1
              this.error = response.message.message
            }
          })
          .catch((err) => {
            console.log('Err: ', err.message.statusCode, err.message.message)
            this.step = 1
            this.error = err.message.message
          })
      },
      verifyCode () {
        this.$store.dispatch('verifyCode', this.credsforVerification)
          .then((response) => {
            if (response.statusCode === 200) {
              this.$store.dispatch('saveSession', response)
              this.$router.push('/')
            } else {
              this.phoneVerificationError = 'Phone Verification is failed!'
              this.credsforVerification.verificationCode = ''
            }
          })
          .catch((err) => {
            this.handleError(err)
          })
      },
      handleError (err) {
        this.error = err.message
      },
      updatePhoneNumber (result) {
        this.credsforphone.mobileNumber = result.formatInternational
      }
    }
  }
</script>
<style lang="css">
  .social-btn{
    -webkit-box-align: baseline;
    align-items: baseline;
    box-sizing: border-box;
    display: inline-flex;
    font-size: inherit;
    font-style: normal;
    max-width: 100%;
    text-align: center;
    white-space: nowrap;
    cursor: default;
    vertical-align: middle;
    width: 100%;
    font-weight: bold;
    color: rgb(80, 95, 121) !important;
    height: 40px !important;
    line-height: 40px !important;
    box-shadow: rgba(0, 0, 0, 0.2) 1px 1px 5px 0px !important;
    border-width: 0px;
    text-decoration: none;
    border-radius: 3px;
    padding: 0px 8px;
    transition: background 0.1s ease-out 0s, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s;
    outline: none !important;
    background: rgb(255, 255, 255) !important;
  }
  .social-sign-content{
    -webkit-box-pack: center;
    justify-content: center;
    display: flex !important;
    align-self: center;
    display: inline-flex;
    flex-wrap: nowrap;
    max-width: 100%;
    position: relative;
    width: 100%;
    -webkit-box-pack: center;
    justify-content: center;
  }
  .social-btn-content{
    display: flex;
    align-items: center;
  }
  .oAuth-content{
    padding-left: 0px;
    padding-right: 0px;
  }
  .oAuth-content button{
    width: 100%;
    background: transparent;
    border: 0px;
    padding: 0px;
  }
  .btn-signin, .btn-signin:focus, .btn-signin:hover, .btn-signin:active{
    background: transparent;
    padding: 0px;
    border: none;
    box-shadow: none;
    color: #6971d6;
  }
</style>
