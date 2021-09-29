<template>
  <footer class="app-footer">
    <div>
      <div class="text-right w-100">
        <a href="https://jascorp.io">Justified Assessment Solution</a> &copy; 2020 JAS Corp
      </div>
      <b-modal v-model="$store.state.bShowTrialModal" lazy centered header-bg-variant="danger" :hide-footer="showModalFooter" no-close-on-backdrop no-close-on-esc id="disclaimerModal" title="Contact to JAS support team.">
        <p v-if="$store.state.user.trialRemainingDays > 1">Your trial expires in <span style="color: red;">{{ $store.state.user.trialRemainingDays }}</span> days.</p>
        <p v-if="$store.state.user.trialRemainingDays === 1">Your trial expires in <span style="color: red;">{{ $store.state.user.trialRemainingDays }}</span> day.</p>
        <p v-if="$store.state.user.trialRemainingDays === 0">Your trial date is the last date.</p>
        <p v-if="$store.state.user.trialRemainingDays < 0" style="color: red;">TRIAL PERIOD EXPIRED</p>
        <p v-if="($store.state.user.trialRemainingDays >= 0) && (this.$store.state.user.trialDetails.askExtendingExpireDates.countAsking === 0)">We’d love to keep you as a customer. </p>
        <p v-if="($store.state.user.trialRemainingDays >= 0) && (this.$store.state.user.trialDetails.askExtendingExpireDates.countAsking === 0)">Please upgrade to a paid subscription before your trial expires to</p>
        <p v-if="($store.state.user.trialRemainingDays >= 0) && (this.$store.state.user.trialDetails.askExtendingExpireDates.countAsking === 0)">prevent from losing access to your assessments. </p>
        <p v-if="($store.state.user.trialRemainingDays >= 0) && (this.$store.state.user.trialDetails.askExtendingExpireDates.countAsking === 0)">You have 30 days after your trial expiration to subscribe. After that, </p>
        <p v-if="($store.state.user.trialRemainingDays >= 0) && (this.$store.state.user.trialDetails.askExtendingExpireDates.countAsking === 0)">your account is locked and your data is deleted.</p>
        <p v-if="($store.state.user.trialRemainingDays >= 0) && (this.$store.state.user.trialDetails.askExtendingExpireDates.countAsking === 1)">You have to upgrade membership because you have already used the</p>
        <p v-if="($store.state.user.trialRemainingDays >= 0) && (this.$store.state.user.trialDetails.askExtendingExpireDates.countAsking === 1)">feature to extend the expiration date!</p>
        <p v-if="($store.state.user.trialRemainingDays < 0) && ($store.state.user.trialDetails.askExtendingExpireDates.asking === true)">Your expiration date can be extended after JAS support team</p>
        <p v-if="($store.state.user.trialRemainingDays < 0) && ($store.state.user.trialDetails.askExtendingExpireDates.asking === true)">will confirm your asking</p>
        <p v-if="$store.state.user.trialRemainingDays < 0">Please upgrade to a paid subscription!</p>
        <p>If you have any questions, please contact <a href="mailto:info@jascorp.io" style="color: #f86c6b;">info@jascorp.io</a> and we’ll</p>
        <p>get right back to you.</p>
        <p style="text-align: center;">The JAS Team</p>
        <div v-if="($store.state.user.trialRemainingDays >= 0) && (this.$store.state.user.trialDetails.askExtendingExpireDates.countAsking === 0)">
          <b-form-textarea
            v-model="textMessage"
            placeholder="To extend your trial, Enter something..."
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </div>
        <div class="row extend-expire-data">
          <button v-if="($store.state.user.trialRemainingDays >= 0) && (this.$store.state.user.trialDetails.askExtendingExpireDates.countAsking === 0)" class="btn extend-expire-data" style="margin-right: 5px;" @click="btnAskClicked">Extend trial</button>
          <button class="btn extend-expire-data" @click="btnUpgradeClicked">Upgrade</button>
        </div>
      </b-modal>
      <b-modal v-model="$store.state.bShowTrialPendingMadal" lazy centered header-bg-variant="danger" :hide-footer="showModalFooter" no-close-on-backdrop no-close-on-esc title="Pending your asking...">
        <p>We are reviewing your request</p>
        <p>The JAS support team is reviewing your request.</p>
        <p>Please contact <a href="mailto:info@jascorp.io" style="color: #f86c6b;">info@jascorp.io</a>  if you require further information.</p>
        <div class="row extend-expire-data">
          <button class="btn extend-expire-data" @click="btnOkClicked">Ok</button>
        </div>
      </b-modal>
      <b-modal v-model="$store.state.user.trialDetails.askExtendingExpireDates.confirmAsking" lazy centered header-bg-variant="primary" :hide-footer="showModalFooter" no-close-on-backdrop no-close-on-esc title="Confirmed your asking by Admin...">
        <p>Your expiration date has been extended for 7 days.</p>
        <p>Please contact <a href="mailto:info@jascorp.io">info@jascorp.io</a> if you require further clarification.</p>
        <div class="row extend-expire-data">
          <button class="btn confirm-extend-expire-data" @click="btnConfirmOk">Ok</button>
        </div>
      </b-modal>
    </div>
  </footer>
</template>
<script>
export default {
  name: 'footer',
  data: function () {
    return {
      showExtendModal: true,
      textMessage: '',
      bSendMessage: false,
      showModalFooter: true
    }
  },
  methods: {
    btnAskClicked (event) {
      event.preventDefault()
      if (this.textMessage === '') {
        this.$toastr.e('Leave message to JAS support team.')
      } else {
        this.$toastr.i('Contacting to JAS...')
        this.$toastr.i('You can only extend the expiry date one time...')
        this.$store.dispatch('askExtending', {askingMessage: this.textMessage})
          .then(() => {
            this.$store.dispatch('showTrialPendingModal')
          })
          .catch(err => {
            this.$toastr.e(err)
          })
      }
    },
    btnUpgradeClicked () {
      this.$store.dispatch('hideTrialModal')
      this.$router.push('/account/payment')
    },
    btnOkClicked () {
      if (this.$store.state.user.trialRemainingDays < 0) {
        this.$router.push('/login')
      } else {
        this.$store.dispatch('hideTrialPendingModal')
      }
    },
    btnConfirmOk () {
      this.$store.dispatch('thanksToSupporTeam')
        .then(() => {
          this.$store.dispatch('hideConfirmModal')
        })
        .catch(err => {
          this.$toastr.e(err)
        })
    }
  },
  mounted: function () {
    if ((this.$store.state.user.trialDetails.status === 1) && (this.$store.state.user.trialRemainingDays <= 3)) {
      this.$store.dispatch('showTrialModal')
    }
  }
}
</script>
<style>
  .modal-header .close {
    display:none;
  }
  .btn.extend-expire-data {
    background: #f86c6b;
    color: white;
  }
  .btn.confirm-extend-expire-data {
    background: #20a8d8;
    color: white;
  }
  .row.extend-expire-data {
    justify-content: flex-end;
    margin: 0px;
    margin-top: 15px;
  }
</style>
