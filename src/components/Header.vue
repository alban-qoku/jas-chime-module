<template>
  <header class="app-header navbar">
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">&#9776;</button>
    <b-link class="navbar-brand" to="/dashboard"></b-link>
    <button class="navbar-toggler sidebar-toggler d-md-down-none" type="button" @click="sidebarMinimize">&#9776;</button>
    <b-nav class="ml-auto">
      <div class="current-plan" v-if="!$store.state.user.parentAccount.hasParent">
        <div class="trial-plan">
          <p class="trial trial-class" v-if="user.subscriptionStatus === 0">
            <span v-if="user.trialRemainingDays > 0 ">
              {{user.trialRemainingDays}}
              {{user.trialRemainingDays === 1 ? ` Day ` : ' Days ' }}
                Left!
            </span>
            <span v-if="user.trialRemainingDays < 0 " class="trial-heading">
              TRIAL PERIOD EXPIRED
            </span>
            <router-link to="/account/payment">
              <button class="" type="button">Upgrade</button>
            </router-link>
          </p>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; margin-bottom: 2px">
        <b-nav class="ml-auto">
          <b-nav-item-dropdown right style="display: flex; justify-content: center; align-items: center;">
            <template slot="button-content">
              <i class="icon-bell"></i>
              <label style="color: red">{{countNotifications === 0 ?'' : countNotifications}}</label>
            </template>
            <b-dropdown-header tag="div" class="text-center"><strong>Notifications</strong></b-dropdown-header>
            <b-dropdown-item v-for="notification in notifications" :key="notification.index">
              <div class="row" style="justify-content: space-around;" @click="readNotification(notification._id, notification.redirectTo)">
                <label style="color: #20a8d8"><span style="margin-left: 5px">{{notification.description}}</span></label>
              </div>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-nav>
      </div>
      <b-nav-item-dropdown right style="display: flex; justify-content: center; align-items: center;">
        <template slot="button-content">
          <img :src="getAvatar(user.avatar)" class="img-avatar" alt="Profile Not Found">
          <span class="d-md-down-none">{{ fullName }}</span>
        </template>
        <b-dropdown-header tag="div" class="text-center"><strong>Account</strong></b-dropdown-header>
        <b-dropdown-item v-for="link in userLinks" :key="link.index">
          <router-link :to="link.uri">
            <i :class="link.class"></i> {{ link.name }}
          </router-link>
        </b-dropdown-item>
        <b-dropdown-item v-if="isUser">
          <router-link to="/account/payment"> <i class="fa fa-credit-card"></i> Billing </router-link>
        </b-dropdown-item>
        <b-dropdown-item v-if="isUser">
          <router-link to="/account/invite"> <i class="fa fa-user-plus"></i> Invite </router-link>
        </b-dropdown-item>
        <b-dropdown-item v-for="org in organisationData" :key="org.index">
          <div v-on:click = "toggleOrganisation(org.organisation)" style="color: #454545;" v-if="currentOrganisation == org.organisation"> <i class="fa fa-building-o" aria-hidden="true"></i> {{ org.organisation }} </div>
          <div v-on:click = "toggleOrganisation(org.organisation)" style="color: #20a8d8;" v-else> <i class="fa fa-building-o" aria-hidden="true"></i> {{ org.organisation }} </div>
        </b-dropdown-item>
        <b-dropdown-item>
          <b-link v-on:click="logout()"><i class="fa fa-lock"></i> Logout</b-link>
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-nav>
    <button class="navbar-toggler aside-menu-toggler d-md-down-none" type="button" >&#9776;</button>
  </header>
