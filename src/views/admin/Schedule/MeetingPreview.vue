<template>
  <div id="flow-devices" class="flow">
    <div class="container">
      <form id="form-devices">
        <h1 class="h3 mb-3 font-weight-normal text-center">Select devices</h1>
        <div class="row mt-3">
          <div class="col-12 col-sm-8">
            <label for="audio-input block">Microphone</label>
            <select
              v-model="selAudioInputDevice"
              id="audio-input"
              class="custom-select"
              style="width: 100%"
              v-on:change="audioInputDeviceChange"
            >
              <option
                v-for="audioInputDevice in audioInputDevices"
                :value="audioInputDevice.deviceId"
                :key="audioInputDevice.deviceId"
              >
                {{ audioInputDevice.label }}
              </option>
            </select>
          </div>
          <div class="text-center col-sm-4 d-sm-block">
            <label>Preview</label>
            <div class="w-100 progress" style="margin-top: 0.75rem">
              <div
                id="audio-preview"
                class="progress-bar bg-success"
                role="progressbar"
                aria-valuenow="0"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12 col-sm-8">
            <label for="video-input block">Camera</label>
            <select
              v-model="selVideoInputDevice"
              id="video-input"
              class="custom-select"
              style="width: 100%"
              v-on:change="videoInputDeviceChange"
            >
              <option
                v-for="videoInputDevice in videoInputDevices"
                :value="videoInputDevice.deviceId"
                :key="videoInputDevice.deviceId"
              >
                {{ videoInputDevice.label }}
              </option>
            </select>
          </div>
          <div class="col-sm-4 text-center d-sm-block video-preview">
            <video
              id="video-preview"
              class="w-300 h-300"
              style="max-width: 137px; max-height: 82px; border-radius: 8px"
            ></video>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12 col-sm-8">
            <label for="audio-output block">Speaker</label>
            <select
              v-model="selAudioOutputDevice"
              id="audio-output"
              class="custom-select"
              style="width: 100%"
            >
              <option
                v-for="audioOutputDevice in audioOutputDevices"
                :value="audioOutputDevice.deviceId"
                :key="audioOutputDevice.deviceId"
              >
                {{ audioOutputDevice.label }}
              </option>
            </select>
          </div>
          <div class="col-sm-4">
            <button
              type="button"
              id="button-test-sound"
              class="btn btn-outline-secondary btn-block h-50 d-sm-block"
              style="margin-top: 2rem"
              v-on:click="testSound"
              :disabled="!selAudioOutputDevice"
            >
              Test
            </button>
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-lg">
            <button
              id="joinButton"
              class="btn btn-lg btn-primary btn-block"
              type="button"
              v-on:click="joinMeeting"
            >
              Join
            </button>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-lg">
            <p>
              Ready to join meeting <b><span id="info-meeting"></span></b> as
              <b
              ><span id="info-name">{{ name }}</span></b
              >.
            </p>
          </div>
        </div>
      </form>
      <div id="progress-join" class="w-100 progress progress-hidden">
        <div
          class="w-100 progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          aria-valuenow="100"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
    <div id="flow-failed-join" class="flow" style="display: none">
      <div class="container">
        <form id="form-failed-join">
          <div class="card border-warning mb-3" style="max-width: 20rem">
            <div id="failed-join" class="card-header"></div>
            <div class="card-body">
              <h4 class="card-title">Unable to join meeting</h4>
              <p class="card-text">
                There was an issue joining that meeting. Check your connectivity
                and try again.
              </p>
              <small id="failed-join-error" class="text-muted"></small>
            </div>
          </div>
          <button
            class="btn btn-lg btn-outline-warning btn-block"
            type="button"
          >
            OK
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
  // import TestSound from "../../util/TestSound";

  export default {
    name: 'index',
    props: {
      name: String,
      meetingSession: Object,
      title: String,
      meetingId: String,
      userType: String
    },
    data: () => ({
      audioInputDevices: [],
      selAudioInputDevice: null,
      videoInputDevices: [],
      selVideoInputDevice: null,
      audioOutputDevices: [],
      selAudioOutputDevice: null,
      analyserNodeCallback: {}
    }),
    computed: {},
    methods: {
      testSound () {
        if (this.selAudioOutputDevice) {
          // new TestSound(this.selAudioOutputDevice)
        }
      },
      async videoInputDeviceChange () {
        if (this.selVideoInputDevice && this.meetingSession) {
          await this.meetingSession.audioVideo.chooseVideoInputDevice(
            this.selVideoInputDevice
          )
          await this.meetingSession.audioVideo.startVideoPreviewForVideoInput(
            document.getElementById('video-preview')
          )
        }
      },
      async audioInputDeviceChange () {
        if (this.selAudioInputDevice && this.meetingSession) {
          await this.meetingSession.audioVideo.chooseAudioInputDevice(
            this.selAudioInputDevice
          )
          this.startAudioPreview()
        }
      },
      startAudioPreview () {
        this.setAudioPreviewPercent(0)
        const analyserNode = this.meetingSession.audioVideo.createAnalyserNodeForAudioInput()
        if (!analyserNode) {
          return
        }
        if (!analyserNode.getByteTimeDomainData) {
          document.getElementById(
            'audio-preview'
          ).parentElement.style.visibility = 'hidden'
          return
        }
        const data = new Uint8Array(analyserNode.fftSize)
        let frameIndex = 0
        this.analyserNodeCallback = () => {
          if (frameIndex === 0) {
            analyserNode.getByteTimeDomainData(data)
            const lowest = 0.01
            let max = lowest
            for (const f of data) {
              max = Math.max(max, (f - 128) / 128)
            }
            let normalized =
              (Math.log(lowest) - Math.log(max)) / Math.log(lowest)
            let percent = Math.min(Math.max(normalized * 100, 0), 100)
            this.setAudioPreviewPercent(percent)
          }
          frameIndex = (frameIndex + 1) % 2
          requestAnimationFrame(this.analyserNodeCallback)
        }
        requestAnimationFrame(this.analyserNodeCallback)
      },
      setAudioPreviewPercent (percent) {
        const audioPreview = document.getElementById('audio-preview')
        this.updateProperty(audioPreview.style, 'transitionDuration', '33ms')
        this.updateProperty(audioPreview.style, 'width', `${percent}%`)
        if (audioPreview.getAttribute('aria-valuenow') !== `${percent}`) {
          audioPreview.setAttribute('aria-valuenow', `${percent}`)
        }
      },
      async populateAllDeviceLists () {
        this.audioInputDevices = await this.meetingSession.audioVideo.listAudioInputDevices()

        this.selAudioInputDevice = this.audioInputDevices.length > 0 ? this.audioInputDevices[0].deviceId : this.selAudioInputDevice
        this.audioInputDeviceChange()
        // console.log("this.audioInputDevices::",this.audioInputDevices)
        // console.log("this.selAudioInputDevice::",this.selAudioInputDevice)
        this.videoInputDevices = await this.meetingSession.audioVideo.listVideoInputDevices()
        this.selVideoInputDevice = this.videoInputDevices.length>0?this.videoInputDevices[0].deviceId:this.selVideoInputDevice
        this.videoInputDeviceChange()
        this.audioOutputDevices = await this.meetingSession.audioVideo.listAudioOutputDevices()
        this.selAudioOutputDevice = this.audioOutputDevices.length>0?this.audioOutputDevices[0].deviceId:this.selAudioOutputDevice
        // console.log("this.audioOutputDevices::",this.audioOutputDevices)
        // console.log("this.selAudioOutputDevice::",this.selAudioOutputDevice)
      },
      updateProperty (obj, key, value) {
        if (value !== undefined && obj[key] !== value) {
          obj[key] = value
        }
      },
      showProgress (id) {
        document.getElementById(id).style.visibility = 'visible'
      },
      hideProgress (id) {
        document.getElementById(id).style.visibility = 'hidden'
      },
      async joinMeeting () {
        try {
          this.showProgress('progress-join')
          // await this.join();
          this.meetingSession.audioVideo.stopVideoPreviewForVideoInput(
            document.getElementById('video-preview')
          )
          this.meetingSession.audioVideo.chooseVideoInputDevice(null)
          this.hideProgress('progress-join')
          let selectedDevice = {}
          selectedDevice.audioInput = this.selAudioInputDevice
          selectedDevice.audioOutput = this.selAudioOutputDevice
          selectedDevice.videoInput = this.selVideoInputDevice
          let devices = {}
          devices.audioInputDevices = this.audioInputDevices
          devices.audioOutputDevices = this.audioOutputDevices
          devices.videoInputDevices = this.videoInputDevices
          this.$router.push({
            name: 'meeting',
            params: {
              userType:this.userType,
              name: this.name,
              meetingSession: this.meetingSession,
              selectedDevice: selectedDevice,
              title: this.title,
              meetingId: this.meetingId
            }
          })
        } catch (error) {
          document.getElementById('flow-failed-join').style.display = 'block'
          document.getElementById(
            'failed-join'
          ).innerText = `Meeting ID: ${this.meeting}`
          document.getElementById(
            'failed-join-error'
          ).innerText = `Error: ${error.message}`
        }
      }
    },
    mounted () {
      this.populateAllDeviceLists()
    }
  }
</script>
<style>
</style>
