<template>
    <div class="app flex-row" id="loginView">
      <div class="row init-div custom-content">
        <div class="col-md-12">
          <div class="alert alert-danger" v-if="error">
            <strong>Verify Failed:</strong> {{ error }}
          </div>
          <div class="alert alert-success" v-else-if="info">
            <strong>Successfully Verified:</strong> {{ info }}
          </div>
          <b-row class="justify-content-center" v-else>
            <h1><i class="fa fa-spinner fa-pulse fa-3x text-primary"></i></h1>
          </b-row>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'Verify',
    mounted () {
      this.verify()
    },
    data: function () {
      return {
        info: '',
        error: ''
      }
    },
    methods: {
      verify () {
        this.$store.dispatch('verify', { token: String(this.$route.query.id_token) })
          .then((response) => { this.info = response.message })
          .catch((err) => {
            this.error = err.message
            console.error(err)
          })
      }
    }
  }
</script>

<style lang="css">
  .custom-content{
    margin-top: 20px;
    width: 100%;
    text-align: center;
  }
</style>