</template>
<script>
  import HeaderLinks from './header/HeaderLinks'
  import { mapState } from 'vuex'
  import { ToggleButton } from 'vue-js-toggle-button'
  import Vue from 'vue'
  Vue.use(ToggleButton)
  Vue.component('ToggleButton', ToggleButton)

  export default {
    name: 'header',
    computed: mapState({
      user: state => state.user,
      isLoggedIn: state => state.isLoggedIn
    }),
    data: function () {
      return {
        isSubscriber: true,
        isUser: true,
        userLinks: [],
        fullName: '',
        switchValue: true,
        currentOrganisation: '',
        organisationData: [],
        isTrial: this.$store.state.user.parentAccount.hasParent,
        notifications: [],
        countNotifications: 0,
        intervalId: '',
        intervalMeetingNotificationId: ''
      }
    },
    mounted: function () {
      this.getUserProfile()
      this.getNotifications()
      this.intervalId = window.setInterval(this.getNotifications, 15000)
      if (this.user.permissions.includes('admin')) {
        window.setInterval(this.getScheduleMeetings, 20000)
      }
    },
    watch: {
      isTrial: function () {
        location.reload()
      }
    },
    methods: {
      getNotifications () {
        this.$store.dispatch('getNotifications')
          .then(notifications => {
            this.notifications = notifications
            this.countNotifications = this.notifications.length
          })
          .catch(err => {
            if (err.message === 'Unauthorized') {
              this.$router.push('/login')
            } else {
              this.error = err.message
            }
          })
      },
      getScheduleMeetings () {
        this.$store.dispatch('getScheduleMeetings')
          .then(scheduleMeetings => {
            this.$store.dispatch('setScheduleNotifications', scheduleMeetings)
          })
          .catch(err => {
            if (err.message === 'Unauthorized') {
              this.$router.push('/login')
            } else {
              this.error = err.message
            }
          })
      },
      readNotification (id, redirectTo) {
        this.$store.dispatch('readNotification', {id: id})
          .then(resp => {
            this.countNotifications = this.countNotifications - 1
            this.$router.push(redirectTo)
          })
          .catch(err => {
            if (err.message === 'Unauthorized') {
              this.$router.push('/login')
            } else {
              this.error = err.message
            }
          })
      },
      getUserProfile () {
        this.$store.dispatch('getProfile')
          .then((response) => {
            this.user = response.user
            this.isSubscriber = true
            if (this.user.permissions.includes('admin')) {
              this.isUser = false
            }
            this.userLinks = HeaderLinks.userLinks
            this.fullName = `${this.user.firstName} ${this.user.lastName}`
            // now first check the organisation of the user
            if (response.user.organisation) {
              localStorage.organisation = response.user.organisation
              this.currentOrganisation = response.user.organisation
              // now set for organisations which invited the current user in drop  down
              let tmpOrganisation = {
                id: response.user._id,
                organisation: response.user.organisation
              }
              this.organisationData.push(tmpOrganisation)
            } else {
              if (response.organisation[0].organisation) {
                this.currentOrganisation = response.organisation[0].organisation
                localStorage.organisation = response.organisation[0].organisation
              } else {
                this.currentOrganisation = 'Set Organisation'
              }
            }
            if (response.organisation) {
              for (let i = 0; i < response.organisation.length; i++) {
                let tmpOrganisation = {
                  id: response.organisation[i]._id,
                  organisation: response.organisation[i].organisation
                }
                this.organisationData.push(tmpOrganisation)
              }
            }
          })
          .catch((err) => {
            this.error = err
            console.error(err)
          })
      },
      sidebarToggle (e) {
        e.preventDefault()
        document.body.classList.toggle('sidebar-hidden')
      },
      sidebarMinimize (e) {
        e.preventDefault()
        document.body.classList.toggle('sidebar-minimized')
      },
      mobileSidebarToggle (e) {
        e.preventDefault()
        document.body.classList.toggle('sidebar-mobile-show')
      },
      asideToggle (e) {
        e.preventDefault()
        document.body.classList.toggle('aside-menu-hidden')
      },
      logout () {
        this.$store.dispatch('logout')
          .then(() => this.$router.push('/login'))
      },
      getAvatar (avatar) {
        if (avatar) return avatar
        return 'static/img/avatars/avatar-placeholder.png'
      },
      toggleOrganisation (organisation) {
        localStorage.organisation = organisation
        this.currentOrganisation = organisation
      }
    }
    // computed: {
    //   isLoggedIn () {
    //     return this.$store.getters.isLoggedIn
    //   }
    // },
  }
</script>

<style>
  .app-header.navbar .navbar-brand {
    margin-left: 20px;
  }

  .aside-menu-toggler {
    margin-right: 20px;
  }
  .trial-heading{
    color:red;
  }
  p {
    font-weight: 600;
  }
  .trial-class{
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .toggle-button-class{
    margin-top: 10px;
    margin-right: 6px;
  }
</style>
