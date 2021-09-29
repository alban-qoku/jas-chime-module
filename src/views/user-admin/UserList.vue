<template>
  <b-card>
    <div class="alert alert-danger" v-if="err">
      <strong><i class="fa fa-warning"></i>{{err}}</strong> {{ error }}
    </div>
    <div style="display: flex; justify-content: flex-end; margin-bottom: 2px">
      <button class="btn-primary" @click="saveParentAccounts()">Save</button>
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
          <span v-if="item.user === $store.state.user.username"
                class="c-avatar-status"
                :class="`bg-${'success' || 'secondary'}`"
          ></span>
          <span v-else
                class="c-avatar-status"
                :class="`bg-${'warning' || 'secondary'}`"
          ></span>
        </div>
      </td>
      <td slot="payment" slot-scope="{item}">
        <div class="text-center" v-model="item.payment">
          {{item.payment}}
        </div>
      </td>
      <td slot="subaccount" slot-scope="{item}">
        <div v-if="item.userid === $store.state.user.id && item.payment === 'LARGE' && tableItems.length !== 1" style="text-align: center;">
          <span>Select All</span>
          <input type="checkbox" id="selectAllCheckBox" v-model="selected_all" @change="changedSelectAllCheck ()">
        </div>
        <div v-if="showCheckBox(item.index)" style="text-align: center;">
          <input type="checkbox" v-model="item.parentAccount.hasParent" :id="'chkSubAccount' + item.index" :checked="item.parentAccount.hasParent && membership[$store.state.user.membership].payment !== 'LARGE'" @change="changedCheck (item.index)" :disabled="item.parentAccount.hasParent && getParentId(item.parentAccount) !== $store.state.user.id">
        </div>
      </td>
      <!--<td slot="action" slot-scope="{item}">-->
        <!--<div v-if="item.permissions.includes('user')">-->
          <!--<span @click="edituser(item.userid)">-->
            <!--<i class="fa fa-pencil fa-lg"></i>-->
          <!--</span>-->
          <!--<span @click="deleteuser(item.userid)">-->
            <!--<i class="fa fa-trash fa-lg"></i>-->
          <!--</span>-->
        <!--</div>-->
      <!--</td>-->
    </CDataTable>
    <b-modal v-model="overSelected" lazy centered header-bg-variant="primary" id="overSelectedModal" title="How to have sub-accounts?" @ok="handleOk">
      <div v-if="setSubAccounts === 1" class="modal-text-center">
        <p>You can not have users as your sub accounts.</p>
      </div>
      <div v-if="setSubAccounts === 5" class="modal-text-center">
        <p>You can have only {{setSubAccounts}} users as your sub accounts.</p>
      </div>
      <div class="modal-text-center">
      </div>
      <div class="modal-text-center">
        <p>If you want to have more users, you have to select</p>
      </div>
      <div v-if="setSubAccounts === 1" class="modal-text-center">
        <p><strong>$599</strong> or <strong>$999</strong></p>
      </div>
      <div v-if="setSubAccounts === 5" class="modal-text-center">
        <p><strong>$999</strong></p>
      </div>
      <div class="modal-text-center">
        <router-link :to="'/account/payment'">
          <p>Go Payment</p>
        </router-link>
      </div>
    </b-modal>
    <b-modal v-model="selected_delete" lazy centered header-bg-variant="primary" id="deleteUserModal" title="Delete User"  @cancel="deluserCancel"
             @ok="deluserOk">
      <p>A selected user will be deleted for now.</p>
      <p>Do you wish to continue?</p>
    </b-modal>
    <b-modal v-model="selected_edit" lazy centered header-bg-variant="primary" id="editUserModal" title="Edit User"  @cancel="edituserCancel"
             @ok="edituserOk">

      <div class="row init-div">
        <div class="col-md-12 col-sm-12">
          <div class="input-group mb-3">
            <label class="col-md-4 col-sm-4 text-right">First Name <span class="require">*</span></label>
            <div class="col-md-8 col-sm-8 init-div">
              {{user.firstname}}
              <input type="text" class="form-control custom-input" title="Must have atleast one character" pattern="[a-zA-Z].{1,25}" v-model="user.firstName" required autofocus>
            </div>
          </div>
          <div class="input-group mb-3">
            <label class="col-md-4 col-sm-4 text-right">Last name <span class="require">*</span></label>
            <div class="col-md-8 col-sm-8 init-div">
              <input type="text" class="form-control custom-input" title="Must have atleast one character" pattern="[a-zA-Z].{1,25}" v-model="user.lastName" required>
            </div>
          </div>
          <div class="input-group mb-3">
            <label class="col-md-4 col-sm-4 text-right">Username <span class="require">*</span></label>
            <div class="col-md-8 col-sm-8 init-div">
              <input type="text" class="form-control custom-input" title="Must contain between 5 to 12 characters and no special characters allowed" pattern="[a-zA-Z0-9_.-]{5,25}"  v-model="user.username" required>
            </div>
          </div>
          <div class="input-group mb-3">
            <label class="col-md-4 col-sm-4 text-right">Company Name <span class="require">*</span></label>
            <div class="col-md-8 col-sm-8 init-div">
              <input type="text" class="form-control custom-input" title="Must contain between 5 to 50 characters and no special characters allowed" pattern="[a-zA-Z0-9_.- ]{5,50}"  v-model="user.organisation" required>
            </div>
          </div>
          <div class="input-group mb-3">
            <label class="col-md-4 col-sm-4 text-right">Company Website <span class="require">*</span></label>
            <div class="col-md-8 col-sm-8 init-div">
              <input type="text" class="form-control custom-input" title="This url not valid" pattern="[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)"  v-model="user.organisationWebsite" required>
            </div>
          </div>
          <div class="input-group mb-3">
            <label class="col-md-4 col-sm-4 text-right">Work Email <span class="require">*</span></label>
            <div class="col-md-8 col-sm-8 init-div">
              <input type="email" class="form-control custom-input" v-model="user.email" required>
            </div>
          </div>
          <div class="input-group mb-3">
            <label class="col-md-4 col-sm-4 text-right">Role <span class="require">*</span></label>
            <div class="col-md-8 col-sm-8 init-div">
              <b-form-radio-group
                id="radio-group-1"
                v-model="user.permissions"
                :options="selectPermission"
                name="radio-options"
                required>
              </b-form-radio-group>
            </div>
          </div>
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
  export default {
    name: 'Userlist',
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
        selected_edit: false,
        selected_all: false,
        selected_userid: '',
        selectPermission: ['user', 'user_admin'],
        users: '',
        overSelected: false,
        setSubAccounts: '',
        selected: 'Month',
        tableItems: [],
        items: [],
        tableFields: [
          {key: 'no', label: 'No', _style: 'width: 2%'},
          {key: 'avatar', label: '', _classes: 'text-center', _style: 'width: 5%'},
          {key: 'user', label: 'User', _style: 'width: 13%'},
          {key: 'email', label: 'Email', _style: 'width: 21%'},
          {key: 'firstname', label: 'First Name', _style: 'width: 8%'},
          {key: 'lastname', label: 'Last Name', _style: 'width: 8%'},
          {key: 'company', label: 'Company', _style: 'width: 10%'},
          {key: 'createdAt', label: 'CreatedAt', _style: 'width: 7%'},
          {key: 'updatedAt', label: 'UpdatedAt', _style: 'width: 7%'},
          // {key: 'country', _classes: 'text-center'},
          {key: 'payment', label: 'Membership', _classes: 'text-center', _style: 'width: 5%'},
          {key: 'permissions', label: 'Role', _classes: 'text-center', _style: 'width: 9%'},
          // {key: 'activity'},
          {key: 'subaccount', label: 'Sub Account', _classes: 'text-center', _style: 'width: 4%'}
          // {key: 'action', label: 'Action', _classes: 'text-center', _style: 'width: 5%'}
        ],
        user: {
          userid: '',
          username: '',
          firstName: '',
          lastName: '',
          email: '',
          organisation: '',
          organisationWebsite: '',
          role: 'subscriber',
          createdAt: '',
          updatedAt: '',
          invitedBy: '',
          planInfo: '',
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
        this.$store.dispatch('getCompanyUsers')
          .then((response) => {
            this.users = response
            if (this.users.length !== 0) {
              this.setTableItems()
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
      deluserCancel () {
        console.log('delete user cancel')
        this.selected_delete = false
        this.selected_userid = ''
      },
      deluserOk () {
        console.log('delete user ok')
        for (var i = 0; i < this.tableItems.length; i++) {
          if (this.tableItems[i].userid === this.selected_userid) {
            if (this.tableItems[i].userid === 'user_admin') {
              console.log(this.tableItems[i].userid)
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
            this.$router.push('/user-admin/userlist')
          })
          .catch(err => {
            console.log('error:', err)
          })
        this.selected_delete = false
        this.selected_userid = ''
      },
      edituserOk () {
        console.log('edit user ok')
        console.log(this.user.permissions)
        for (let i = 0; i < this.tableItems.length; i++) {
          if (this.tableItems[i].userid === this.selected_userid) {
            this.tableItems[i].firstname = this.user.firstName
            this.tableItems[i].lastname = this.user.lastName
            this.tableItems[i].user = this.user.username
            this.tableItems[i].email = this.user.email
            this.tableItems[i].company = this.user.organisation
            this.tableItems[i].organisationWebsite = this.user.organisationWebsite
            this.tableItems[i].permissions = this.user.permissions
          }
        }
        this.$store.dispatch('editUser', this.user)
          .then(data => {
            this.$toastr.s('A user info updated successfully.')
          })
          .catch(err => {
            console.log('error:', err)
          })
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
        this.user.organisationWebsite = items.organisationWebsite
        this.user.permissions = items.permissions
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
      showCheckBox (index) {
        if (!this.tableItems[index - 1].permissions.includes('user_admin')) {
          return true
        } else {
          if (this.tableItems[index - 1].membership < this.$store.state.user.membership) {
            return true
          }
        }
      },
      changedSelectAllCheck () {
        if (this.selected_all) {
          for (let i = 0; i < this.tableItems.length; i++) {
            if (this.tableItems[i].userid === this.$store.state.user.id) {
              continue
            }
            this.tableItems[i].parentAccount.hasParent = true
            document.getElementById('chkSubAccount' + (i + 1)).checked = true
          }
        } else {
          for (let i = 0; i < this.tableItems.length; i++) {
            if (this.tableItems[i].userid === this.$store.state.user.id) {
              continue
            }
            this.tableItems[i].parentAccount.hasParent = false
            document.getElementById('chkSubAccount' + (i + 1)).checked = false
          }
        }
      },
      changedCheck (index) {
        this.tableItems[index - 1].parentAccount.parentId = this.$store.state.user.id
        let sumParenAccounts = 0
        for (let i = 0; i < this.tableItems.length; i++) {
          if (this.tableItems[i].parentAccount.hasParent && this.getParentId(this.tableItems[i].parentAccount) === this.$store.state.user.id) {
            sumParenAccounts = sumParenAccounts + 1
          }
        }
        if (this.$store.state.user.membership === 0) {
          if (sumParenAccounts > 0) {
            this.tableItems[index - 1].parentAccount.hasParent = false
            document.getElementById('chkSubAccount' + index).checked = false
            this.tableItems[index - 1].parentAccount.parentId = ''
            this.setSubAccounts = 1
            this.overSelected = true
          }
        } else if (this.$store.state.user.membership === 1) {
          if (sumParenAccounts > 5) {
            this.tableItems[index - 1].parentAccount.hasParent = false
            document.getElementById('chkSubAccount' + index).checked = false
            this.tableItems[index - 1].parentAccount.parentId = ''
            this.setSubAccounts = 5
            this.overSelected = true
          }
        }
      },
      handleOk () {
        this.overSelected = false
      },
      saveParentAccounts () {
        let resItems = []
        for (let i = 0; i < this.tableItems.length; i++) {
          if (this.tableItems[i].parentAccount.hasParent === this.users[i].parentAccount.hasParent) {
            continue
          } else {
            if (this.tableItems[i].parentAccount.hasParent) {
              let item = {
                userid: this.tableItems[i].userid,
                accountId: this.$store.state.user.accountId,
                parentAccount: {
                  hasParent: true,
                  parentId: this.$store.state.user.id,
                  parentMembership: this.$store.state.user.membership
                }
              }
              resItems.push(item)
            } else {
              let item = {
                userid: this.tableItems[i].userid,
                accountId: 0,
                parentAccount: {
                  hasParent: false
                }
              }
              resItems.push(item)
            }
          }
        }
        if (resItems.length !== 0) {
          let data = {parentAccount: resItems}
          this.$store.dispatch('updateUsersParentAccount', data)
            .then((response) => {
              location.reload()
              this.$toastr.s('Saved successfully.')
              console.log(response)
            })
            .catch((err) => {
              if (err.message === 'Unauthorized') {
                this.$router.push('/login')
              } else {
                this.error = err
              }
            })
        } else {
          this.$toastr.w('no changes')
        }
      },
      setTableItems () {
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
            organisationWebsite: this.users[i].organisationWebsite,
            // country: {name: 'USA', flag: 'cif-us'},
            // usage: {value: 60, period: this.users[i].createdAt},
            createdAt: this.getDate(this.users[i].createdAt),
            updatedAt: this.getDate(this.users[i].updatedAt),
            payment: this.getMembership(i),
            membership: this.users[i].membership,
            // role: this.users[i].permissions[0],
            // activity: '10 sec ago',
            parentAccount: {
              hasParent: this.users[i].parentAccount.hasParent,
              parentId: this.getParentId(this.users[i].parentAccount)
            },
            userid: this.users[i]._id
          }
          this.tableItems.push(user)
        }
      },
      getParentId (parentAccount) {
        if (parentAccount.hasParent) {
          return parentAccount.parentId
        } else {
          return ''
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
      getPermissions (index) {
        if (this.users[index].parentAccount.hasParent) {
          return 'sub-account'
        }
        if (this.users[index].permissions.includes('admin')) {
          return 'admin'
        } else if (this.users[index].permissions.includes('user_admin')) {
          return 'user_admin'
        } else {
          return 'user'
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
  /*.mb-0.table-outline th{*/
  /*width: 15%;*/
  /*}*/
</style>
