<template>
  <!--<div class="app profile align-items-center">-->
  <!--<div class="container">-->
  <!--<div class="row justify-content-center">-->
  <!--<div class="col-md-10">-->
  <!--<div class="card mx-4">-->
  <!--<div class="card-body p-4">-->
  <!--<div class="alert alert-success" v-if="success">-->
  <!--<strong>-->
  <!--<i class="fa fa-warning"></i>-->
  <!--</strong>-->
  <!--{{ success }}-->
  <!--</div>-->
  <!--<div class="alert alert-danger" v-if="error">-->
  <!--<strong>-->
  <!--<i class="fa fa-warning"></i> ERROR:-->
  <!--</strong>-->
  <!--{{ error }}-->
  <!--</div>-->
  <!--<h1 class="text-center">Card Details</h1>-->
  <!--<br />-->

  <!--<div  v-if="!isCardAdded">-->
  <!--<div class="card-form">-->
  <!--<div ref="card" class="card-class" style="margin-left: 0px; margin-right: 0px"></div>-->
  <!--<br>-->
  <!--<div class="row col-md-12 card-input-margin-padding">-->
  <!--<div class="col-md-6 card-form-btn-padding-left">-->
  <!--<button class="btn btn-primary spacing" v-on:click="saveCardDetails">Save</button>-->
  <!--</div>-->
  <!--<div class="col-md-6 card-form-btn-padding-right text-right">-->
  <!--<button class="btn btn-primary spacing" v-on:click="goSubscriptionPage">Subscription</button>-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->
  <!--<div class="card-detail-form" v-if="isCardAdded">-->
  <!--<div class="card-detail">-->
  <!--Card Number:   **** **** **** {{cardNumber}}-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->

  <!--<div class="subscription-container">-->
  <!--<div class="plan-block" v-for="(item, index) in myPlanList" :key="index">-->
  <!--<div v-if="$store.state.user.membership == index" class="card-padding">-->
  <!--<b-card no-body style="max-width: 25rem; text-align: center;">-->

  <!--<template v-slot:header >-->
  <!--<h5 class="mb-0" style="color: #48a8d0;">{{item.heading}}</h5>-->
  <!--<h4 class="mb-0" style="color: #3c3a3a; margin-top: 10px;">{{item.trialPeriad}}</h4><span>{{item.creditCard}}</span>-->
  <!--</template>-->

  <!--<b-card-body>-->
  <!--<b-card-title style="font-weight: 666;  color: #7d7d7d;">{{item.businessType}}</b-card-title>-->
  <!--<div class="mb-2 plan-price" >{{item.currency}}{{item.planPrice}}/month</div>-->
  <!--<div ><button class="btn btn-primary button-shadow" @click="selected_plan(index)">Select Plan</button></div>-->
  <!--<br>-->
  <!--<div style="color: #757575; font-weight: 566;">-->
  <!--{{item.RenewableType}}-->
  <!--</div>-->
  <!--</b-card-body>-->

  <!--<b-list-group flush>-->
  <!--<span v-for="(planInfo, planIndex) in item.planIncluded" :key="planIndex">-->
  <!--<b-list-group-item><span v-bind:class="{ 'important': planInfo.boldStyle, 'important-style' : planInfo.italicStyle }">{{planInfo.value}}</span></b-list-group-item>-->
  <!--</span>-->
  <!--</b-list-group>-->
  <!--<b-card-footer></b-card-footer>-->
  <!--</b-card>-->
  <!--</div>-->
  <!--<div v-else>-->
  <!--<b-card no-body style="max-width: 25rem; text-align: center;">-->

  <!--<template v-slot:header >-->
  <!--<h5 class="mb-0" style="color: #48a8d0;">{{item.heading}}</h5>-->
  <!--<h4 class="mb-0" style="color: #3c3a3a; margin-top: 10px;">{{item.trialPeriad}}</h4><span>{{item.creditCard}}</span>-->
  <!--</template>-->

  <!--<b-card-body>-->
  <!--<b-card-title style="font-weight: 666;  color: #7d7d7d;">{{item.businessType}}</b-card-title>-->
  <!--<div class="mb-2 plan-price" >{{item.currency}}{{item.planPrice}}/month</div>-->
  <!--<div ><button class="btn btn-primary button-shadow" @click="selected_plan(index)">Select Plan</button></div>-->
  <!--<br>-->
  <!--<div style="color: #757575; font-weight: 566;">-->
  <!--{{item.RenewableType}}-->
  <!--</div>-->
  <!--</b-card-body>-->

  <!--<b-list-group flush>-->
  <!--<span v-for="(planInfo, planIndex) in item.planIncluded" :key="planIndex">-->
  <!--<b-list-group-item><span v-bind:class="{ 'important': planInfo.boldStyle, 'important-style' : planInfo.italicStyle }">{{planInfo.value}}</span></b-list-group-item>-->
  <!--</span>-->
  <!--</b-list-group>-->
  <!--<b-card-footer></b-card-footer>-->
  <!--</b-card>-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->

  <div class="container">
    <div class="card-padding-bottom">
      <b-card>
        <div class="b-card-div-margin">
          <div class="row b-card-div-margin-div-margin-top">

            <vue-tabs active-tab-color="#20a8dc"
                      active-text-color="white"
                      @tab-change="handleTabChange"
            >
              <v-tab title="Billing Infomation">
              </v-tab>
              <v-tab title="Subscription">
              </v-tab>
              <v-tab title="Billing History">
              </v-tab>
            </vue-tabs>
          </div>
        </div>
      </b-card>
    </div>
    <div class="card-padding-bottom">
      <b-card>
        <div>
          <div v-if="btnSubscriptionClicked">
            <div class="row row-margin">
              <div class="" v-bind:class="{ 'col-md-4 billing-info-payment-plan-box': selected_plan_index === 0, 'col-md-4 billing-info-payment-plan-box-unselected': selected_plan_index !== 0 }">
                <div v-bind:class="{ 'row billing-info-row-height row-margin selected-plan-box': selected_plan_index === 0, 'row billing-info-row-height row-margin': selected_plan_index !== 0 }">
                  <div class="col-md-1 billing-info-position-check-img">
                    <div>
                      <button v-if="selected_plan_index === 0" class="check-img" style="background: url('../../static/img/svg/icon-checkmark.svg') 50% 50% no-repeat #61bd4f; outline: none;" @click="btnPlanClicked(0)"></button>
                      <button v-else-if="selected_plan_index !== 0" class="uncheck-img" style="background: url('../../static/img/svg/icon-checkmark.svg') 50% 50% no-repeat #ffffff; outline: none;" @click="btnPlanClicked(0)"></button>
                    </div>
                  </div>
                  <div class="col-md-11 billing-info-billing-plan-col-11">
                    <div class="billed-monthly-text-padding">Billed Monthly</div>
                    <div>
                      <label class="billing-info-billing-plan-label-usd">$ 299</label><span class="billing-info-billing-plan-span">14 days free</span>
                    </div>
                    <div>Per month</div>
                  </div>
                </div>
              </div>
              <div v-bind:class="{ 'col-md-4 billing-info-payment-plan-box': selected_plan_index === 1, 'col-md-4 billing-info-payment-plan-box-unselected': selected_plan_index !== 1 }">
                <div v-bind:class="{ 'row billing-info-row-height row-margin selected-plan-box': selected_plan_index === 1, 'row billing-info-row-height row-margin': selected_plan_index !== 1 }">
                  <div class="col-md-1 billing-info-position-check-img">
                    <div>
                      <button v-if="selected_plan_index === 1" class="check-img" style="background: url('../../static/img/svg/icon-checkmark.svg') 50% 50% no-repeat #61bd4f; outline: none;" @click="btnPlanClicked(1)"></button>
                      <button v-else-if="selected_plan_index !== 1" class="uncheck-img" style="background: url('../../static/img/svg/icon-checkmark.svg') 50% 50% no-repeat #ffffff; outline: none;" @click="btnPlanClicked(1)"></button>
                    </div>
                  </div>
                  <div class="col-md-11 billing-info-billing-plan-col-11">
                    <div class="billed-monthly-text-padding">Billed Monthly</div>
                    <div><label class="billing-info-billing-plan-label-usd">$ 599</label><span class="billing-info-billing-plan-span">14 days free</span></div>
                    <div>Per month</div>
                  </div>
                </div>
              </div>
              <div v-bind:class="{ 'col-md-4 billing-info-payment-plan-box': selected_plan_index === 2, 'col-md-4 billing-info-payment-plan-box-unselected': selected_plan_index !== 2 }">
                <div v-bind:class="{ 'row billing-info-row-height row-margin selected-plan-box': selected_plan_index === 2, 'row billing-info-row-height row-margin': selected_plan_index !== 2 }">
                  <div class="col-md-1 billing-info-position-check-img">
                    <div>
                      <button v-if="selected_plan_index === 2" class="check-img" style="background: url('../../static/img/svg/icon-checkmark.svg') 50% 50% no-repeat #61bd4f; outline: none;" @click="btnPlanClicked(2)"></button>
                      <button v-else-if="selected_plan_index !== 2" class="uncheck-img" style="background: url('../../static/img/svg/icon-checkmark.svg') 50% 50% no-repeat #ffffff; outline: none;" @click="btnPlanClicked(2)"></button>
                    </div>
                  </div>
                  <div class="col-md-11 billing-info-billing-plan-col-11">
                    <div class="billed-monthly-text-padding">Billed Monthly</div>
                    <div><label class="billing-info-billing-plan-label-usd">$ 999</label><span class="billing-info-billing-plan-span">14 days free</span></div>
                    <div>Per month</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row label-pay-with row-margin">
              <h6>Payment method</h6>
            </div>
            <div class="row row-margin">
              <div class="col-md-8 card-class row-margin" style="padding: 0px;" id="credic_card">
                <label v-if="cardInfo.cardNumber === ''" style="color: #908484; margin: 0px; width: 60%; height: 100%; text-align: left!important; background: none; border: 0px solid; padding-left: 5px;">Card Number: </label>
                <label v-else-if="cardInfo.cardNumber !== ''" style="color: #908484; margin: 0px; width: 60%; height: 100%; text-align: left!important; background: none; border: 0px solid; padding-left: 5px;">Card Number: **** **** **** {{cardInfo.cardNumber}}</label>
                <label v-if="cardInfo.expiration === ''" style="color: #908484; margin: 0px; width: 20%; height: 100%; text-align: right!important; background: none; border: 0px solid;">Expire: </label>
                <label v-else-if="cardInfo.expiration !== ''" style="color: #908484; margin: 0px; width: 20%; height: 100%; text-align: right!important; background: none; border: 0px solid;">Expire: {{cardInfo.expiration}}</label>
                <label v-if="cardInfo.cardNumber === ''" style="color: #908484; margin: 0px; width: 15%; height: 100%; text-align: right!important; background: none; border: 0px solid;">CVC: </label>
                <label v-if="cardInfo.cardNumber !== ''" style="color: #908484; margin: 0px; width: 15%; height: 100%; text-align: right!important; background: none; border: 0px solid;">CVC: ***</label>
              </div>
              <div class="col-md-2" style="padding: 0px; padding-left: 10px;">
                <button class="btn btn-primary" style="width: 100%; color: #ffffff" @click="btnChangeCardClicked">Update Card</button>
              </div>
              <div class="col-md-2" style="padding: 0px; padding-left: 10px;">
                <button class="btn btn-primary" style="width: 100%; color: #ffffff" @click="btnRemoveCardClicked">Remove Card</button>
              </div>
            </div>
            <div class="row billing-info-select-country-input row-margin">
              <div class="col-md-8 billing-info-padding-select-country-input-col8">
                <label>Country</label>
                <div class="card-class row-margin select-country">
                  <select style="margin: 0px; width: 100%; height: 100%; text-align: right!important; background: none; border: 0px solid;">
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Brazil</option>
                  </select>
                </div>
              </div>
              <div class="col-md-4 billing-info-padding-select-country-input-col4">
                <label>ZIP/Postal Code</label>
                <div class="card-class row-margin select-country">
                  <input type="text"  style="margin: 0px; width: 100%; height: 100%; text-align: right!important; background: none; border: 0px solid;" placeholder="Zip Code">
                </div>
              </div>
            </div>
            <div class="row label-pay-with row-margin">
              <h6>Plan summary</h6>
            </div>
            <div class="row row-margin billing-plan">
              <div>1. Monthly Pay For JAS Assessment </div>
              <div v-if="$store.state.user.subscriptionDetails.status === 1 && selected_membership === 0">$ 299</div>
              <div v-else-if="$store.state.user.subscriptionDetails.status === 1 && selected_membership === 1">$ 599</div>
              <div v-else-if="$store.state.user.subscriptionDetails.status === 1 && selected_membership === 2">$ 999</div>
            </div>
            <div class="row row-margin">
              <div class="line"></div>
            </div>
            <div class="row row-margin billing-plan">
              <div>Total</div>
              <div v-if="$store.state.user.subscriptionDetails.status === 1 && selected_membership === 0">$ 299</div>
              <div v-else-if="$store.state.user.subscriptionDetails.status === 1 && selected_membership === 1">$ 599</div>
              <div v-else-if="$store.state.user.subscriptionDetails.status === 1 && selected_membership === 2">$ 999</div>
            </div>
            <div class="row billing-info-upgrade-btn-padding">
              <button v-if="$store.state.user.subscriptionDetails.status" class="btn btn-primary billing-info-spacing" @click="btnPayment">Change Plan</button>
              <button v-else-if="!$store.state.user.subscriptionDetails.status" class="btn btn-primary billing-info-spacing" @click="btnPayment">Payment</button>
            </div>
          </div>
          <div v-if="btnBillingInfoClicked" id="downloadPdf">
            <div class="row label-pay-with row-margin">
              <h6>Plan summary</h6>
            </div>
            <div class="row row-margin billing-plan">
              <div>Payment Day</div>
              <div v-if="!boolCancelSubscription">{{$store.state.user.subscriptionDetails.startDate}}</div>
            </div>
            <div class="row unit-opacity">
              <div>YY-MM-DD</div>
            </div>
            <div class="row row-margin">
              <div class="line"></div>
            </div>
            <div class="row row-margin billing-plan">
              <div>Next Payment Day</div>
              <div v-if="!boolCancelSubscription">{{$store.state.user.subscriptionDetails.endDate}}</div>
            </div>
            <div class="row unit-opacity">
              <div>YY-MM-DD</div>
            </div>
            <div class="row row-margin">
              <div class="line"></div>
            </div>
            <div class="row row-margin billing-plan">
              <div>1. Monthly Pay For JAS Assessment </div>
              <div v-if="!boolCancelSubscription">$ {{$store.state.user.subscriptionDetails.amount}}</div>
            </div>
            <div class="row unit-opacity">
              <div>USD</div>
            </div>
            <div class="row row-margin">
              <div class="line"></div>
            </div>
            <div class="row row-margin billing-plan">
              <div>Total</div>
              <div v-if="!boolCancelSubscription">$ {{$store.state.user.subscriptionDetails.amount}}</div>
            </div>
            <div class="row billing-info-upgrade-btn-padding">
              <button v-if="!boolCancelSubscription" class="btn btn-primary billing-info-spacing cancel" @click="btnCancelSubscriptionClicked">Cancel Subscription</button>
            </div>
          </div>
          <div v-if="btnBillingHistoryClicked">
            <CDataTable
              id="invoice_table"
              class="mb-0 table-outline table-striped"
              hover
              :items="invoices"
              :fields="tableFields"
              head-color="blue"
              pagination
              sorter
              itemsPerPageSelect
              :itemsPerPage=10
              clickableRows
            >
              <td slot="pdf" slot-scope="{item}">
                <div v-if="item.status === 'Success'" style="text-align: center">
                  <span @click="goInvoiceVue(item.no)">
                    <i class="icon-docs"></i>
                  </span>
                </div>
              </td>
            </CDataTable>
          </div>
        </div>
      </b-card>
    </div>

    <b-modal v-model="selected_one" lazy centered header-bg-variant="primary" no-close-on-backdrop no-close-on-esc id="disclaimerModal" title="Membership Pricing Disclaimer"  @cancel="handleCancel"
             @ok="handleOk">
      <p>You are now changing your membership tier.</p>
      <p>Do you wish to continue?</p>
      <p>Please contact <a href="mailto:info@jascorp.io">info@jascorp.io</a> if you require further clarification.</p>
    </b-modal>

    <b-modal v-model="downgrade" lazy centered header-bg-variant="primary" no-close-on-backdrop no-close-on-esc id="disclaimerModal" title="Downgrade Membership?"  @cancel="handleDownGradeCancel"
             @ok="handleDownGradeOk">
      <p>You are about to change your current plan.</p>
      <p>Please note that that this will impact other assigned users.</p>
      <p>Any assigned users for this account will be deleted, and also you may lose some standards.</p>
      <p>Would you like to proceed?</p>
    </b-modal>

    <b-modal v-model="useParentAccount" lazy centered header-bg-variant="primary" no-close-on-backdrop no-close-on-esc id="useParentModal" title="You can follow this" @cancel="handleUsingParentCancel"
             @ok="handleUsingParentOk">
      <p>You are about to change your current plan.</p>
      <p>You can use a sub-account of your company without any payments.</p>
      <p>Please contact following members of your company.</p>
      <div v-for="(user, index) in companyUserAdmins">
        <div class="input-group mb-3">
          <label class="col-md-2">email:</label>
          <div class="col-md-5 init-div">
            <a class="a-color" style="color: #20a8d8; text-decoration: underline;">{{user.email}}</a>
          </div>
          <label class="col-md-3">membership:</label>
          <div class="col-md-2 init-div">
            <a class="a-color" style="color: #20a8d8; text-decoration: underline;">{{user.membership}}</a>
          </div>
        </div>
      </div>
    </b-modal>

    <b-modal v-model="boolCancelSubscriptionModal" lazy centered header-bg-variant="primary" no-close-on-backdrop no-close-on-esc id="cancelSubscriptionModal" title="Cancel Subscription?"  @cancel="handleCancelSubscriptionCancel"
             @ok="handleCancelSubscriptionOk">
      <p>You are about to change your current plan.</p>
      <p>Please note that this will impact other assigned users.</p>
      <p>Any assigned user associated with this account will be deleted and access</p>
      <p>to certain standards may be restricted.</p>
    </b-modal>

    <b-modal  v-model="boolChangeCardInfo" lazy centered header-bg-variant="primary" no-close-on-backdrop no-close-on-esc id="changeCardInfoModal" title="Change Card Info"  @cancel="handleChangeCardInfoCancel"
             @ok="handleChangeCardInfoOk">
      <VCreditCard @change="creditInfoChanged"/>
    </b-modal>

    <b-modal v-model="boolRemoveCard" lazy centered header-bg-variant="primary" no-close-on-backdrop no-close-on-esc id="removeCardModal" title="Remove Card?"  @cancel="handleRemoveCardCancel"
             @ok="handleRemoveCardOk">
      <h5>To remove this card from your payment profile type</h5>
      <h5>"<span style="color: red">remove</span>" below.</h5>
      <br>
      <div class="col-md-12 col-sm-12 init-div">
        <input type="text" class="form-control custom-input" placeholder="remove" title="Must contain between 5 to 12 characters and no special characters allowed" pattern="[a-zA-Z0-9_.-]{5,25}"  v-model="removeCardInput" required>
      </div>
    </b-modal>
  </div>
  <!--</div>-->
