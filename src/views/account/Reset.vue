<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card mx-4">
            <div class="card-body p-4">
                <div class="alert alert-danger" v-if="error">
                  <strong><i class="fa fa-warning"></i> Registration ERROR:</strong> {{ error }}
                </div>
              <form id="app" @submit.prevent="resetPassword">
              <h1 class="text-center">Reset Password</h1>
              <p class="text-center">Reset Password</p>
              <div class="input-group mb-3">
                <span class="input-group-addon"><i class="icon-lock"></i></span>
                <input type="password" class="form-control" placeholder="New Password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" id="password" v-model="user.password" required>
              </div>

              <div class="input-group mb-4">
                <span class="input-group-addon"><i class="icon-lock"></i></span>
                <input type="password" class="form-control" placeholder="Confirm password" id="confirm_password" v-model="user.repeatPassword" requried>
              </div>
                <input type="submit" class="btn btn-block btn-success"/>
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
  name: 'Register',
  data: function () {
    return {
      error: '',
      user: {
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repeatPassword: '',
        token: this.$route.query.id_token
      }
    }
  },

  methods: {
    resetPassword () {
      if (this.user.password !== this.user.repeatPassword) {
        this.handleError({message: 'Passwords do not match'})
      } else {
        this.$store.dispatch('resetPassword', this.user)
          .then(() => this.$router.push('/login?reset=true'))
          .catch((err) => {
            this.handleError(err)
          })
      }
    },
    // Generic error handling function
    handleError (err) {
      this.error = err.message
    }
  }
}
</script>
