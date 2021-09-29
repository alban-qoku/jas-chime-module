<template>
  <div class="app profile align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-10" style="margin-top: 100px">
          <div class="card mx-4">
            <div class="card-body p-4">
              <div class="alert alert-success" v-if="success">
                <strong>
                  <i class="fa fa-warning"></i>
                </strong>
                {{ success }}
              </div>
              <div class="alert alert-danger" v-if="error">
                <strong>
                  <i class="fa fa-warning"></i> ERROR:
                </strong>
                {{ error }}
              </div>
              <h5 class="text-center">To accept promotion, click on accept button</h5>
              <br />

              <div class="card-detail-form">
                <button  class="my-button" v-on:click="acceptPromotionInvitation()">Accept Promotion</button>
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
  data: function () {
    return {
      success: false,
      error: false
    }
  },
  mounted: function () {
  },
  methods: {
    acceptPromotionInvitation: function () {
      if (this.$route.query.token) {
        let token = this.$route.query.token
        this.$store.dispatch('acceptPromotionInvitation', token)
          .then((res) => {
            console.log('response: ', res)
            if (res.result) {
              this.success = ' Invitation Accepted Successfully'
              this.error = false
              this.$router.push('/')
            } else {
              this.error = ' Some error, may be you have already accepted the promotion Or try again'
              this.success = false
            }
          })
          .catch((err) => {
            this.handleError(err)
          })
      } else {
        this.error = ' Some error, <br>may be you have already accepted the invitation Or try again'
        this.success = false
      }
    }
  }
}
</script>

<style>
.my-class {
  max-width: 600px;
  background: #fafafafa;
  margin-top: 40px;
  padding: 10px 20px;
  box-sizing: border-box;
  box-shadow: 0px 1px 5px 0px #b9b8b8;
}
.my-button {
  margin-top: 20px;
  background: #2a363d;
  line-height: 30px;
  padding: 0px 10px;
  text-align: center;
  color: #fff;
}
.card-detail-invite{
  background:#fff;
}
</style>