</template>

<script>
  import { planList } from '../../mock/mock'
  import VCreditCard from 'v-credit-card'
  import 'v-credit-card/dist/VCreditCard.css'
  // import $ from 'jquery'

  export default {
    components: {
      VCreditCard
    },
    data: function () {
      return {
        success: false,
        error: false,
        cardNumber: '',
        isCardAdded: false,
        myPlanList: [],
        selected_one: false,
        selected_membership: '',
        selected_membership_temp: '',
        selected_plan_index: '',
        downgrade: false,
        downGradeValue: 0,
        users: '',
        companyUserAdmins: [],
        useParentAccount: false,
        activeBtn: '',
        btnSubscriptionClicked: true,
        btnBillingInfoClicked: false,
        btnBillingHistoryClicked: false,
        boolCancelSubscription: false,
        boolCancelSubscriptionModal: false,
        boolChangeCardInfo: false,
        boolRemoveCard: false,
        removeCardInput: '',
        tableFields: [
          {key: 'no', label: 'No', _style: 'width: 5%'},
          {key: 'description', label: 'Description', _classes: 'text-center', _style: 'width: 30%'},
          {key: 'amount', label: 'Amount', _classes: 'text-center', _style: 'width: 15%'},
          {key: 'paymentMethod', label: 'Payment Method', _classes: 'text-center', _style: 'width: 15%'},
          {key: 'paymentDay', label: 'Payment Day', _classes: 'text-center', _style: 'width: 20%'},
          {key: 'status', label: 'Status', _classes: 'text-center', _style: 'width: 10%'},
          {key: 'pdf', label: 'PDF', _classes: 'text-center', _style: 'width: 5%'}
        ],
        invoices: [],
        cardInfo: {
          name: '',
          cardNumber: '',
          expiration: '',
          security: ''
        },
        cardInfoTmp: {
          name: '',
          cardNumber: '',
          expiration: '',
          security: ''
        },
        membership: {
          small: 0,
          medium: 1,
          large: 2,
          trial: 3
        },
        showedMembership: [
          {
            payment: 'SMALL'
          },
          {
            payment: 'MEDIUM'
          },
          {
            payment: 'LARGE'
          },
          {
            payment: 'TRIAL'
          }
        ]
      }
    },
    mounted: function () {
      this.myPlanList = planList
      this.myPlanList[0].planPrice = this.$store.state.priceData.small
      this.myPlanList[1].planPrice = this.$store.state.priceData.medium
      this.myPlanList[2].planPrice = this.$store.state.priceData.large
      this.selected_membership = this.$store.state.user.membership
      this.selected_plan_index = this.$store.state.user.membership
      if (this.$store.state.user.subscriptionDetails.status === 1) {
        this.boolCancelSubscription = false
      } else {
        this.boolCancelSubscription = true
      }
      this.getPaymentDetail()
      this.getPaymentHistory()
      // let thisTmp = this
      // $(document).on('click', '#invoice_table tr', function (e) {
      //   console.log(e)
      //   let id = 0
      //   thisTmp.$router.push(`/account/invoice/${id}`)
      //   // this.$router.push(`/reports/${response.created}?created=true`)
      // })
    },
    methods: {
      // regenrateCardForm: function () {
      //   if (card) card.destroy(this.$refs.card)
      //   card = elements.create('card')
      //   card.mount(this.$refs.card)
      // },
      btnPayment: function () {
        if (this.cardInfo.cardNumber === '') {
          this.$toastr.e('Card Info Error')
          return
        }

        if (this.selected_plan_index < this.$store.state.user.membership) {
          if (this.$store.state.user.membership !== this.membership.trial) {
            this.downgrade = true
            this.selected_membership_temp = this.selected_plan_index
          } else {
            this.$store.dispatch('getCompanyUsers')
              .then((response) => {
                this.users = response
                if (this.users.length > 1) {
                  this.companyUserAdmins = []
                  for (let i = 0; i < this.users.length; i++) {
                    if (this.users[i].parentAccount.hasParent === false && this.users[i].membership !== this.membership.trial) {
                      let userAdminInfo = {
                        email: this.users[i].email,
                        fullname: this.users[i].firstName + ' ' + this.users[i].lastName,
                        membership: this.showedMembership[this.users[i].membership].payment
                      }
                      this.companyUserAdmins.push(userAdminInfo)
                    }
                  }
                  if (this.companyUserAdmins.length === 0) {
                    this.selected_one = true
                    this.selected_membership = this.selected_plan_index
                  } else {
                    this.selected_membership = this.selected_plan_index
                    this.useParentAccount = true
                  }
                } else {
                  this.selected_membership = this.selected_plan_index
                  this.useParentAccount = true
                }
              })
              .catch((err) => {
                this.handleError(err)
              })
          }
        }
        if (this.selected_plan_index > this.$store.state.user.membership) {
          this.$store.dispatch('getCompanyUsers')
            .then((response) => {
              this.users = response
              if (this.users.length > 1) {
                this.companyUserAdmins = []
                for (let i = 0; i < this.users.length; i++) {
                  if (this.users[i].parentAccount.hasParent === false && this.users[i].membership !== this.membership.trial) {
                    let userAdminInfo = {
                      email: this.users[i].email,
                      fullname: this.users[i].firstName + ' ' + this.users[i].lastName,
                      membership: this.showedMembership[this.users[i].membership].payment
                    }
                    this.companyUserAdmins.push(userAdminInfo)
                  }
                }
                if (this.companyUserAdmins.length === 0) {
                  this.selected_one = true
                  this.selected_membership = this.selected_plan_index
                } else {
                  this.selected_membership = this.selected_plan_index
                  this.useParentAccount = true
                }
              } else {
                this.selected_membership = this.selected_plan_index
                this.useParentAccount = true
              }
            })
            .catch((err) => {
              this.handleError(err)
            })
        }
      },
      creditInfoChanged: function (values) {
        this.cardInfoTmp.name = values.name
        this.cardInfoTmp.cardNumber = values.cardNumber
        this.cardInfoTmp.expiration = values.expiration
        this.cardInfoTmp.security = values.security
      },
      getPaymentDetail: function () {
        let user = JSON.parse(localStorage.getItem('vuex'))
        let userId = user.user.id
        this.$store.dispatch('getPaymentData', userId)
          .then(data => {
            if (data.success) {
              // if the user has registered their card
              this.isCardAdded = true
              this.cardNumber = data.data
              this.cardInfo.cardNumber = data.data.cardNumber
              this.cardInfo.expiration = data.data.expiration
            } else {
              this.isCardAdded = false
            }
          })
          .catch(err => {
            console.log('error:', err)
          })
      },
      getPaymentHistory: function () {
        this.invoices = []
        this.$store.dispatch('getPaymentHistory')
          .then(data => {
            for (let i = 0; i < data.length; i++) {
              let tableItem = {
                no: i + 1,
                description: data[i].paymentMethodDetails,
                amount: '$ ' + data[i].amountPaid,
                paymentMethod: data[i].paymentMethod,
                // paymentDay: data[i].createdAt.split('T')[0],
                paymentDay: data[i].createdAt,
                status: data[i].paymentStatus,
                _id: data[i]._id
              }
              this.invoices.push(tableItem)
            }
          })
          .catch(err => {
            console.log('getPaymentHistory => error:', err)
          })
      },
      btnChangeCardClicked: function () {
        this.boolChangeCardInfo = true
      },
      btnRemoveCardClicked: function () {
        this.boolRemoveCard = true
      },
      handleCancel () {
        this.selected_one = false
        this.selected_membership = ''
        this.selected_membership = this.$store.state.user.membership
        this.selected_plan_index = this.$store.state.user.membership
      },
      handleOk () {
        let data = {
          userMembership: this.selected_membership,
          downGradeValue: this.downGradeValue
        }
        this.$store.dispatch('updateMembership', data)
          .then((data) => {
            this.$store.dispatch('updateUserMembership', data)
            this.getPaymentHistory()
            this.downGradeValue = 0
            this.$toastr.s('Your Membership is updated')
          })
          .catch((err) => {
            this.downGradeValue = 0
            this.handleError(err)
          })
      },
      handleDownGradeOk () {
        this.downGradeValue = 1
        this.selected_one = true
        this.selected_membership = this.selected_membership_temp
        this.downgrade = false
      },
      handleDownGradeCancel () {
        this.downGradeValue = 0
        this.downgrade = false
        this.selected_membership = this.$store.state.user.membership
        this.selected_plan_index = this.$store.state.user.membership
      },
      handleUsingParentOk () {
        this.useParentAccount = false
      },
      handleUsingParentCancel () {
        this.useParentAccount = false
        this.selected_one = true
      },
      handleError (err) {
        this.error = err.message
      },
      handleTabChange (tabIndex, newTab, oldTab) {
        if (tabIndex === 0) {
          this.btnSubscriptionClicked = true
          this.btnBillingInfoClicked = false
          this.btnBillingHistoryClicked = false
          this.selected_membership = this.$store.state.user.membership
          this.selected_plan_index = this.$store.state.user.membership
          this.getPaymentDetail()
        } else if (tabIndex === 1) {
          this.btnSubscriptionClicked = false
          this.btnBillingInfoClicked = true
          this.btnBillingHistoryClicked = false
        } else {
          this.btnSubscriptionClicked = false
          this.btnBillingInfoClicked = false
          this.btnBillingHistoryClicked = true
        }
      },
      btnPlanClicked (index) {
        this.selected_plan_index = index
      },
      btnCancelSubscriptionClicked () {
        this.boolCancelSubscriptionModal = true
      },
      createToken () {
        let expMonth = this.cardInfoTmp.expiration.split('/')[0]
        let expYear = this.cardInfoTmp.expiration.split('/')[1]
        let cardInfo = {
          number: this.cardInfoTmp.cardNumber,
          cvc: this.cardInfoTmp.security,
          exp_month: expMonth,
          exp_year: expYear
        }
        window.Stripe.setPublishableKey(`pk_test_QS4IyPQBDjbcyWKCmNS0nyri00woWQutRb`)
        window.Stripe.createToken(cardInfo, this.stripeResponseHandler)
      },
      handleChangeCardInfoOk (e) {
        e.preventDefault()
        if (this.cardInfoTmp.name === '') {
          this.$toastr.e('type card user name')
        } else if (this.cardInfoTmp.cardNumber === '') {
          this.$toastr.e('type card number')
        } else if (this.cardInfoTmp.expiration === '') {
          this.$toastr.e('type card expiration')
        } else if (this.cardInfoTmp.security === '') {
          this.$toastr.e('type card security')
        } else {
          this.createToken()
          this.boolChangeCardInfo = false
        }
      },
      stripeResponseHandler (status, response) {
        if (response.error) { // Problem!
          this.$toastr.e(response.error.message)
        } else { // Token was created!
          let user = JSON.parse(localStorage.getItem('vuex'))
          const sendObject = {
            userId: user.user.id,
            token: response.id,
            cardDetails: {
              type: response.type,
              cardId: response.card.id,
              cardToken: response.id,
              cardLast4: response.card.last4,
              expiration: this.cardInfoTmp.expiration
            }
          }
          this.$store
            .dispatch('addPaymentMethod', sendObject)
            .then(data => {
              this.$toastr.s('Card added successfully!')
              this.cardInfo.cardNumber = this.cardInfoTmp.cardNumber.split(' ')[3]
              this.cardInfo.expiration = this.cardInfoTmp.expiration
              this.cardInfo.security = this.cardInfoTmp.security
            })
            .catch(err => {
              this.$toastr.e('Card added failed!')
              console.log('error:', err)
            })
        }
      },
      handleChangeCardInfoCancel () {
        this.boolChangeCardInfo = false
      },
      handleRemoveCardOk (e) {
        e.preventDefault()
        if (this.removeCardInput === 'remove') {
          this.$store.dispatch('removeCard')
            .then((res) => {
              console.log(res)
              this.cardInfo.cardNumber = ''
              this.cardInfo.expiration = ''
              this.cardInfo.security = ''
              this.$toastr.s('Romoved Card Successully')
            })
            .catch(err => {
              console.log(err)
              this.$toastr.e('Failed Removing Card')
            })
          this.boolRemoveCard = false
        } else {
          this.$toastr.e('Wrong word')
        }
        this.removeCardInput = ''
      },
      handleRemoveCardCancel () {
        this.removeCardInput = ''
        this.boolRemoveCard = false
      },
      handleCancelSubscriptionOk () {
        this.boolCancelSubscription = true
        this.boolCancelSubscriptionModal = false
        this.$store.dispatch('cancelSubscription')
          .then((data) => {
            this.$store.dispatch('updateUserMembership', data)
            this.$toastr.s('Cancel Subscription Successfully')
          })
          .catch(err => {
            console.log(err)
            this.$toastr.e('Failed Canceling Subscription')
          })
      },
      handleCancelSubscriptionCancel () {
        this.boolCancelSubscription = false
        this.boolCancelSubscriptionModal = false
      },
      goInvoiceVue (index) {
        let id = this.invoices[index - 1]._id
        this.$router.push(`/account/invoice/${id}`)
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
  .spacing {
    width:30%;
    margin-top: 20px;
    line-height: 30px;
    padding: 0px 10px;
    text-align: center;
    color: #fff;
  }
  .card-form-btn-padding-left {
    padding-left: 0px;
  }
  .card-form-btn-padding-right {
    padding-right: 0px;
  }
  .card-input-margin-padding {
    margin-right: 0px!important;
    margin-left: 0px!important;
    padding-right: 0px;
    padding-left: 0px;
  }
  .card-padding .card-header {
    background: #20a8d8;
  }
  .card-padding .card .card-header .mb-0{
    color: #ffffff !important;
  }
  .a-color {
    color: #20a8d8;
  }
  .card-class {
    width: 100%;
    float: left;
    background: #ececec;
    line-height: 30px;
    padding: 10px;
    box-sizing: border-box;
  }
  .card-detail{
    width: 100%;
    background: #ececec;
    line-height: 40px;
    font-weight: 500;
    color: #696969;
    padding: 0px 20px;
  }
  .plan-price{
    font-weight: 700;
    font-size: 30px;
  }
  .subscription-container {
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  .plan-block:hover {
    transition: all 0.5s ease;
    box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);
  }
  .plan-block {
    -webkit-transition: background-color 500ms ease-out 1s;
    -moz-transition: background-color 500ms ease-out 1s;
    -o-transition: background-color 500ms ease-out 1s;
    transition: background-color 500ms ease-out 1s;
  }
  .btn btn-primary button-shadow:hover {
    box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);
  }
  .important {
    background: yellow;
    font-weight: bold
  }

  .important-style {
    font-weight: bold;
    font-style: italic;
  }


  .b-card-div-margin-div-margin-top {
    margin-left: 0px;
    margin-top: inherit;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  .card-padding-bottom .card .card-body {
    margin-bottom: 0;
    padding-bottom: 0;
  }
  .thead-bgcolor {
    background: #20a8d8;
    color: #ffffff;
  }
  .billing-info-payment-plan-box {
    /*background: #20a8d8;*/
    height: 90px;
    color: #ffffff;
  }
  .billing-info-payment-plan-box-unselected {
    color: #151b1e;
    height: 90px;
  }
  .label-pay-with {
    margin-top: 20px;
  }
  .card-class {
    width: 100%;
    float: left;
    background: #ececec;
    line-height: 30px;
    padding: 10px;
    box-sizing: border-box;
  }
  .check-img {
    background-size: 65%;
    display: block;
    position: absolute;
    left: 10px;
    top: 32%;
    border-radius: 50%;
    border: 2px solid #fff;
    width: 28px;
    height: 28px;
  }
  .uncheck-img {
    background-size: 65%;
    display: block;
    position: absolute;
    left: 10px;
    top: 32%;
    border-radius: 50%;
    border: 2px solid #111111;
    width: 28px;
    height: 28px;
  }
  .billing-history-check-img {
    background-size: 65%;
    display: block;
    position: absolute;
    /*left: 10px;*/
    /*top: 32%;*/
    border-radius: 50%;
    border: 2px solid #fff;
    width: 25px;
    height: 25px;
  }
  .billing-info-position-check-img {
    position: relative;
    height: 100%;
    padding: 0;
  }
  .row.billing-info-row-height.row-margin.selected-plan-box {
    background: #20a8d8;
    height: 100%;
    border-radius: 10px 10px 10px 10px;
  }
  .row.billing-info-row-height.row-margin {
    background: #ececec;
    height: 100%;
    border-radius: 10px 10px 10px 10px;
  }
  .billing-info-billing-plan-span {
    color: #ffffff;
    border-radius: 5px;
    padding: 5px;
    background: #61bd4f;
    margin-left: 15px;
  }
  .billing-info-billing-plan-col-11 {
    padding-left: 25px;
    position: relative;
    height: 100%;
  }
  .billing-info-billing-plan-label-usd {
    font-weight: bold;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 27px;
    margin-bottom: 0px!important;
  }
  .billing-info-select-country-input {
    padding-top: 20px;
    width: 100%;
    height: 100%;
  }
  .billing-info-padding-select-country-input {
    height: 30px;
    padding: 0px;
    width: 100%;
  }
  .billing-info-padding-select-country-input-col8 {
    padding-left: 0px;
    padding-right: 5px;
  }
  .billing-info-padding-select-country-input-col4 {
    padding-left: 5px;
    padding-right: 0px;
  }
  .row-margin {
    margin-left: 0!important;
    margin-right: 0!important;
  }
  .row.label-pay-with.row-margin {
    margin-top: 30px;
  }
  .row.row-margin.billing-plan {
    justify-content: space-between;
    padding: 30px;
  }
  .btn.btn-primary.billing-info-spacing {
    color: #ffffff;
    width: 15%;
  }
  .btn.btn-primary.billing-info-spacing.cancel {
    padding-left: 1px;
    padding-right: 1px;
    color: #ffffff;
    width: 15%;
  }
  .billing-info-upgrade-btn-padding {
    margin-right: auto;
    justify-content: flex-end;
    padding-bottom: 18px;
  }
  .billed-monthly-text-padding {
    padding-top: 5px;
  }
  .line{
    width: 100%;
    /*height: 47px;*/
    border-bottom: 1px solid black;
    /*position: absolute;*/
  }
  .card-class.row-margin {
    height: 35px;
  }
  .card-class.row-margin.select-country {
    padding: 0px;
    height: 35px;
    padding-right: 1px;
  }
  .row.unit-opacity {
    justify-content: flex-end;
    margin-right: 30px;
    opacity: 0.4;
  }
  /*thead {*/
    /*background: #20a8d8;*/
    /*color: white;*/
  /*}*/
</style>
