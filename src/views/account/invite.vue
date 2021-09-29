<template>
  <div class="app profile align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-10">
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
              <h1 class="text-center">Invite New User</h1>
              <br />

              <div class="card-detail-form">
                <div class="card-detail card-detail-invite col-md-12">
                  <div class="input-group mb-3">
                    <span class="input-group-addon">Email</span>
                    <input type="email" v-model="email" class="form-control" placeholder="Email" required>
                  </div>
                </div>
                <button  class="my-button" v-on:click="checkInviteeEmail">Invite</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container" v-if="isPromotionApplicabale">
      <div class="row justify-content-center">
        <div class="col-md-10">
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
              <h1 class="text-center">Promote User</h1>
              <br />

              <div class="card-detail-form">
                <div class="card-detail card-detail-invite col-md-12">
                  <div class="input-group mb-3">
                    <b-form-select v-model="promotionSelected" :options="options" class="mb-3"></b-form-select>
                  </div>
                </div>
                <button  class="my-button" v-on:click="promoteInvitee">Promote</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container" v-if="isUserInvited">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="card mx-4">
            <div class="card-body p-4">
              <h1 class="text-center">List of Invited Users</h1>

              <div class="alert alert-success" v-if="successDelete">
                <strong>
                  <i class="fa fa-warning"></i>
                </strong>
                {{ successDelete }}
                <br> For check, refresh the page
              </div>
              <div class="alert alert-danger" v-if="errorDelete">
                <strong>
                  <i class="fa fa-warning"></i> ERROR:
                </strong>
                {{ errorDelete }}
              </div>

              <div>
                <table aria-busy="false" aria-colcount="3" class="table b-table table-striped table-hover" id="__BVID__43_">
                  <thead class="">
                    <tr>
                      <th aria-colindex="1" class="">Email</th>
                      <th aria-colindex="2" class="">Status</th>
                      <th aria-colindex="3" class="">Sent On</th>
                      <th aria-colindex="3" class="">Remove Access</th>
                    </tr>
                  </thead>
                  <tbody class="">
                    <tr class="" v-for="(invite, index) in allInvitees"  v-bind:key="index">
                      <td aria-colindex="1" class="">{{invite.email}}</td>
                      <td aria-colindex="2" class="">{{invite.isAccepted ? 'Accepted' : ' Pending '}}</td>
                      <td aria-colindex="3" class="">{{format_date(invite.createdAt) }}</td>
                      <td aria-colindex="3" class="">
                        <b-button pill variant="outline-danger" size="sm" @click="setInviteeUser(invite._id)" v-b-modal.modal-center>Remove Access</b-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <b-modal id="modal-center" @ok="deleteInviteeUser" centered title="Are You Sure?">
                    <p class="my-4">The invitee would lose all the privileges</p>
                </b-modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import moment from 'moment'

// import router from '../../router'ß
export default {
  data: function () {
    return {
      success: false,
      error: false,
      email: '',
      cardNumber: '',
      isCardAdded: false,
      allInvitees: [],
      isUserInvited: false,
      inviteeId: '',
      successDelete: false,
      errorDelete: false,
      promotionSelected: null,
      isPromotionApplicabale: false,
      options: [
        { value: null, text: 'Please select a user' }
      ]
    }
  },
  mounted: function () {
    this.getAllInvitees()
    this.getAllPromoteInvitees()
  },
  methods: {
    checkInviteeEmail: function () {
      let user = JSON.parse(localStorage.getItem('vuex'))
      let sendObject = {
        email: this.email,
        sender: user.user.id
      }
      this.$store.dispatch('sendInviteeEmail', sendObject)
        .then((data) => {
          this.email = ''

          if (data.result === 'Success') {
            this.success = 'An invitation is successfully sent to this email.'
            this.error = false
            this.getAllInvitees()
          } else {
            this.error = 'This email is already registered!'
            this.success = false
          }
        })
        .catch(err => {
          console.log('error:', err)
        })
    },
    getAllInvitees: function () {
      let user = JSON.parse(localStorage.getItem('vuex')).user.id
      this.$store.dispatch('getAllInvitees', user)
        .then((data) => {
          // first find out if there is any user invited by the subscriber
          if (data.data.length > 0) {
            this.isUserInvited = true
            this.allInvitees = data.data
          }
        })
    },
    getAllPromoteInvitees: function () {
      let user = JSON.parse(localStorage.getItem('vuex')).user.id
      this.$store.dispatch('getAllPromoteInvitees', user)
        .then((data) => {
          console.log('data propmoted is:::::', data)
          // first find out if there is any user invited by the subscriber
          if (data.success) {
            this.isPromotionApplicabale = true
            for (let i = 0; i < data.data.length; i++) {
              let tmpObj = {
                text: data.data[i].email,
                value: data.data[i].email
              }
              this.options.push(tmpObj)
            }
          }
        })
    },
    promoteInvitee: function () {
      if (this.promoteInvitee !== null && this.promoteInvitee !== '') {
        let data = {
          sender: JSON.parse(localStorage.getItem('vuex')).user.id,
          recieverEmail: this.promotionSelected
        }
        this.$store.dispatch('promoteInvitee', data)
          .then((data) => {
            console.log('data is ":::::::', data)
          // first find out if there is any user invited by the subscriber
          // if (data.data.length > 0) {
          //   this.isUserInvited = true
          //   this.allInvitees = data.data
          // }
          })
      }
    },
    format_date (date) {
      return moment(String(date)).format('MM/DD/YYYY hh:mm')
    },
    setInviteeUser: function (id) {
      this.inviteeId = id
    },
    deleteInviteeUser: function () {
      this.$store.dispatch('deleteInviteeUser', this.inviteeId).then((data) => {
        // first find out if there is any user invited by the subscriber
        if (data.success) {
          this.successDelete = 'User access has been successfully removed.'
          this.errorDelete = false
          this.getAllInvitees()
        } else {
          this.errorDelete = 'Error: Please Try Again!'
          this.successDelete = false
        }
      })
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