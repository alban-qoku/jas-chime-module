<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <Sidebar :navItems="nav"/>
      <main class="main">
        <b-button variant="primary" class="fixed-btn-meeting" v-if="meetingSession && (name.toUpperCase()!=='VIDEO MEETING')" @click='redirectToVideoMeeting()'>Click here to go to on-going video meeting</b-button>
        <breadcrumb :list="list"/>
        <div class="container-fluid">
          <router-view v-if="name.toUpperCase()!='VIDEO MEETING'"></router-view>
          <VideoMeeting :style="{'display':(name.toUpperCase()=='VIDEO MEETING')?'block':'none'}"/>
        </div>
      </main>
      <AppAside/>
    </div>
    <AppFooter v-if="name.toUpperCase()!='VIDEO MEETING'"/>
  </div>
</template>

<script>
  import nav from '../_nav'
  import { Header as AppHeader, Sidebar, Aside as AppAside, Footer as AppFooter, Breadcrumb } from '../components/'
  import VideoMeeting from '../components/videoMeeting'

  export default {
    name: 'full',
    components: {
      AppHeader,
      Sidebar,
      AppAside,
      AppFooter,
      Breadcrumb,
      VideoMeeting
    },
    data () {
      return {
        nav: nav.items
      }
    },
    computed: {
      meetingSession () {
        return this.$store.state.meetingSession
      },
      name () {
        return this.$route.name
      },
      list () {
        return this.$route.matched
      }
    },
    methods: {
      redirectToVideoMeeting () {
        if (this.$store.state.user.permissions.includes('admin')) {
          this.$router.push('/jas-admin/videomeeting')
        } else {
          this.$router.push('/schedule/videomeeting')
        }
      }
    },
    mounted () {
      window.onbeforeunload = function (e) {
        var storage = window.localStorage
        storage.clear()
      }
    }
  }
</script>
<style scoped>
.fixed-btn-meeting{
  position: fixed;
  top: 60px;
  right: 80px;
  height: 35px;
  z-index: 1019;
  border-radius: 10%;
}
</style>
