<template>
  <b-card>
    <div class="row init-div">
      <div class="col-md-12 col-sm-12 init-div">
        <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
          <div v-if="$store.state.user.permissions.includes('admin')" style="margin-right: 10px">
            <button class="btn-primary" style="width: 110px" @click="editPrice"><span style="margin: 3px"><i class="fa fa-pencil fa-lg"></i></span>Edit Price</button>
          </div>
          <div v-if="$store.state.user.permissions.includes('user')" style="margin-right: 10px">
            <button class="btn-primary" style="width: 110px" @click="resetStandards"><span style="margin: 3px"><i class="icon-settings"></i></span>Reset</button>
          </div>
          <div>
            <button class="btn-primary" style="width: 110px" @click="saveMembership"><span style="margin: 3px"><i class="fa fa-save fa-lg"></i></span>Save</button>
          </div>
        </div>
        <table aria-busy="false" id="selecting_standards_table" aria-colcount="5" class="table b-table table-striped table-hover">
          <thead class="">
          <tr>
            <th aria-colindex="1" class="col-1 text-center" style="width:5%">#</th>
            <th aria-colindex="2" class="col-3 text-center" style="width:35%">Standards</th>
            <th aria-colindex="3" v-bind:class="getClassTrial()" style="width:15%">Trial</th>
            <th aria-colindex="4" v-bind:class="getClassSmall()" style="width:15%">Small</th>
            <th aria-colindex="5" v-bind:class="getClassMedium()" style="width:15%">Medium</th>
            <th aria-colindex="6" v-bind:class="getClassLarge()" style="width:15%">Large</th>
          </tr>
          </thead>
          <tbody class="">
          <tr class="" v-for="(item, index) in items"  v-bind:key="index">
            <td aria-colindex="1" class="text-center">{{index + 1}}</td>
            <td aria-colindex="2" class="">{{item.name}}</td>

            <td aria-colindex="4" class="text-center" ><input type="checkbox" :id="'trial' + index" v-model="item.trial" :checked="item.trial" :disabled="$store.state.user.permissions.includes('user')"></td>
            <td aria-colindex="4" class="text-center" ><input type="checkbox" :id="'small' + index" v-model="item.small" @change="changedCheck (index)" :checked="item.small" v-bind:disabled="setDisableSmall(item)"></td>
            <td aria-colindex="4" class="text-center" ><input type="checkbox" :id="'medium' + index" v-model="item.medium" :checked="item.medium" v-bind:disabled="setDisableMedium(item)"></td>
            <td aria-colindex="4" class="text-center" ><input type="checkbox" :id="'large' + index" v-model="item.large" :checked="item.large" v-bind:disabled="setDisableLarge(item)"></td>
          </tr>
          </tbody>
        </table>
        <b-row class="justify-content-center" v-if="loading">
          <h1><i class="fa fa-spinner fa-pulse fa-3x text-primary"></i></h1>
        </b-row>
      </div>
      <b-modal v-model="selected_editprice" lazy centered header-bg-variant="primary" title="Edit Membership Price"  @cancel="editPriceCancel"
               @ok="editPriceOk">

        <div class="row init-div">
          <div class="col-md-12 col-sm-12" style="justify-content: flex-end">
            <div class="input-group mb-3">
              <label class="col-md-4 col-sm-4 text-right">Small<span class="require">*</span></label>
              <div class="col-md-6 col-sm-6 init-div">
                <input type="number" class="form-control custom-input" title="Must have atleast one character" pattern="[a-zA-Z].{1,25}" required autofocus v-model="prices.small">
              </div>
              <label class="col-md-2 col-sm-2 text-left" style="margin-top: 5px">USD</label>
            </div>
            <div class="input-group mb-3">
              <label class="col-md-4 col-sm-4 text-right">Medium<span class="require">*</span></label>
              <div class="col-md-6 col-sm-6 init-div">
                <input type="number" class="form-control custom-input" title="Must have atleast one character" pattern="[a-zA-Z].{1,25}" required v-model="prices.medium">
              </div>
              <label class="col-md-2 col-sm-2 text-left" style="margin-top: 5px">USD</label>
            </div>
            <div class="input-group mb-3">
              <label class="col-md-4 col-sm-4 text-right">Large<span class="require">*</span></label>
              <div class="col-md-6 col-sm-6 init-div">
                <input type="number" class="form-control custom-input" title="Must contain between 5 to 12 characters and no special characters allowed" pattern="[a-zA-Z0-9_.-]{5,25}" required  v-model="prices.large">
              </div>
              <label class="col-md-2 col-sm-2 text-left" style="margin-top: 5px">USD</label>
            </div>
            <div class="row init-div">
              <div class="col-md-4 col-sm-4">
              </div>
            </div>
          </div>
        </div>
      </b-modal>
      <b-modal v-model="overSelected" lazy centered header-bg-variant="primary" id="overSelectedModal" title="How to select more standards?" @ok="handleOk">
        <div class="modal-text-center">
          <p>You can select only 2 standards as you please.</p>
        </div>
        <div class="modal-text-center">
        </div>
        <div class="modal-text-center">
          <p>If you want more standards, you have to select</p>
        </div>
        <div class="modal-text-center">
          <p><strong>$599</strong> or <strong>$999</strong></p>
        </div>
        <div class="modal-text-center">
          <router-link :to="'/account/payment'">
            <p>Go Payment</p>
          </router-link>
        </div>
      </b-modal>
      <b-modal v-model="reset_standards" lazy centered header-bg-variant="primary" id="resetStandardsModal" title="Reset Standards" @ok="handleResetStandardsOk" @cancel="handleResetStandardsCancel">
        <div class="modal-text-center">
          <p>You are about to reset the JAS Database back to original settings.</p>
        </div>
        <div class="modal-text-center">
        </div>
        <div class="modal-text-center">
          <p>Would you like to proceed?</p>
        </div>
      </b-modal>
    </div>
  </b-card>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'MembershipEdit',
    data () {
      return {
        selected: 'Month',
        selected_editprice: false,
        reset_standards: false,
        loading: true,
        items: [
        ],
        preItems: [
        ],
        items_cmmc: [
        ],
        originStandards: '',
        priceId: '',
        prices: {
          small: '',
          medium: '',
          large: ''
        },
        prices_confirm: {
          small: '',
          medium: '',
          large: ''
        },
        overSelected: false,
        error: '',
        selectedMembership: {
          small: 0,
          medium: 1,
          large: 2,
          trial: 3
        }
      }
    },
    computed: mapState({
      priceData: state => state.priceData
    }),
    methods: {
      getClassSmall () {
        if (this.$store.state.user.permissions.includes('user')) {
          if (this.$store.state.user.membership === this.selectedMembership.small) {
            return 'col-2 text-center selected-membership'
          } else {
            return 'col-2 text-center'
          }
        } else {
          return 'col-2 text-center'
        }
      },
      getClassMedium () {
        if (this.$store.state.user.permissions.includes('user')) {
          if (this.$store.state.user.membership === this.selectedMembership.medium) {
            return 'col-2 text-center selected-membership'
          } else {
            return 'col-2 text-center'
          }
        } else {
          return 'col-2 text-center'
        }
      },
      getClassLarge () {
        if (this.$store.state.user.permissions.includes('user')) {
          if (this.$store.state.user.membership === this.selectedMembership.large) {
            return 'col-2 text-center selected-membership'
          } else {
            return 'col-2 text-center'
          }
        } else {
          return 'col-2 text-center'
        }
      },
      getClassTrial () {
        if (this.$store.state.user.membership === this.selectedMembership.trial) {
          return 'col-2 text-center selected-membership'
        } else {
          return 'col-2 text-center'
        }
      },
      setDisableSmall (item) {
        if (this.$store.state.user.permissions.includes('user')) {
          if (!item.createMyself) {
            if (this.$store.state.user.membership === this.selectedMembership.small) {
              return false
            } else {
              return true
            }
          } else {
            return true
          }
        } else {
          return false
        }
      },
      setDisableMedium (item) {
        if (this.$store.state.user.permissions.includes('user')) {
          if (!item.createMyself) {
            if (this.$store.state.user.membership === this.selectedMembership.medium) {
              return false
            } else {
              return true
            }
          } else {
            return true
          }
        } else {
          return false
        }
      },
      setDisableLarge (item) {
        if (this.$store.state.user.permissions.includes('user')) {
          if (!item.createMyself) {
            if (this.$store.state.user.membership === this.selectedMembership.large) {
              return false
            } else {
              return true
            }
          } else {
            return true
          }
        } else {
          return false
        }
      },
      setDisableTrial (item) {
        if (!item.createMyself) {
          if (this.$store.state.user.membership === this.selectedMembership.trial) {
            return false
          } else {
            return true
          }
        } else {
          return true
        }
      },
      changedCheck (index) {
        if (this.$store.state.user.permissions.includes('user')) {
          let sumSmall = 0
          for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].small === true && this.items[i].createMyself === false) {
              sumSmall = sumSmall + 1
            }
          }
          if (sumSmall > 2) {
            this.items[index].small = false
            document.getElementById('small' + index).checked = false
            this.overSelected = true
          }
        }
      },
      handleOk () {
        this.overSelected = false
      },
      resetStandards () {
        this.reset_standards = true
      },
      handleResetStandardsOk () {
        this.reset_standards = false
        this.items = []
        this.items_cmmc = []
        this.preItems = []
        this.loading = true
        this.$store.dispatch('resetStandards')
          .then((response) => {
            this.getResetStandards(response.data)
            this.loading = false
            this.$toastr.s('All standards reset successfully.')
          })
          .catch(err => {
            this.$toastr.e(err.message)
          })
      },
      handleResetStandardsCancel () {
        this.reset_standards = false
      },
      editPrice () {
        this.prices = []
        this.getSatePriceData()
        this.selected_editprice = true
      },
      editPriceOk () {
        this.$store.dispatch('setPrice', this.prices)
        let updatePriceData = {
          id: this.priceId,
          small: this.prices.small,
          medium: this.prices.medium,
          large: this.prices.large
        }
        this.$store.dispatch('updatePrice', updatePriceData)
          .then((response) => {
            console.log(response)
            this.$toastr.s('Membership prices updated successfully.')
          })
          .catch(err => {
            this.error = err.message
          })
      },
      editPriceCancel () {
      },
      isEqual (data1, data2) {
        if (data1.name !== data2.name) {
          return false
        } else if (data1.trial !== data2.trial) {
          return false
        } else if (data1.small !== data2.small) {
          return false
        } else if (data1.medium !== data2.medium) {
          return false
        } else if (data1.large !== data2.large) {
          return false
        } else {
          return true
        }
      },
      saveMembership () {
        let resItems = []
        for (let m = 0; m < this.items.length; m++) {
          if (this.isEqual(this.items[m], this.preItems[m])) {
            continue
          } else {
            resItems.push(this.items[m])
          }
        }
        if (resItems.length !== 0) {
          let itemsRst = []
          for (let k = 0; k < resItems.length; k++) {
            let itemsRstTmp = {
              id: resItems[k].id,
              name: resItems[k].name,
              trial: resItems[k].trial,
              small: resItems[k].small,
              medium: resItems[k].medium,
              large: resItems[k].large
            }
            itemsRst.push(itemsRstTmp)
          }
          if (resItems[resItems.length - 1].name === 'CMMC') {
            itemsRst.slice(0, itemsRst.length - 1)
            itemsRst.length = itemsRst.length - 1
            for (let i = 0; i < this.items_cmmc.length; i++) {
              this.items_cmmc[i].trial = this.items[this.items.length - 1].trial
              this.items_cmmc[i].small = this.items[this.items.length - 1].small
              this.items_cmmc[i].medium = this.items[this.items.length - 1].medium
              this.items_cmmc[i].large = this.items[this.items.length - 1].large
            }
            for (let j = 0; j < this.items_cmmc.length; j++) {
              itemsRst.push(this.items_cmmc[j])
            }
          }
          let data = {membership: itemsRst}
          this.$store.dispatch('updateStandardsMembership', data)
            .then((response) => {
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
      getSatePriceData () {
        let prices = this.$store.state.priceData
        this.priceId = prices._id
        this.prices.small = prices.small
        this.prices.medium = prices.medium
        this.prices.large = prices.large
      },
      getOriginStandards () {
        this.items = []
        this.items_cmmc = []
        this.preItems = []
        this.$store.dispatch('getStandards')
          .then((response) => {
            this.originStandards = response
            if (this.originStandards.length !== 0) {
              if (this.$store.state.user.permissions.includes('admin')) {
                for (let k = 0; k < this.originStandards.length; k++) {
                  this.originStandards[k]['createMyself'] = false
                }
              }
              for (let i = 0; i < this.originStandards.length; i++) {
                if (this.originStandards[i].name.includes('CMMC')) {
                  let itemCmmc = {
                    id: this.originStandards[i]._id,
                    name: this.originStandards[i].name,
                    createMyself: this.originStandards[i].createMyself,
                    trial: this.originStandards[i].membership.trial,
                    small: this.originStandards[i].membership.small,
                    medium: this.originStandards[i].membership.medium,
                    large: this.originStandards[i].membership.large
                  }
                  this.items_cmmc.push(itemCmmc)
                  continue
                }
                let item = {
                  id: this.originStandards[i]._id,
                  name: this.originStandards[i].name,
                  createMyself: this.originStandards[i].createMyself,
                  trial: this.originStandards[i].membership.trial,
                  small: this.originStandards[i].membership.small,
                  medium: this.originStandards[i].membership.medium,
                  large: this.originStandards[i].membership.large
                }
                this.items.push(item)
              }
            }
            let itemCmmc = {
              id: this.items_cmmc[0].id,
              name: 'CMMC',
              createMyself: this.items_cmmc[0].createMyself,
              trial: this.items_cmmc[0].trial,
              small: this.items_cmmc[0].small,
              medium: this.items_cmmc[0].medium,
              large: this.items_cmmc[0].large
            }
            this.items.push(itemCmmc)
            for (let j = 0; j < this.items.length; j++) {
              let itemTemp = {
                id: this.items[j].id,
                name: this.items[j].name,
                createMyself: this.items[j].createMyself,
                trial: this.items[j].trial,
                small: this.items[j].small,
                medium: this.items[j].medium,
                large: this.items[j].large
              }
              this.preItems.push(itemTemp)
            }
            this.loading = false
          })
          .catch((err) => {
            if (err.message === 'Forbidden') {
              this.loading = false
              this.error = 'Standards fetching Error .'
            } else {
              if (err.message === 'Unauthorized') {
                this.loading = false
                this.$router.push('/login')
              } else {
                this.loading = false
                this.error = err.message
              }
            }
          })
      },
      getResetStandards (originStandards) {
        this.originStandards = originStandards
        if (this.originStandards.length !== 0) {
          for (let k = 0; k < this.originStandards.length; k++) {
            this.originStandards[k]['createMyself'] = false
          }
          for (let i = 0; i < this.originStandards.length; i++) {
            if (this.originStandards[i].name.includes('CMMC')) {
              let itemCmmc = {
                id: this.originStandards[i]._id,
                name: this.originStandards[i].name,
                createMyself: this.originStandards[i].createMyself,
                trial: this.originStandards[i].membership.trial,
                small: this.originStandards[i].membership.small,
                medium: this.originStandards[i].membership.medium,
                large: this.originStandards[i].membership.large
              }
              this.items_cmmc.push(itemCmmc)
              continue
            }
            let item = {
              id: this.originStandards[i]._id,
              name: this.originStandards[i].name,
              createMyself: this.originStandards[i].createMyself,
              trial: this.originStandards[i].membership.trial,
              small: this.originStandards[i].membership.small,
              medium: this.originStandards[i].membership.medium,
              large: this.originStandards[i].membership.large
            }
            this.items.push(item)
          }
        }
        let itemCmmc = {
          id: this.items_cmmc[0].id,
          name: 'CMMC',
          createMyself: this.items_cmmc[0].createMyself,
          trial: this.items_cmmc[0].trial,
          small: this.items_cmmc[0].small,
          medium: this.items_cmmc[0].medium,
          large: this.items_cmmc[0].large
        }
        this.items.push(itemCmmc)
        for (let j = 0; j < this.items.length; j++) {
          let itemTemp = {
            id: this.items[j].id,
            name: this.items[j].name,
            createMyself: this.items[j].createMyself,
            trial: this.items[j].trial,
            small: this.items[j].small,
            medium: this.items[j].medium,
            large: this.items[j].large
          }
          this.preItems.push(itemTemp)
        }
        this.loading = false
      }
    },
    mounted () {
      this.getSatePriceData()
      this.getOriginStandards()
    }
  }
</script>
<style>
  table, th, td {
    border: 1px solid black;
  }
  .modal-text-center {
    display: flex;
    justify-content: space-around;
  }
  .selected-membership {
    background: #20a8d8;
    color: #ffffff;
  }
  .tr-bkcolor {
    background: #00aced;
  }
</style>

