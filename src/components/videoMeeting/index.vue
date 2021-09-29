<template>
  <div style="position: relative">
  <div class="container">
    <audio id="meeting-audio" style="display: none"></audio>
    <div class="video-screen-white-border">
      <div class="video-position">
        <video
            id="screen-share-video"
            crossOrigin="anonymous"
            style="display: none"
            class="video-screen"
          ></video>
        <video id="other-video" class="video-screen">
        </video>
        <video id="my-video" class="video-my-screen">
        </video>
      </div>
      <div class="video-footer">
        <div class="drop-down-btn-position"><b-button id="microphone-button" class="video-meeting-btn-radius feat-btn-static-color" v-b-tooltip.hover title="Toggle Microphone" @click="micToggle('microphone-button')"><i class="icon-microphone"></i></b-button><ejs-dropdownbutton id="microphone-button-drop" :items='audioInputDevices' class="video-meeting-btn-drop-down feat-btn-static-color" :select="audioInputDeviceChanged" :disabled="!buttonStates['microphone-button']"><i class="icon-check"></i></ejs-dropdownbutton></div>
        <div class="drop-down-btn-position"><b-button id="camera-button" class="video-meeting-btn-radius feat-btn-static-color" v-b-tooltip.hover title="Toggle Camera" @click="cameraToggle('camera-button')"><i class="icon-camrecorder"></i></b-button><ejs-dropdownbutton id="camera-button-drop" :items='videoInputDevices' class="video-meeting-btn-drop-down feat-btn-static-color" :select="videoInputDeviceChanged" :disabled="!buttonStates['camera-button']"><i class="icon-check"></i></ejs-dropdownbutton></div>
        <b-button id="screen-share-button" class="video-meeting-btn-radius feat-btn-click-color" v-b-tooltip.hover title="Screen Share" @click="screenShareToggle('screen-share-button')"><i class="icon-screen-desktop"></i></b-button>
        <div class="drop-down-btn-position"><b-button id="speaker-button" class="video-meeting-btn-radius feat-btn-static-color" v-b-tooltip.hover title="Toggle Speaker" @click="speakerToggle('speaker-button')"><i class="icon-volume-2"></i></b-button><ejs-dropdownbutton id="speaker-button-drop" :items='audioOutputDevices' class="video-meeting-btn-drop-down feat-btn-static-color" :select="audioOutputDeviceChanged" :disabled="!buttonStates['speaker-button']"><i class="icon-check"></i></ejs-dropdownbutton></div>
        <b-button id="chat-button" class="video-meeting-btn-radius feat-btn-static-color" v-b-tooltip.hover title="Text Chat" @click="chatToggle()"><i class="icon-speech"></i></b-button>
        <b-button v-b-tooltip.hover class="video-meeting-btn-radius call-end-btn-color" title="Leave Call" @click="leaveVideoMeeting"><i class="icon-logout"></i></b-button>
        <b-button v-if="$store.state.user.permissions.includes('admin')" v-b-tooltip.hover class="video-meeting-btn-radius call-end-btn-color" title="Call End" @click="closeVideoMeeting"><i class="icon-call-end"></i></b-button>
      </div>
    </div>
    <b-modal v-model="showLeaveModal" lazy centered header-bg-variant="primary" no-close-on-backdrop no-close-on-esc id="deleteLeaveModal" title="Leave Video Meeting?"  @cancel="handleLeaveCallCancel"
             @ok="handleLeaveCallOk">
      <h5>Would you really want to leave this video meeting now?</h5>
      <br>
    </b-modal>
    <b-modal v-model="showCloseModal" lazy centered header-bg-variant="primary" no-close-on-backdrop no-close-on-esc id="deleteUserModal" title="End Video Meeting?"  @cancel="handleCloseCallCancel"
             @ok="handleCloseCallOk">
      <h5>Would you really want to end this video meeting now?</h5>
      <br>
    </b-modal>
  </div>
    <beautiful-chat
      class="text-chat-position"
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :open="openChat"
      :showEmoji="true"
      :showFile="true"
      :showEdition="true"
      :showDeletion="true"
      :deletionConfirmation="true"
      :showTypingIndicator="showTypingIndicator"
      :showLauncher="false"
      :showCloseButton="true"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :disableUserListToggle="false"
      @onType="handleOnType"
      @edit="editMessage" >
      <template v-slot:header>
        <div style="font-size: 25px;">
          Chat
        </div>
      </template>
      <template v-slot:user-avatar="{ message }">
      <div style="line-height:25px;text-align:center;margin: 5px;" v-if="message">
        {{message.name?message.name:"You"}}:
      </div>
    </template>
    </beautiful-chat>
  </div>
