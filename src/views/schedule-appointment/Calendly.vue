<template>
  <div class="container">
    <div>
      <h3 class="title">Meeting List</h3>
      <div class='row init-div'>
      <div class='col-md-12 col-sm-12 init-div'>
        <table aria-busy='false' id='meetingList' aria-colcount='5' class='table b-table table-striped table-hover'>
          <thead class=''>
          <tr>
            <th aria-colindex='1' class='col-1 text-center' style='width:5%'>#</th>
            <th aria-colindex='2' class='col-3 text-center' style='width:17%'>Meeting Title</th>
            <th aria-colindex='4' class='col-3 text-center' style='width:17%'>Created Date</th>
            <th aria-colindex='5' class='col-3 text-center' style='width:17%'>Start Time</th>
            <th aria-colindex='6' class='col-3 text-center' style='width:17%'>End Time</th>
            <th aria-colindex='7' class='col-3 text-center' style='width:10%'>Action</th>
          </tr>
          </thead>
          <tbody class=''>
          <tr class='' v-for='(item, index) in meetingList'  v-bind:key='index'>
            <td aria-colindex='1' class='text-center'>{{index + 1}}</td>
            <td aria-colindex='2' class=''>{{item.MeetingTitle}}</td>
            <td aria-colindex='4' class=''>{{formatDate(item.CreatedAt)}}</td>
            <td aria-colindex='5' class=''>{{formatDate(item.ScheduleStartAt)}}</td>
            <td aria-colindex='6' class=''>{{formatDate(item.ScheduleEndAt)}}</td>
            <td aria-colindex='7' class=''><b-button variant="primary" class="meeting-list-btn-join" @click='joinVideoMeeting(item.TicketID)' :disabled="joinBtnClk || $store.state.meetingSession">Join</b-button></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
    <div v-if="currentCalendlyAppUrl !== ''">
      <vue-calendly :url="currentCalendlyAppUrl"  style="padding-top: -50px"></vue-calendly>
    </div>
  </div>
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
  name: 'Calendly',
  data () {
    return {
      currentCalendlyAppUrl: '',
      meetingList: [],
      joinBtnClk: false
    }
  },
  methods: {
    getCalendlyData () {
      this.$store.dispatch('getCalendlyData')
        .then(calendlyData => {
          this.currentCalendlyAppUrl = calendlyData.calendlyAppUrl
        })
        .catch(err => {
          if (err.message === 'Unauthorized') {
            this.$router.push('/login')
          } else {
            this.error = err.message
          }
        })
    },
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
          // console.log('RESPONSE:::', response)
          this.meetingList = response
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
    await this.getCalendlyData()
  }
}
</script>
<style>
  #Iframe ._3i0k6___Layout__cls1 ._2LpwQ___Wrapper__cls1 _1cMla___Wrapper__media-tablet-up _1P3Wz___Wrapper__media-desktop-up {
    padding-right: 0px!important;
    padding-left: 0px!important;
  }
  .calendly {
    height: 79vh!important;
  }

  #Iframe ._2LpwQ___Wrapper__cls1 _1cMla___Wrapper__media-tablet-up _1P3Wz___Wrapper__media-desktop-up {
    margin-top: 0px!important;
    margin-bottom: 0px!important;
  }
  .table-outline {
    border: none!important;
  }
  .meeting-list-td-align {
    text-align: center;
    vertical-align: center!important;
  }
  .meeting-list-btn-join {
    border-radius: 10%;
  }
</style>
