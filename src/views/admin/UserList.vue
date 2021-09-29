<template>
  <b-card>
    <div class="alert alert-danger" v-if="err">
      <strong><i class="fa fa-warning"></i>{{err}}</strong> {{ error }}
    </div>
    <div class="row" style="display: flex; justify-content: flex-end; margin-bottom: 2px; margin-right: 0px;">
      <div style="display: flex; justify-content: flex-end; margin-bottom: 2px">
        <b-nav class="ml-auto">
          <b-nav-item-dropdown right style="display: flex; justify-content: center; align-items: center;">
            <template slot="button-content">
              <i class="icon-envelope-open"></i>
              <label style="color: red">{{askingTrialUsers === 0 ? '' : askingTrialUsers}}</label>
            </template>
            <b-dropdown-header tag="div" class="text-center"><strong>Asking to extend expiring date</strong></b-dropdown-header>
            <!--<b-dropdown-item v-for="link in userLinks" :key="link.index">-->
            <b-dropdown-item v-for="askingUsers in tableItems" :key="askingUsers.index">
              <div v-if="(askingUsers.trialDetails.status === 1) && (askingUsers.trialDetails.askExtendingExpireDates.asking === true)" class="row" style="justify-content: space-around;" @click="btnAskingMessageClicked(askingUsers.userid)">
                <label style="color: #20a8d8">{{askingUsers.firstname}}<span style="margin-left: 5px">{{askingUsers.lastname}}</span></label>
                <label>{{askingUsers.askingDate}}</label>
              </div>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-nav>
      </div>
      <div>
        <button class="btn-primary" v-on:click="$router.push('/jas-admin/users/create')">Create User</button>
      </div>
    </div>
    <br>
    <CDataTable
      class="mb-0 table-outline table-striped"
      hover
      :items="tableItems"
      :fields="tableFields"
      head-color="light"
      columnFilter
      pagination
      sorter
      itemsPerPageSelect
      :itemsPerPage=10
    >
      <td slot="no" slot-scope="{item}">
      <div>{{item.index}}</div>
      </td>
      <td slot="avatar" class="text-center" slot-scope="{item}">
        <div class="c-avatar">
          <img :src="item.icon.url" class="t-img-avatar" alt="">
          <span v-if="item.permissions.includes('admin')"
            class="c-avatar-status"
            :class="`bg-${'success' || 'secondary'}`"
          ></span>
          <span v-if="item.permissions.includes('user') || item.permissions.includes('sub-account')"
                class="c-avatar-status"
                :class="`bg-${'warning' || 'secondary'}`"
          ></span>
        </div>
      </td>
      <td slot="action" slot-scope="{item}">
        <div v-if="item.permissions.includes('user') || item.permissions.includes('sub-account')">
          <span @click="edituser(item.userid)">
            <i class="fa fa-pencil fa-lg"></i>
          </span>
          <span @click="deleteuser(item.userid)">
            <i class="fa fa-trash fa-lg"></i>
          </span>
        </div>
      </td>
    </CDataTable>

    <b-modal v-model="editable_user_admin" lazy centered header-bg-variant="primary" id="confirmEditableMddal" title="User Admin Not Editable"
             @ok="editableUserAdminOk">
      <p>A user on TRIAL tier can not be User Admin.</p>
      <p>Please select another user!</p>
    </b-modal>
    <b-modal v-model="selected_delete" lazy centered header-bg-variant="primary" id="deleteUserModal" title="Delete User"  @cancel="deluserCancel"
             @ok="deluserOk">
      <p>A selected user will be deleted for now.</p>
      <p>Would you like to proceed?</p>
    </b-modal>
    <b-modal v-model="selected_confirm" lazy centered header-bg-variant="primary" id="confirmAskingModal" title="Confirm asking to extend the expiring date..."  @cancel="confirmAskingCancel"
             @ok="confirmAskingOk">
      <div class="input-group mb-3">
        <label>{{user.firstName}}<span style="margin-right: 3px;"></span>{{user.lastName}}</label>
      </div>
      <div class="input-group mb-3">
        <label class="col-md-5 col-sm-5 text-right">Old Expire Date <span class="require">*</span></label>
        <div class="col-md-4 col-sm-4 init-div">
          <input type="text" v-model="user.expireDate" class="form-control custom-input" disabled>
        </div>
      </div>
      <div class="input-group mb-3">
        <label class="col-md-5 col-sm-5 text-right">New Expire Date <span class="require">*</span></label>
        <div class="col-md-4 col-sm-4 init-div">
          <input type="text" v-model="selectedUserExpendExpireDate" class="form-control custom-input" disabled>
        </div>
      </div>
      <div class="input-group mb-3">
        <label>Customer Notes</label>
      </div>
      <div class="input-group mb-3">
        <b-form-textarea
          v-model="selectedTrialUserAskingMessage"
          rows="3"
          max-rows="6"
        ></b-form-textarea>
      </div>
    </b-modal>
    <b-modal v-model="selected_edit" lazy centered header-bg-variant="primary" no-close-on-backdrop no-close-on-esc id="editUserModal" title="Edit User"  @cancel="edituserCancel"
             @ok="edituserOk">

      <div class="row init-div">
        <div class="col-md-12 col-sm-12">
          <div class="input-group mb-3">
            <label class="col-md-5 col-sm-5 text-right">First Name <span class="require">*</span></label>
            <div class="col-md-7 col-sm-7 init-div">
              {{user.firstname}}
              <input type="text" class="form-control custom-input" title="Must have atleast one character" pattern="[a-zA-Z].{1,25}" v-model="user.firstName" required autofocus>
            </div>
          </div>
          <div class="input-group mb-3">
            <label class="col-md-5 col-sm-5 text-right">Last name <span class="require">*</span></label>
            <div class="col-md-7 col-sm-7 init-div">
              <input type="text" class="form-control custom-input" title="Must have atleast one character" pattern="[a-zA-Z].{1,25}" v-model="user.lastName" required>
            </div>
          </div>
          <div class="input-group mb-3">
            <label class="col-md-5 col-sm-5 text-right">Username <span class="require">*</span></label>
            <div class="col-md-7 col-sm-7 init-div">
              <input type="text" class="form-control custom-input" title="Must contain between 5 to 12 characters and no special characters allowed" pattern="[a-zA-Z0-9_.-]{5,25}"  v-model="user.username" disabled>
            </div>
          </div>
          <div class="input-group mb-3">
            <label class="col-md-5 col-sm-5 text-right">Company Name <span class="require">*</span></label>
            <div class="col-md-7 col-sm-7 init-div">
              <input type="text" class="form-control custom-input" title="Must contain between 5 to 50 characters and no special characters allowed" pattern="[a-zA-Z0-9_.- ]{5,50}"  v-model="user.organisation" required>
            </div>
          </div>
          <div class="input-group mb-3">
            <label class="col-md-5 col-sm-5 text-right">Company Website <span class="require">*</span></label>
            <div class="col-md-7 col-sm-7 init-div">
              <input type="text" class="form-control custom-input" title="This url not valid" pattern="[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)"  v-model="user.organisationWebsite" required>
            </div>
          </div>
          <div class="input-group mb-3">
            <label class="col-md-5 col-sm-5 text-right">Work Email <span class="require">*</span></label>
            <div class="col-md-7 col-sm-7 init-div">
              <input type="email" class="form-control custom-input" v-model="user.email" required>
            </div>
          </div>
          <!--<div class="input-group mb-3">-->
            <!--<label class="col-md-4 col-sm-4 text-right">Role <span class="require">*</span></label>-->
            <!--<div class="col-md-8 col-sm-8 init-div">-->
              <!--<b-form-radio-group-->
              <!--id="radio-group-1"-->
              <!--v-model="user.permissions"-->
              <!--:options="selectPermission"-->
              <!--name="radio-options"-->
              <!--required>-->
              <!--</b-form-radio-group>-->
            <!--</div>-->
          <!--</div>-->
          <div class="row init-div">
            <div class="col-md-4 col-sm-4">
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </b-card>
</template>
<script>
  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/index.css'
  export default {
    name: 'Userlist',
    components: { DatePicker },
    data () {
      return {
        membership: [
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
        ],
        err: '',
        selected_delete: false,
        selected_confirm: false,
        askingTrialUsers: 0,
        selectedTrialUserAskingMessage: '',
        selectedTrialUserExtendingDate: '',
        selected_edit: false,
        editable_user_admin: false,
        selected_userid: '',
        selected_userEmail: '',
        selectedUserExpendExpireDate: '',
        selectPermission: ['user', 'user_admin'],
        users: '',
        selected: 'Month',
        tableItems: [],
        items: [],
        tableFields: [
          {key: 'no', label: 'No', _style: 'width: 2%'},
          {key: 'avatar', label: '', _classes: 'text-center', _style: 'width: 5%'},
          {key: 'user', label: 'User', _style: 'width: 10%'},
          {key: 'email', label: 'Email', _style: 'width: 15%'},
          {key: 'firstname', label: 'First Name', _style: 'width: 9%'},
          {key: 'lastname', label: 'Last Name', _style: 'width: 8%'},
          {key: 'company', label: 'Company', _style: 'width: 8%'},
          {key: 'accountId', label: 'Account Id', _style: 'width: 8%'},
          {key: 'createdAt', label: 'CreatedAt', _style: 'width: 6%'},
          {key: 'updatedAt', label: 'UpdatedAt', _style: 'width: 6%'},
          // {key: 'country', _classes: 'text-center'},
          {key: 'payment', label: 'Membership', _classes: 'text-center', _style: 'width: 3%'},
          {key: 'permissions', label: 'Role', _classes: 'text-center', _style: 'width: 8%'},
          // {key: 'activity'},
          {key: 'expireDate', label: 'Expire Date', _classes: 'text-center', _style: 'width: 5%'},
          {key: 'action', label: 'Action', _classes: 'text-center', _style: 'width: 5%'}
        ],
        user: {
          userid: '',
          username: '',
          firstName: '',
          lastName: '',
          email: '',
          organisation: '',
          accountId: '',
          organisationWebsite: '',
          role: 'subscriber',
          createdAt: '',
          updatedAt: '',
          expireDate: '',
          invitedBy: '',
          planInfo: '',
          membership: '',
          trialDetails: {
          },
          token: '',
          permissions: ''
        }
      }
    },
    methods: {
      color (value) {
        let $color
        if (value <= 25) {
          $color = 'info'
        } else if (value > 25 && value <= 50) {
          $color = 'success'
        } else if (value > 50 && value <= 75) {
          $color = 'warning'
        } else if (value > 75 && value <= 100) {
          $color = 'danger'
        }
        return $color
      },
      getUsers () {
        this.$store.dispatch('getUsers')
          .then((response) => {
            this.users = response
            console.log(this.users)
            if (this.users.length !== 0) {
              this.setTableItems()
              this.setAskingTrialUsers()
            }
          })
          .catch((err) => {
            if (err.message === 'Forbidden') {
              this.error = 'The standards can be updated by only admin.'
            } else {
              if (err.message === 'Unauthorized') {
                this.$router.push('/login')
              } else {
                this.error = err.message
              }
            }
            this.loading = false
          })
      },
      editableUserAdminOk () {
        this.editable_user_admin = false
        this.selected_edit = true
      },
      btnAskingMessageClicked (userid) {
        this.selected_userid = userid
        const items = this.tableItems.find(({ userid }) => userid === this.selected_userid)
        this.user.userid = this.selected_userid
        this.selected_userEmail = items.email
        this.user.firstName = items.firstname
        this.user.lastName = items.lastname
        this.user.username = items.user
        this.user.email = items.email
        this.user.organisation = items.company
        this.user.accountId = items.accountId
        this.user.expireDate = items.expireDate
        this.user.membership = items.payment
        this.user.organisationWebsite = items.organisationWebsite
        this.user.permissions = items.permissions
        this.user.trialDetails = items.trialDetails
        this.selectedTrialUserAskingMessage = items.trialDetails.askExtendingExpireDates.askingMessage
        let oldDate = new Date(items.expireDate)
        let newDate = new Date()
        newDate.setDate(oldDate.getDate() + 7)
        let newMonth = '' + (newDate.getMonth() + 2)
        let newDay = '' + (newDate.getDate() + 1)
        let newYear = newDate.getFullYear()
        if (newMonth.length < 2) {
          newMonth = '0' + newMonth
        }
        if (newDay.length < 2) {
          newDay = '0' + newDay
        }
        this.selectedUserExpendExpireDate = [newYear, newMonth, newDay].join('-')
        this.selected_confirm = true
      },
      confirmAskingOk () {
        this.selected_confirm = false
        this.$store.dispatch('confirmExtendingExpireDate', {userId: this.selected_userid, userEmail: this.selected_userEmail})
          .then(resp => {
            this.$toastr.s('Extended the expiration date of the user successfully')
            this.getUsers()
          })
          .catch(err => {
            this.$toastr.e(err)
          })
      },
      confirmAskingCancel () {
        this.selected_confirm = false
      },
      deluserCancel () {
        this.selected_delete = false
        this.selected_userid = ''
      },
      deluserOk () {
        for (var i = 0; i < this.tableItems.length; i++) {
          if (this.tableItems[i].userid === this.selected_userid) {
            if (this.tableItems[i].userid === 'admin') {
              this.err = 'admin can not be deleted!'
              return
            }
            this.tableItems.splice(i, 1)
            i--
          }
        }
        this.$store.dispatch('deleteUser', this.selected_userid)
          .then(res => {
            this.$toastr.s('A user deleted successfully.')
            this.$router.push('/jas-admin/users')
          })
          .catch(err => {
            console.log('error:', err)
          })
        this.selected_delete = false
        this.selected_userid = ''
      },
      edituserOk () {
        if (this.user.firstName === '') {
          this.$toastr.e('Please check first name...')
          return
        }
        if (this.user.lastName === '') {
          this.$toastr.e('Please check last name...')
          return
        }
        if (this.user.email === '') {
          this.$toastr.e('Please check email...')
          return
        }
        if (this.user.organisation === '') {
          this.$toastr.e('Please check organisation...')
          return
        }
        if (this.user.organisationWebsite === '') {
          this.$toastr.e('Please check organisationWebsite...')
          return
        }
        for (let i = 0; i < this.tableItems.length; i++) {
          if (this.tableItems[i].userid === this.selected_userid) {
            this.tableItems[i].firstname = this.user.firstName
            this.tableItems[i].lastname = this.user.lastName
            this.tableItems[i].user = this.user.username
            this.tableItems[i].email = this.user.email
            this.tableItems[i].company = this.user.organisation
            this.tableItems[i].organisationWebsite = this.user.organisationWebsite
            if (this.tableItems[i].payment === 'TRIAL') {
              if (this.user.permissions === 'user_admin') {
                this.editable_user_admin = true
              }
            } else {
              this.editable_user_admin = false
            }
            this.tableItems[i].permissions = this.user.permissions
            if ((this.user.membership === 'TRIAL') && (this.user.trialDetails.askExtendingExpireDates.asking)) {
              if (this.selectedUserExpendExpireDate === '') {
                this.$toastr.e('Please check expending expire date...')
                return
              } else {
              }
            }
          }
        }
        if (!this.editable_user_admin) {
          this.$store.dispatch('editUser', this.user)
            .then(data => {
              this.$toastr.s('A user info updated successfully.')
              this.$router.push('/jas-admin/users')
            })
            .catch(err => {
              console.log('error:', err)
            })
        }
      },
      edituserCancel () {
        console.log('edit user cancel')
        this.selected_edit = false
        this.selected_userid = ''
      },
      edituser (userid) {
        this.selected_edit = true
        this.selected_userid = userid
        const items = this.tableItems.find(({ userid }) => userid === this.selected_userid)
        this.user.userid = this.selected_userid
        this.user.firstName = items.firstname
        this.user.lastName = items.lastname
        this.user.username = items.user
        this.user.email = items.email
        this.user.organisation = items.company
        this.user.accountId = items.accountId
        this.user.expireDate = items.expireDate
        this.user.membership = items.payment
        this.user.organisationWebsite = items.organisationWebsite
        this.user.permissions = items.permissions
        this.user.trialDetails = items.trialDetails
      },
      deleteuser (userid) {
        this.selected_delete = true
        this.selected_userid = userid
      },
      getAvatar (avatar) {
        // if (avatar) {
        //   return avatar
        // }
        return 'https://jasavatar.s3.us-east-2.amazonaws.com/avatar-placeholder.png'
      },
      getAccountId (accountId) {
        if (accountId === 0) {
          return ''
        } else {
          return accountId
        }
      },
      setAskingTrialUsers () {
        let count = 0
        for (let i = 0; i < this.users.length; i++) {
          if ((this.users[i].trialDetails.status === 1) && (this.users[i].trialDetails.askExtendingExpireDates.asking === true)) {
            count = count + 1
          }
        }
        this.askingTrialUsers = count
      },
      setTableItems () {
        this.tableItems = []
        for (let i = 0; i < this.users.length; i++) {
          let user = {
            index: i + 1,
            icon: {url: this.getAvatar(this.users[i].avatar), status: 'success'},
            user: this.users[i].username,
            new: true,
            registered: this.users[i].createdAt,
            firstname: this.users[i].firstName,
            lastname: this.users[i].lastName,
            email: this.users[i].email,
            permissions: this.getPermissions(i),
            company: this.users[i].organisation,
            accountId: this.getAccountId(this.users[i].accountId),
            organisationWebsite: this.users[i].organisationWebsite,
            createdAt: this.getDate(this.users[i].createdAt),
            updatedAt: this.getDate(this.users[i].updatedAt),
            payment: this.getMembership(i),
            expireDate: this.getExpireDate(i),
            userid: this.users[i]._id,
            trialDetails: this.users[i].trialDetails,
            askingDate: this.getAskingDate(i)
          }
          this.tableItems.push(user)
        }
      },
      getDate (strDateTime) {
        let strDate = strDateTime.split('T')
        return strDate[0]
      },
      getMembership (index) {
        if (this.users[index].parentAccount.hasParent) {
          return ''
        } else {
          return this.membership[this.users[index].membership].payment
        }
      },
      getExpireDate (index) {
        if (this.users[index].trialDetails.status === 0 && !this.users[index].parentAccount.hasParent) {
          return ''
        } else if (this.users[index].trialDetails.status === 1 && this.users[index].parentAccount.hasParent) {
          return ''
        } else if (this.users[index].trialDetails.status === 1 && !this.users[index].parentAccount.hasParent) {
          return this.users[index].trialDetails.endDate.split('T')[0]
        }
      },
      getAskingDate (index) {
        if (this.users[index].trialDetails.status === 0 && !this.users[index].parentAccount.hasParent) {
          return ''
        } else if (this.users[index].trialDetails.status === 1 && this.users[index].parentAccount.hasParent) {
          return ''
        } else if (this.users[index].trialDetails.status === 1 && !this.users[index].parentAccount.hasParent) {
          if (!this.users[index].trialDetails.askExtendingExpireDates.askingDate) {
            return ''
          }
          let fullDate = this.users[index].trialDetails.askExtendingExpireDates.askingDate.split('T')[0]
          let fullTime = this.users[index].trialDetails.askExtendingExpireDates.askingDate.split('T')[1]
          let simpleDate = fullDate.split('-')[1] + '-' + fullDate.split('-')[2]
          let simpleTime = fullTime.split(':')[0] + ':' + fullTime.split(':')[1]
          return (simpleDate + ' ' + simpleTime)
        }
      },
      getPermissions (index) {
        if (this.users[index].permissions.includes('admin')) {
          return 'admin'
        } else if (this.users[index].permissions.includes('user_admin')) {
          if (this.users[index].parentAccount.hasParent) {
            return 'sub-account'
          } else {
            return 'user_admin'
          }
        } else {
          if (this.users[index].parentAccount.hasParent) {
            return 'sub-account'
          } else {
            return 'user'
          }
        }
      }
    },
    mounted () {
      this.getUsers()
    }
  }
</script>
<style>
  .c-avatar {
    width: 28px;
    height: 24px;
    text-align: center;
  }

  .c-avatar-status {
    /*right: 0;*/
  }
  .c-avatar .c-avatar-status {
    width: 10px;
    height: 10px;
  }
  .c-avatar-status {
    position: absolute;
    /*bottom: 0;*/
    /*display: block;*/
    border: 1px solid #fff;
    border-radius: 50em;
  }

  .t-img-avatar {
    width: 28px;
    height: 24px;
  }
  .col-md-5.text-right .require {
    margin-left: 10px;
    color: #dc3636;
    margin-top: 6px;
  }
  .col-md-2.col-sm-2.text-right .require{
    margin-left: 10px;
    color: #dc3636;
    margin-top: 6px;
  }
  .col-md-1.col-sm-1.init-div.ask-expire-date input {
    background: #20a8d8;
    color: white;
  }
  .nav-item.b-nav-dropdown.dropdown show .dropdown-menu.dropdown-menu-right.show {
    width: 370px;
  }
</style>