</template>
<script>
import {
  DefaultModality,
  MeetingSessionStatusCode
  // DataMessage
} from 'amazon-chime-sdk-js'
import { mapState } from 'vuex'

export default {
  name: 'VideoMeeting',
  computed: mapState({
    meetingSession: state => state.meetingSession,
    ticketId: state => state.ticketId,
    activeMeetingCount: state => state.activeMeetingCount
  }),
  watch: {
    meetingSession: function (meetingSession) {
      if (!this.meetingSession) {
        this.$store.dispatch('setActiveMeetingCount', 0)
      } else {
        this.participants.push({id: this.meetingSession.configuration.credentials.attendeeId, name: 'You'})
        this.populateAllDeviceLists()
      }
    }
  },
  data () {
    return {
      observer: null,
      selectedAudioInputDevice: null,
      selectedVideoInputDevice: null,
      selectedAudioOutputDevice: null,
      audioInputDevices: [],
      videoInputDevices: [],
      audioOutputDevices: [],
      buttonStates: {
        'microphone-button': true,
        'camera-button': true,
        'speaker-button': true,
        'screen-share-button': false,
        'chat-button': true
      },
      showLeaveModal: false,
      showCloseModal: false,
      tileMap: {},
      peerScreenSharing: false,
      peerScreenSharingTileId: null,
      screenSharing: false,
      screenSharingTileId: null,
      screenSharingIds: [],
      alwaysScrollToBottom: false,
      DATA_MESSAGE_TOPIC: 'CHAT',
      DATA_MESSAGE_LIFETIME_MS: 300000,
      lastReceivedMessageTimestamp: 0,
      chatTitle: '',
      attendeePresenceSet: new Set(),
      attendeeCallback: null,
      participants: [],
      titleImageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      messageList: [], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: false, // to determine whether the chat window should be open or closed
      showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        launcher: {
          bg: '#4e8cff'
        },
        messageList: {
          bg: '#ffffff'
        },
        sentMessage: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222'
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867'
        }
      }
    }
  },
  methods: {
    displayButtonStates () {
      for (const button in this.buttonStates) {
        const element = document.getElementById(button)
        const on = this.buttonStates[button]
        element.classList.add(on ? 'feat-btn-static-color' : 'feat-btn-click-color')
        element.classList.remove(on ? 'feat-btn-click-color' : 'feat-btn-static-color')
        const drop = document.getElementById(`${button}-drop`)
        if (drop) {
          drop.classList.add(on ? 'feat-btn-static-color' : 'feat-btn-click-color')
          drop.classList.remove(on ? 'feat-btn-click-color' : 'feat-btn-static-color')
        }
      }
    },
    toggleButton (button) {
      this.buttonStates[button] = !this.buttonStates[button]
      this.displayButtonStates()
      return this.buttonStates[button]
    },
    micToggle (button) {
      if (this.toggleButton(button)) {
        this.meetingSession.audioVideo.realtimeUnmuteLocalAudio()
      } else {
        this.meetingSession.audioVideo.realtimeMuteLocalAudio()
      }
    },
    async cameraToggle (button) {
      if (this.toggleButton(button)) {
        await this.meetingSession.audioVideo.chooseVideoInputDevice(this.selectedVideoInputDevice.deviceId)
        this.meetingSession.audioVideo.startLocalVideoTile()
      } else {
        await this.meetingSession.audioVideo.chooseVideoInputDevice(null)
        this.meetingSession.audioVideo.stopLocalVideoTile()
      }
    },
    async speakerToggle (button) {
      if (this.toggleButton(button)) {
        await this.meetingSession.audioVideo.bindAudioElement(
          document.getElementById('meeting-audio')
        )
      } else {
        await this.meetingSession.audioVideo.unbindAudioElement()
      }
    },
    async screenShareToggle (button) {
      if (this.toggleButton(button)) {
        this.meetingSession.audioVideo.startContentShareFromScreenCapture()
      } else {
        this.meetingSession.audioVideo.stopContentShare()
      }
    },
    async chatToggle () {
      if (this.isChatOpen === true) {
        this.isChatOpen = false
      } else {
        this.isChatOpen = true
      }
      this.newMessagesCount = 0
    },
    async audioInputDeviceChanged (e) {
      await this.meetingSession.audioVideo.chooseAudioInputDevice(e.item.deviceId)
    },
    async videoInputDeviceChanged (e) {
      this.selectedVideoInputDevice = e.item
      await this.meetingSession.audioVideo.chooseVideoInputDevice(e.item.deviceId)
    },
    async audioOutputDeviceChanged (e) {
      await this.meetingSession.audioVideo.chooseAudioOutputDevice(e.item.deviceId)
    },
    async leaveVideoMeeting () {
      this.showLeaveModal = true
    },
    handleLeaveCallOk () {
      this.showLeaveModal = false
      this.$toastr.s('You Left the Video Meeting')
      this.meetingSession.audioVideo.stop()
      // this.meetingSession = null
      // this.ticketId = null
      this.$store.dispatch('setMeetingSession', null)
      this.$store.dispatch('setTicketId', null)
      this.redirectAfterMeetingEnded()
    },
    handleLeaveCallCancel () {
      this.showLeaveModal = false
    },
    async closeVideoMeeting () {
      this.showCloseModal = true
    },
    handleCloseCallOk () {
      this.showCloseModal = false
      if (this.$store.state.user.permissions.includes('admin')) {
        let obj = {}
        obj.ticketID = this.ticketId
        this.$store.dispatch('closeVideoMeeting', obj)
          .then((response) => {
            this.meetingSession.audioVideo.stop()
            // this.meetingSession = null
            // this.ticketId = null
            this.$store.dispatch('setMeetingSession', this.meetingSession)
            this.$store.dispatch('setTicketId', this.ticketId)
          })
          .catch((err) => {
            if (err.message === 'Unauthorized') {
              this.$router.push('/login')
            } else {
              this.error = err.message
            }
          })
      } else {
        this.$toastr.s('You Left the Video Meeting')
        this.meetingSession.audioVideo.stop()
        // this.meetingSession = null
        // this.ticketId = null
        this.$store.dispatch('setMeetingSession', this.meetingSession)
        this.$store.dispatch('setTicketId', this.ticketId)
      }
    },
    handleCloseCallCancel () {
      this.showCloseModal = false
    },
    redirectAfterMeetingEnded () {
      if (this.$store.state.user.permissions.includes('admin')) {
        this.$router.push('/jas-admin/meetinglist')
      } else {
        this.$router.push('/schedule/appointment')
      }
    },
    async initializeData () {
      this.selectedAudioInputDevice = null
      this.selectedVideoInputDevice = null
      this.selectedAudioOutputDevice = null
      this.audioInputDevices = []
      this.videoInputDevices = []
      this.audioOutputDevices = []
      this.buttonStates = {
        'microphone-button': true,
        'camera-button': true,
        'speaker-button': true,
        'screen-share-button': false,
        'chat-button': true
      }
      this.showLeaveModal = false
      this.showCloseModal = false
      this.tileMap = {}
      this.peerScreenSharing = false
      this.peerScreenSharingTileId = null
      this.screenSharing = false
      this.screenSharingTileId = null
      this.screenSharingIds = []
      this.alwaysScrollToBottom = false
      this.lastReceivedMessageTimestamp = 0
      this.chatTitle = ''
      this.attendeePresenceSet = new Set()
      this.participants = []
      this.messageList = []
      this.newMessagesCount = 0
      this.isChatOpen = false
      this.showTypingIndicator = ''
      this.displayButtonStates()
    },
    async populateAllDeviceLists () {
      if (this.activeMeetingCount === 0) {
        this.initializeData()
        const tempAudioInputDevices = await this.meetingSession.audioVideo.listAudioInputDevices()
        await tempAudioInputDevices.forEach(mediaDeviceInfo => {
          this.audioInputDevices.push({text: mediaDeviceInfo.label, deviceId: mediaDeviceInfo.deviceId})
          console.log(`Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`)
        })

        const tempAudioOutputDevices = await this.meetingSession.audioVideo.listAudioOutputDevices()
        await tempAudioOutputDevices.forEach(mediaDeviceInfo => {
          this.audioOutputDevices.push({text: mediaDeviceInfo.label, deviceId: mediaDeviceInfo.deviceId})
          console.log(`Device ID: ${mediaDeviceInfo.deviceId} Audio Output: ${mediaDeviceInfo.label}`)
        })

        const tempVideoInputDevices = await this.meetingSession.audioVideo.listVideoInputDevices()
        await tempVideoInputDevices.forEach(mediaDeviceInfo => {
          this.videoInputDevices.push({text: mediaDeviceInfo.label, deviceId: mediaDeviceInfo.deviceId})
          console.log(`Device ID: ${mediaDeviceInfo.deviceId} Camera: ${mediaDeviceInfo.label}`)
        })

        this.selectedAudioInputDevice = this.audioInputDevices[0]
        await this.meetingSession.audioVideo.chooseAudioInputDevice(this.selectedAudioInputDevice.deviceId)

        this.selectedAudioOutputDevice = this.audioOutputDevices[0]
        await this.meetingSession.audioVideo.chooseAudioOutputDevice(this.selectedAudioOutputDevice.deviceId)
        await this.meetingSession.audioVideo.bindAudioElement(document.getElementById('meeting-audio'))

        this.selectedVideoInputDevice = this.videoInputDevices[0]
        await this.meetingSession.audioVideo.chooseVideoInputDevice(this.selectedVideoInputDevice.deviceId)
        // this.meetingSession.audioVideo.addObserver(this.observer)

        console.log('Active Meeting Count:: ', this.activeMeetingCount)
        this.$store.dispatch('setActiveMeetingCount', 1)
        this.meetingSession.audioVideo.addContentShareObserver(this.observer)
        this.meetingSession.audioVideo.addObserver(this.observer)
        this.meetingSession.audioVideo.realtimeSubscribeToAttendeeIdPresence(this.attendeeCallback)
        this.meetingSession.audioVideo.realtimeSubscribeToReceiveDataMessage(
          this.DATA_MESSAGE_TOPIC,
          (dataMessage) => {
            this.dataMessageHandler(dataMessage)
          })
        this.meetingSession.audioVideo.start()
      }
    },
    /**
     *
     * @param beautiful chat method
     */
    onMessageWasSent (message) {
      // called when the user sends a message
      // console.log('TESTT::', message)
      this.handleMessage(message)
      this.messageList = [ ...this.messageList, message ]
    },
    openChat () {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat () {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false
    },
    handleScrollToTop () {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    handleOnType () {
      console.log('Emit typing event')
    },
    editMessage (message) {
      const m = this.messageList.find(m => m.id === message.id)
      m.isEdited = true
      m.data.text = message.data.text
    },
    async handleMessage (message) {
      var messageToSent = {author: 'user1', type: message.type, data: message.data}
      this.meetingSession.audioVideo.realtimeSendDataMessage(
        this.DATA_MESSAGE_TOPIC,
        messageToSent,
        this.DATA_MESSAGE_LIFETIME_MS
      )
    },
    async dataMessageHandler (dataMessage) {
      if (!dataMessage.throttled) {
        const isSelf =
          dataMessage.senderAttendeeId ===
          this.meetingSession.configuration.credentials.attendeeId
        if (!isSelf) {
          if (this.participants.find(m => m.id === dataMessage.senderAttendeeId)) {
            this.participants.push({id: dataMessage.senderAttendeeId, name: dataMessage.senderExternalUserId.split('#').slice(-1)[0]})
          }
        }
        if (dataMessage.timestampMs <= this.lastReceivedMessageTimestamp) {
          return
        }
        this.lastReceivedMessageTimestamp = dataMessage.timestampMs
        let messageObj = JSON.parse(dataMessage.text())
        if (isSelf) {
          messageObj.name = 'You'
        } else {
          messageObj.name = dataMessage.senderExternalUserId.split('#').slice(-1)[0]
        }
        this.messageList.push(messageObj)
      } else {
        console.log('Message is throttled. Please resend')
      }
    }
  },
  async created () {
    // window.onbeforeunload = this.browserOnUnload
    this.attendeeCallback = (presentAttendeeId, present) => {
      console.log(`Attendee ID: ${presentAttendeeId} Present: ${present}`)
      if (present) {
        if (presentAttendeeId.split('#').slice(-1)[0] !== 'content') {
          if (presentAttendeeId === this.meetingSession.configuration.credentials.attendeeId) {
            this.$toastr.s('You have Join The Video Meeting')
          } else {
            this.$toastr.s('Peer Has Join The Video Meeting')
          }
        }
        this.attendeePresenceSet.add(presentAttendeeId)
      } else {
        if (presentAttendeeId.split('#').slice(-1)[0] !== 'content') {
          if (presentAttendeeId === this.meetingSession.configuration.credentials.attendeeId) {
            this.$toastr.s('You have Left The Video Meeting')
          } else {
            this.$toastr.s('Peer Has Left The Video Meeting')
          }
        }
        this.attendeePresenceSet.delete(presentAttendeeId)
      }
    }
    this.observer = {
      audioVideoDidStop: (sessionStatus) => {
        const sessionStatusCode = sessionStatus.statusCode()
        if (
          sessionStatusCode === MeetingSessionStatusCode.MeetingEnded
        ) {
          /*
        - You (or someone else) have called the DeleteMeeting API action in your server application.
        - No audio connections are present in the meeting for more than five minutes.
        - Fewer than two audio connections are present in the meeting for more than 30 minutes.
        - Screen share viewer connections are inactive for more than 30 minutes.
        - The meeting time exceeds 24 hours.
        See https://docs.aws.amazon.com/chime/latest/dg/mtgs-sdk-mtgs.html for details.
      */
          // console.log("UserType::", this.userType);
          this.$toastr.s('The Video Meeting Has Ended')
          // this.meetingSession.audioVideo.stop()
          // this.meetingSession = null
          // this.ticketId = null
          // this.$store.dispatch('setMeetingSession', this.meetingSession)
          // this.$store.dispatch('setTicketId', this.ticketId)
          this.redirectAfterMeetingEnded()
          console.log('The session has ended')
        } else {
          console.log(
            'Stopped with a session status code: ',
            sessionStatusCode
          )
        }
      },
      audioVideoDidStart: (sessionStatus) => {
        console.log('sessionStatus:: ', sessionStatus)
        this.meetingSession.audioVideo.startLocalVideoTile()
      },
      videoTileDidUpdate: (tileState) => {
        console.log(
          `video tile updated: ${JSON.stringify(tileState, null, ' ')}`
        )
        if (!tileState.boundAttendeeId) {
          return
        }

        if (this.meetingSession) {
          const myAttendeeId = this.meetingSession.configuration.credentials.attendeeId

          const boundAttendeeId = tileState.boundAttendeeId

          const baseAttendeeId = new DefaultModality(boundAttendeeId).base()
          var videoElementId = 'my-video'
          // var videoElement = document.getElementById('my-video')
          if (tileState.isContent) {
            videoElementId = 'screen-share-video'
            // videoElement = document.getElementById('screen-share-video')
            if (baseAttendeeId === myAttendeeId) {
              this.screenSharing = true
              this.screenSharingTileId = tileState.tileId
              this.peerScreenSharing = false
              this.peerScreenSharingTileId = null
              console.log('You called startContentShareFromScreenCapture')
              // this.$toastr.s('You sharing screen now')
            } else {
              this.screenSharing = false
              this.screenSharingTileId = null
              this.peerScreenSharing = true
              this.peerScreenSharingTileId = tileState.tileId
              if (this.buttonStates['screen-share-button']) {
                this.screenShareToggle('screen-share-button')
              }
              console.log(`${baseAttendeeId} is sharing screen now`)
              // this.$toastr.s('Peer is sharing screen now')
            }
          } else if (tileState.localTile) {
            videoElementId = 'my-video'
            // videoElement = document.getElementById('my-video')
          } else {
            videoElementId = 'other-video'
            // videoElement = document.getElementById('other-video')
          }

          this.tileMap[tileState.tileId] = videoElementId

          const videoElement = document.getElementById(videoElementId)

          this.meetingSession.audioVideo.bindVideoElement(
            tileState.tileId,
            videoElement
          )

          if (tileState.isContent) {
            videoElement.style.display = 'block'
            document.getElementById('other-video').style.display = 'none'
          } else {
            if (videoElement.style.display === 'none') {
              videoElement.style.display = 'block'
            }
          }
        }
      },
      contentShareDidStart: () => {
        console.log('inside observer:: content share started.')
      },
      contentShareDidStop: () => {
        console.log('inside observer:: content share stopped')
        this.screenSharing = false
        this.screenSharingTileId = null
        if (!this.peerScreenSharing) {
          document.getElementById('screen-share-video').style.display = 'none'
          if (document.getElementById('other-video').style.display === 'none') {
            document.getElementById('other-video').style.display = 'block'
          }
        }
        if (this.buttonStates['screen-share-button']) {
          this.toggleButton('screen-share-button')
        }
      },
      audioInputsChanged: freshAudioInputDeviceList => {
      // An array of MediaDeviceInfo objects
        this.audioInputDevices = []
        freshAudioInputDeviceList.forEach(mediaDeviceInfo => {
          this.audioInputDevices.push({text: mediaDeviceInfo.label, deviceId: mediaDeviceInfo.deviceId})
          console.log(`Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`)
        })
      },
      audioOutputsChanged: freshAudioOutputDeviceList => {
        this.selectedAudioOutputDevice = []
        freshAudioOutputDeviceList.forEach(mediaDeviceInfo => {
          this.selectedAudioOutputDevice.push({text: mediaDeviceInfo.label, deviceId: mediaDeviceInfo.deviceId})
          console.log(`Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`)
        })
        console.log('Audio outputs updated: ', freshAudioOutputDeviceList)
      },
      videoInputsChanged: freshVideoInputDeviceList => {
        this.videoInputDevices = []
        freshVideoInputDeviceList.forEach(mediaDeviceInfo => {
          this.videoInputDevices.push({text: mediaDeviceInfo.label, deviceId: mediaDeviceInfo.deviceId})
          console.log(`Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`)
        })
        console.log('Video inputs updated: ', freshVideoInputDeviceList)
      },
      videoTileWasRemoved: tileId => {
        console.log('Inside video Tile was Removed:::', tileId)
        // Release the unused video element.
        const videoElementId = this.tileMap[tileId]
        if (videoElementId === 'screen-share-video') {
        //   videoElementStack.push(videoElement);
          if (this.peerScreenSharingTileId === tileId) {
            this.peerScreenSharing = false
            this.peerScreenSharingTileId = null
            document.getElementById(videoElementId).style.display = 'none'
            if (document.getElementById('other-video').style.display === 'none') {
              document.getElementById('other-video').style.display = 'block'
            }
          }
          if (!this.screenSharing && this.buttonStates['screen-share-button']) {
            this.toggleButton('screen-share-button')
          }
        }
        if (videoElementId) {
          delete this.tileMap[tileId]
        }
      }
    }
  }
}
</script>
<style>
  .video-position {
    position: relative;
    height: 100%;
  }
  .video-screen {
    margin-top: 1px;
    background: #212b31;
    width: 100%;
    height: 100%;
  }
  .video-my-screen {
    position: absolute;
    top: 0%;
    left: 0%;
    width: 25%;
    height: 27%;
    background-color: white;
  }
  .chat-screen {
    position: absolute;
    bottom: 12%;
    left: 74%;
    width: 25%;
    height: 64%;
    background-color: white;
    z-index: 10;
  }
  .video-screen-white-border {
    position: relative;
    width: 105%;
    height: 85vh;
    border: solid 2px black;
    padding: 1%;
  }
  .video-footer {
    position: absolute;
    bottom: 5%;
    background: transparent;
    color: #f1f1f1;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  .video-meeting-btn-drop-down {
    background: #4e8cff;
    color: white;
    border-radius: 50%;
    position: absolute;
    bottom: -20%;
    left: 50%;
    width: 10%;
    height: 60%;
    display: flex;
    border-color: white;
  }
  .drop-down-btn-position {
    position: relative;
  }
  .video-meeting-btn-drop-down:hover {
    background-color: #4e8cff!important;
    border-color: #4e8cff!important;
  }
  .video-meeting-btn-drop-down:focus {
    color: white!important;
    background-color: #4e8cff!important;
    border-color: #4e8cff!important;
  }
  .video-meeting-btn-radius {
    border-radius: 50%;
  }
  .feat-btn-static-color {
    color: white!important;
    border-color: #4e8cff!important;;
    background-color: #4e8cff!important;
  }
  .feat-btn-static-color:hover {
    color: black!important;
    border-color: #4e8cff!important;;
    background-color: #4e8cff!important;
  }
  .feat-btn-click-color {
    color: red!important;
    border-color: #4e8cff!important;;
    background-color: #4e8cff!important;
  }
  .feat-btn-click-color:hover {
    color: black!important;
    border-color: #4e8cff!important;;
    background-color: #4e8cff!important;
  }
  .call-end-btn-color {
    color: white;
    background: #de1c1c;
    border-color: #de1c1c;
  }
  .call-end-btn-color:hover {
    background: #de1c1c!important;
    border-color: #de1c1c!important;
    color: black;
  }
  .call-end-btn-color:active {
    background: #de1c1c!important;
    border-color: #de1c1c!important;
    color: white;
  }
  .call-end-btn-color:focus {
    background: #de1c1c!important;
    border-color: #de1c1c!important;
    color: white;
  }
  .e-dropdown-btn .e-caret, .e-dropdown-btn.e-btn .e-caret {
    display: none;
  }
</style>
