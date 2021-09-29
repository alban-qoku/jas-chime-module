<template>
  <div id="vueapp" class="vue-app">
    <kendo-scheduler :data-source="localDataSource"
                     :date="date"
                     :height="600"
                     :timezone="'Etc/UTC'"
                     @change="onChange"
                     @edit="onEdit"
                     @add="onAdd"
                     @cancel="onCancel"
                     @dataBound="onDataBound"
                     @move="onMove"
                     @navigate="onNavigate"
                     @resize="onResize"
                     @save="onSave">
      <kendo-scheduler-view :type="'day'"></kendo-scheduler-view>
      <kendo-scheduler-view :type="'workWeek'" :selected="true"></kendo-scheduler-view>
      <kendo-scheduler-view :type="'week'"></kendo-scheduler-view>
      <kendo-scheduler-view :type="'month'"></kendo-scheduler-view>
      <kendo-scheduler-view :type="'agenda'"></kendo-scheduler-view>
    </kendo-scheduler>
  </div>
</template>

<script>
  import { Scheduler } from '@progress/kendo-scheduler-vue-wrapper'
  import { mapState } from 'vuex'
  export default {
    components: {
      Scheduler
    },
    computed: mapState({
      scheduleDatas: state => state.scheduleNotifications
    }),
    watch: {
      scheduleDatas: function () {
        this.setScheduleSource()
      }
    },
    data: function () {
      return {
        date: new Date(),
        localDataSource: [
          // {
          //   id: 1,
          //   start: new Date('2020/10/6 08:00 AM'),
          //   end: new Date('2020/10/6 09:00 AM'),
          //   title: '15 min',
          //   description: 'giorgiebanoidze90@gmail.com'
          // },
          // {
          //   id: 2,
          //   start: new Date('2020/10/6 08:00 AM'),
          //   end: new Date('2020/10/6 09:00 AM'),
          //   title: '30 min',
          //   description: 'giorgiebanoidze90@gmail.com'
          // }
        ]
      }
    },
    methods: {
      onChange: function (ev) {
        console.log('Event :: change')
      },
      onEdit: function (ev) {
        console.log('Event :: edit')
      },
      onAdd: function (ev) {
        console.log('Event :: add')
      },
      onCancel: function (ev) {
        console.log('Event :: cancel')
      },
      onDataBound: function (ev) {
        console.log('Event :: dataBound')
      },
      onMove: function (ev) {
        console.log('Event :: move')
      },
      onNavigate: function (ev) {
        console.log('Event :: navigate')
      },
      onResize: function (ev) {
        console.log('Event :: resize')
      },
      onSave: function (ev) {
        let obj = {}
        obj.MeetingTitle = ev.event.title
        obj.MediaRegion = 'us-east-1'
        obj.CustomerID = ev.event.userId
        obj.ScheduleStartAt = ev.event.start
        obj.ScheduleEndAt = ev.event.end
        obj.ScheduleId = ev.event._id
        this.$store.dispatch('createMeetingRoom', obj)
          .then(resp => {
            this.$toastr.s(resp.message)
            this.$router.push('/jas-admin/meetinglist')
          })
          .catch(err => {
            if (err.message === 'Unauthorized') {
              this.$router.push('/login')
            } else {
              this.error = err.message
            }
          })
      },
      setScheduleSource: function () {
        // let scheduleDatas = this.$store.state.scheduleNotifications
        this.localDataSource = []
        for (let i = 0; i < this.scheduleDatas.length; i++) {
          let strStartTime = this.getStrTime(this.scheduleDatas[i].start_time)
          let strEndTime = this.getStrTime(this.scheduleDatas[i].end_time)
          let title = this.scheduleDatas[i].duration + 'min meeting'
          let item = {
            _id: this.scheduleDatas[i]._id,
            id: (i + 1),
            start: new Date(strStartTime),
            end: new Date(strEndTime),
            title: title,
            description: this.scheduleDatas[i].email,
            userId: this.scheduleDatas[i].userId
          }
          this.localDataSource.push(item)
        }
      },
      getStrTime (paramTime) { // 2020-10-08T12:30:00-04:00
        const strDate = paramTime.split('T')[0]
        const strTime = paramTime.split('T')[1].split('-')[0]
        let changedStrTime = strDate + ' ' + strTime
        return changedStrTime
      }
    },
    mounted: function () {
      this.setScheduleSource()
    }
  }
</script>

<style>
  .k-widget.k-scheduler.k-floatwrap {
    height: 79vh!important;
  }
</style>
