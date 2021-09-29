<template>
  <b-card>
    <b-list-group id="receive-message">
      <b-list-group-item
        href="#"
        v-for="item in messageList"
        v-bind:key="item.timestampMs"
      >
        <div :class="item.isSelf?'my-message':'peer-message'">
          {{item.name}}: {{item.message}}
        </div>
      </b-list-group-item>
    </b-list-group>
    <b-form-textarea
    id="send-message"
    placeholder="Type a message"
    rows="2"
    no-resize
    v-on:keyup.13="sendMessage"
  ></b-form-textarea>
  </b-card>  
</template>
<script>
import { DataMessage } from 'amazon-chime-sdk-js'
export default {
  name: 'ChatComponent',
  props: {
    meetingSession: Object
  },
  data () {
    return {
      DATA_MESSAGE_TOPIC: 'CHAT',
      DATA_MESSAGE_LIFETIME_MS: 300000,
      lastReceivedMessageTimestamp: 0,
      messageList: []
    }
  },
  methods: {
    async sendMessage (e) {
      var textAreaSendMessage = document.getElementById('send-message')
      if (e.shiftKey) {
        textAreaSendMessage.rows++
      } else {
        e.preventDefault()
        await this.handleMessage()
        textAreaSendMessage.rows = 1
      }
    },
    async handleMessage () {
      const textArea = document.getElementById('send-message')
      const textToSend = textArea.value.trim()
      if (!textToSend) {
        return
      }
      textArea.textContent = ''
      this.meetingSession.audioVideo.realtimeSendDataMessage(
        this.DATA_MESSAGE_TOPIC,
        textToSend,
        this.DATA_MESSAGE_LIFETIME_MS
      )
      // echo the message to the handler
      this.dataMessageHandler(
        new DataMessage(
          Date.now(),
          this.DATA_MESSAGE_TOPIC,
          new TextEncoder().encode(textToSend),
          this.meetingSession.configuration.credentials.attendeeId,
          this.meetingSession.configuration.credentials.externalUserId
        )
      )
    },
    async dataMessageHandler (dataMessage) {
      if (!dataMessage.throttled) {
        const isSelf =
          dataMessage.senderAttendeeId ===
          this.meetingSession.configuration.credentials.attendeeId
        if (dataMessage.timestampMs <= this.lastReceivedMessageTimestamp) {
          return
        }
        this.lastReceivedMessageTimestamp = dataMessage.timestampMs
        const messageDiv = document.getElementById('receive-message')
        let messageObj = {}
        messageObj.timestampMs = dataMessage.timestampMs
        messageObj.message = dataMessage.text()
        messageObj.name = isSelf ? 'You' : dataMessage.senderExternalUserId
          .split('#')
          .slice(-1)[0]
        messageObj.isSelf = isSelf
        this.messageList.push(messageObj)
        messageDiv.scrollTop = messageDiv.scrollHeight
      } else {
        console.log('Message is throttled. Please resend')
      }
    }
  },
  async mounted () {
    this.meetingSession.audioVideo.realtimeSubscribeToReceiveDataMessage(
      this.DATA_MESSAGE_TOPIC,
      (dataMessage) => {
        this.dataMessageHandler(dataMessage)
      }
    )
  }
}
</script>
<style scoped>
  .peer-message {
    text-align: left;
  }
  .my-message {
    text-align: right;
  }
</style>