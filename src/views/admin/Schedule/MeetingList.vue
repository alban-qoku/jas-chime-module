<template>
  <b-card>
    <div class='row init-div'>
      <div class='col-md-12 col-sm-12 init-div'>
        <table aria-busy='false' id='meetingList' aria-colcount='5' class='table b-table table-striped table-hover'>
          <thead class=''>
          <tr>
            <th aria-colindex='1' class='col-1 text-center' style='width:5%'>#</th>
            <th aria-colindex='2' class='col-3 text-center' style='width:17%'>Meeting Title</th>
            <th aria-colindex='3' class='col-3 text-center' style='width:17%'>Customer Name</th>
            <th aria-colindex='4' class='col-3 text-center' style='width:17%'>Created Date</th>
            <th aria-colindex='5' class='col-3 text-center' style='width:17%'>Start Time</th>
            <th aria-colindex='6' class='col-3 text-center' style='width:17%'>End Time</th>
            <th aria-colindex='7' class='col-3 text-center' style='width:10%'>Action</th>
          </tr>
          </thead>
          <tbody class=''>
          <tr class='' v-for='(item, index) in items'  v-bind:key='index'>
            <td aria-colindex='1' class='meeting-list-td-align' style="vertical-align: center!important;">{{index + 1}}</td>
            <td aria-colindex='2' class='meeting-list-td-align' style="vertical-align: center!important;">{{item.MeetingTitle}}</td>
            <td aria-colindex='3' class='meeting-list-td-align' style="vertical-align: center!important;">{{item.CustomerName}}</td>
            <td aria-colindex='4' class='meeting-list-td-align' style="vertical-align: center!important;">{{formatDate(item.CreatedAt)}}</td>
            <td aria-colindex='5' class='meeting-list-td-align' style="vertical-align: center!important;">{{formatDate(item.ScheduleStartAt)}}</td>
            <td aria-colindex='6' class='meeting-list-td-align' style="vertical-align: center!important;">{{formatDate(item.ScheduleEndAt)}}</td>
            <td aria-colindex='7' class="meeting-list-td-align" style="vertical-align: center!important;"><b-button variant="primary" class="meeting-list-btn-join" @click='joinVideoMeeting(item.TicketID)' :disabled="joinBtnClk || $store.state.meetingSession">Join</b-button></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </b-card>
</template>
<script>
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration
} from 'amazon-chime-sdk-js'

export default {
  name: 'MeetingList',
  data: () => ({
    items: [],
    joinBtnClk: false
  }),
  methods: {
    addZero (value) {
      return ('0' + value).slice(-2)
    },
    formatDate (value) {
      if (value) {
        const dt = new Date(value)
        return `${this.addZero(dt.getDate())}/${this.addZero(dt.getMonth() + 1)}/${dt.getFullYear()} ${dt.getHours()}:${dt.getMinutes()}`
      }
      return ''
    },
    async getMeetingList () {
      this.$store.dispatch('getMeetings')
        .then((response) => {
          // this.$toastr.s('All Video Meeting list success')
          console.log('RESPONSE:::', response)
          this.items = response
        })
        .catch((err) => {
          if (err.message === 'Unauthorized') {
            this.$router.push('/login')
          } else {
            this.error = err.message
          }
        })
    },
    async joinVideoMeeting (ticketId) {
      this.joinBtnClk = true
      this.$store.dispatch('joinVideoMeeting', ticketId)
        .then((response) => {
          this.videoMeetingSession(response, ticketId)
        })
        .catch((err) => {
          if (err.message === 'Unauthorized') {
            this.$router.push('/login')
          } else {
            this.error = err.message
          }
        })
    },
    async videoMeetingSession (data, ticketId) {
      let meetingDetails = JSON.parse(data)
      const logger = new ConsoleLogger('SDK', LogLevel.INFO)
      let meetingSess = new DefaultMeetingSession(
        new MeetingSessionConfiguration(
          meetingDetails.Meeting,
          meetingDetails.Attendee
        ),
        logger,
        new DefaultDeviceController(logger)
      )

      this.$store.dispatch('setMeetingSession', meetingSess)
      this.$store.dispatch('setTicketId', ticketId)

      this.$router.push({
        path: 'videomeeting'
      })
    }
  },
  async mounted () {
    await this.getMeetingList()
  },
  async created () {
  }
}
</script>
<style>
  .meeting-list-btn-join {
    border-radius: 10%;
  }
  .meeting-list-td-align {
    text-align: center;
    vertical-align: center!important;
  }
</style>
