<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-sm-12">
          <div class="card mx-4">
            <div class="card-body p-4">
              <div class="alert alert-danger" v-if="error">
                <strong><i class="fa fa-warning"></i> Registration ERROR:</strong> {{ error }}
              </div>
              <form id="app" @submit.prevent="register">
                <h1 class="text-center">Register</h1>
                <div class="text-center mb-lg-5 mb-md-5 mb-sm-5 mb-xs-5 custom-lbl-div">
                  <span class="lbl-exsiting-user">Exsiting User?</span>
                  <b-btn type="button" class="btn btn-signin" @click="handleClickSignIn()">Sign In</b-btn>
                </div>
                <div class="row init-div">
                  <div class="col-md-12 col-sm-12">
                    <div class="input-group mb-3">
                      <label class="col-md-4 col-sm-4 text-right">First Name <span class="require">*</span></label>
                      <div class="col-md-8 col-sm-8 init-div">
                        <input type="text" class="form-control custom-input" placeholder="First name" title="Must have atleast one character" pattern="[a-zA-Z].{1,25}" v-model="user.firstName" required autofocus>
                      </div>
                    </div>
                    <div class="input-group mb-3">
                      <label class="col-md-4 col-sm-4 text-right">Last name <span class="require">*</span></label>
                      <div class="col-md-8 col-sm-8 init-div">
                        <input type="text" class="form-control custom-input" placeholder="Last name" title="Must have atleast one character" pattern="[a-zA-Z].{1,25}" v-model="user.lastName" required>
                      </div>
                    </div>
                    <div class="input-group mb-3">
                      <label class="col-md-4 col-sm-4 text-right">Username <span class="require">*</span></label>
                      <div class="col-md-8 col-sm-8 init-div">
                        <input type="text" class="form-control custom-input" placeholder="Username" title="Must contain between 5 to 12 characters and no special characters allowed" pattern="[a-zA-Z0-9_.-]{5,25}"  v-model="user.username" required>
                      </div>
                    </div>
                    <div class="input-group mb-3">
                      <label class="col-md-4 col-sm-4 text-right">Company Name <span class="require">*</span></label>
                      <div class="col-md-8 col-sm-8 init-div">
                        <input type="text" class="form-control custom-input" placeholder="Company Name" title="Must contain between 5 to 50 characters and no special characters allowed" pattern="[a-zA-Z0-9_.- ]{5,50}"  v-model="user.organisation" required>
                      </div>
                    </div>
                    <div class="input-group mb-3">
                      <label class="col-md-4 col-sm-4 text-right">Company Website <span class="require">*</span></label>
                      <div class="col-md-8 col-sm-8 init-div">
                        <input type="text" class="form-control custom-input" placeholder="Company Website" title="This url not valid" pattern="[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)"  v-model="user.organisationWebsite" required>
                      </div>
                    </div>
                    <!--<div class="input-group mb-3">-->
                      <!--<label class="col-md-4 col-sm-4 text-right">Select Plan <span class="require">*</span></label>-->
                      <!--<div class="col-md-8 col-sm-8 init-div">-->
                        <!--<select class="form-control custom-input" v-model="user.planInfo" required>-->
                          <!--<option value="" hidden selected>Select Plan</option>-->
                          <!--<option v-for="(item, index) in myPlanList" :key="index" v-bind:value="item.id">{{item.businessType}} {{item.currency}} ({{item.planPrice}} / Per Month) {{item.trialPeriad}} {{item.creditCard}}</option>-->
                        <!--</select>-->
                      <!--</div>-->
                    <!--</div>-->
                    <!-- <div class="input-group mb-3">
                      <label class="col-md-4 col-sm-4 text-right">Mobile No. <span class="require">*</span></label>
                      <div class="col-md-8 col-sm-8 init-div">
                        <input type="text" class="form-control custom-input" placeholder="Phone" title="Must contain only numbers" pattern="^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{9})$"  v-model="user.mobileNo" required>
                      </div>
                    </div> -->
                    <!-- +[0-9]?()[0-9](\s|\S)(\d[0-9]{9} -->
                    <div class="input-group mb-3">
                      <label class="col-md-4 col-sm-4 text-right">Work Email <span class="require">*</span></label>
                      <div class="col-md-8 col-sm-8 init-div" v-if="isInvited">
                        <input type="email" class="form-control custom-input" placeholder="Email"  v-bind:value="user.email" required :disabled='isDisabled' >
                      </div>
                      <div class="col-md-8 col-sm-8 init-div" v-if="!isInvited" >
                        <input type="email" class="form-control custom-input" placeholder="Email" v-model="user.email" required>
                      </div>
                    </div>

                    <div class="input-group mb-3">
                      <label class="col-md-4 col-sm-4 text-right">Password <span class="require">*</span></label>
                      <div class="col-md-8 col-sm-8 init-div">
                        <input type="password" class="form-control custom-input" placeholder="Password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" id="password" v-model="user.password" required>
                      </div>
                    </div>
                    <div class="input-group mb-3">
                      <label class="col-md-4 col-sm-4 text-right">Confirm Password <span class="require">*</span></label>
                      <div class="col-md-8 col-sm-8 init-div">
                        <input type="password" class="form-control custom-input" placeholder="Repeat password" id="confirm_password" v-model="user.repeatPassword" required>
                      </div>
                    </div>
                    <!-- <div class="input-group mb-3">
                      <label class="col-md-4 col-sm-4 text-right">Address <span class="require">*</span></label>
                      <div class="col-md-8 col-sm-8 init-div">
                        <textarea v-model="user.address" class="form-control custom-input" placeholder="Address" required></textarea>
                      </div>
                    </div> -->
<!--                    <div class="divider mt-3 mb-2"></div>-->
<!--                    <div class="input-group">-->
<!--                      <label class="col-md-4 col-sm-4">Security Check</label>-->
<!--                    </div>-->
<!--                    <div class="divider mt-1 mb-2"></div>-->
                    <div class="row init-div">
                      <div class="col-md-4 col-sm-4">
                      </div>
                      <div class="col-md-8 col-sm-8 init-div">
                        <b-form-checkbox id="checkbox-1" v-model="agreeStatus" name="checkbox-1" value="accepted" unchecked-value="not_accepted">I agree to the Terms of Use </b-form-checkbox>
                        <button type="submit" class="btn btn-block btn-success mt-3 col-md-6 col-sm-6">Create Account</button>
                      </div>
                    </div>
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
  import { planList } from '../../mock/mock'
  export default {
    name: 'Register',
    data: function () {
      return {
        error: '',
        user: {
          username: '',
          firstName: '',
          lastName: '',
          email: '',
          organisation: '',
          organisationWebsite: '',
          password: '',
          repeatPassword: '',
          role: 'subscriber',
          invitedBy: '',
          planInfo: '',
          token: ''
        },
        isInvited: false,
        userData: null,
        agreeStatus: 'not_accepted',
        myPlanList: []
      }
    },
    mounted: function () {
      this.getUserRole()
      this.myPlanList = planList
    },
    methods: {
      register () {
        // console.log('register data is:::::', this.user)
        // Ensure that passwords match
        if (this.user.password !== this.user.repeatPassword) {
          this.handleError({message: 'Passwords do not match'})
        } else {
          this.$store.dispatch('register', this.user)
            .then((res) => {
              this.$router.push('/login?created=true')
            })
            .catch((err) => {
              this.handleError(err)
            })
        }
      },
      // Generic error handling function
      handleError (err) {
        this.error = err.message
      },
      handleClickSignIn () {
        this.$router.push('/login')
      },
      getUserRole () {
        if (this.$route.query.token) {
          let token = this.$route.query.token
          this.$store.dispatch('getInviteEmail', token)
            .then((res) => {
              if (res.result.length > 0) {
                this.isInvited = true
                this.user.email = res.result[0].email
                this.user.role = 'invitee'
                this.user.invitedBy = res.result[0].sender
                this.user.token = token
              }
            })
            .catch((err) => {
              this.handleError(err)
            })
        }
      },
      isDisabled () {
        return this.isInvited
      }
    }
  }
</script>
<style>
  .btn-signin, .btn-signin:focus, .btn-signin:hover, .btn-signin:active{
    background: transparent;
    padding: 0px;
    border: none;
    box-shadow: none;
    color: #6971d6;
  }
  .lbl-exsiting-user{
    margin-right: 10px;
  }
  .custom-lbl-div{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 3rem !important;
  }
  .form-control.custom-input{
    width: 100%
  }
  .col-md-4.text-right{
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .col-md-4.text-right .require{
    margin-left: 10px;
    color: #dc3636;
    margin-top: 6px;
  }
  .divider{
    height: 2px;
    width: 100%;
    background: #f7f3f3;
  }
  .row.init-div > button {
    width: 100%;
    background: transparent;
    border: none;
    padding: 0px;
  }
</style>
