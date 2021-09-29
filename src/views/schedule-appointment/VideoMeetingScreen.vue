<template>
  <div id="video-meeting-component"></div>
</template>
<script>
export default {
  name: 'VideoMeetingScreen',
  data () {
    return {
    }
  },
  methods: {
  },
  async mounted () {
    console.log('MOUNTED Meeting')
    if (!this.$store.state.meetingSession) {
      this.$store.dispatch('setActiveMeetingCount', 0)
      if (this.$store.state.user.permissions.includes('admin')) {
        this.$router.push('/jas-admin/meetinglist')
      } else {
        this.$router.push('/schedule/appointment')
      }
    }
  }
}
</script>
<style scoped>

</style>
