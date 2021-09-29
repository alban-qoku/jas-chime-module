import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import axios from 'axios'

axios.defaults.headers.common['Authorization'] = `Bearer ${window.localStorage.token}`
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.baseURL = process.env.API_URL

Vue.use(Vuex)

const LOGIN = 'LOGIN'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const UPDATE_PROFILE = 'UPDATE_PROFILE'
const UPDATE_ALL_USER_INFOS = 'UPDATE_ALL_USER_INFOS'
const UPDATE_MEMBERSHIP = 'UPDATE_MEMBERSHIP'
const LOGOUT = 'LOGOUT'
const PRICE = 'PRICE'
const SET_AVATAR = 'SET_AVATAR'
const RESET_ASSESSMENT_DATA = 'RESET_ASSESSMENT_DATA'
const OPEN_ASSESSMENT = 'OPEN_ASSESSMENT'
const ASSESSMENT_NAV = 'ASSESSMENT_NAV'
const SAVE_ASSESSMENT_SECTION = 'SAVE_ASSESSMENT_SECTION'
const SAVE_DASHBOARD_INTERACT_DATA = 'SAVE_DASHBOARD_INTERACT_DATA'
const SHOW_TRIAL_MODAL = 'SHOW_TRIAL_MODAL'
const HIDE_TRIAL_MODAL = 'HIDE_TRIAL_MODAL'
const SHOW_TRIAL_PENDING_MODAL = 'SHOW_TRIAL_PENDING_MODAL'
const HIDE_TRIAL_PENDING_MODAL = 'HIDE_TRIAL_PENDING_MODAL'
const HIDE_CONFIRM_MODAL = 'HIDE_CONFIRM_MODAL'
const SCHEDULE_NOTIFICATION = 'SCHEDULE_NOTIFICATION'
const MEETING_SESSION = 'MEETING_SESSION'
const TICKET_ID = 'TICKET_ID'
const ACTIVE_MEETING_COUNT = 'ACTIVE_MEETING_COUNT'

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage,
  reducer: state => ({ user: state.user })
})

const plugins = [vuexLocalStorage.plugin]

const state = {
  isLoggedIn: !!localStorage.getItem('token'),
  user: {},
  pending: false,
  openAssessment: {
    currentStandard: 0,
    currentSection: 0,
    currentQuestion: 0,
    assessment: {}
  },
  dashboardInteractData: [],
  priceData: [],
  bShowTrialModal: false,
  bShowTrialPendingMadal: false,
  sheduleDate: '',
  sheduleTime: '',
  scheduleNotifications: [],
  meetingSession: null,
  ticketId: null,
  activeMeetingCount: 0
}

const mutations = {
  [LOGIN] (state) {
    state.pending = true
  },
  [LOGIN_SUCCESS] (state, userData) {
    state.isLoggedIn = true
    state.user = userData.user
    state.user.permissions = userData.permissions
    state.pending = false
  },
  [LOGOUT] (state) {
    state.user = {}
    state.isLoggedIn = false
  },
  [UPDATE_ALL_USER_INFOS] (state, data) {
    state.user = {}
    state.user = data.resUser
    state.user['trialRemainingDays'] = data.trialRemainingDays
  },
  [PRICE] (state, data) {
    state.priceData = data.priceData
  },
  [UPDATE_PROFILE] (state, userData) {
    state.isLoggedIn = true
    state.user.username = userData.user.username
    state.user.email = userData.user.email
    state.user.firstName = userData.user.firstName
    state.user.lastName = userData.user.lastName
    state.user.organisation = userData.user.organisation
    state.user.organisationWebsite = userData.user.organisationWebsite
    state.user.website = userData.user.website
    state.pending = false
  },
  [UPDATE_MEMBERSHIP] (state, data) {
    state.user.subscriptionStatus = data.subscriptionStatus
    state.user.parentAccount = data.parentAccount
    state.user.permissions = data.permissions
    state.user.membership = data.membership
    state.user.subscriptionDetails = data.subscriptionDetails
  },
  [SET_AVATAR] (state, avatar) {
    state.user.avatar = avatar
  },
  [RESET_ASSESSMENT_DATA] (state) {
    state.openAssessment = {
      currentStandard: 0,
      currentSection: 0,
      currentQuestion: 0,
      assessment: {}
    }
  },
  [OPEN_ASSESSMENT] (state, assessment) {
    state.openAssessment = {
      currentStandard: 0,
      currentSection: 0,
      currentQuestion: 0,
      assessment: assessment
    }
  },
  [ASSESSMENT_NAV] (state, navData) {
    state.openAssessment.currentStandard = navData.standard
    state.openAssessment.currentSection = navData.section
    state.openAssessment.currentQuestion = navData.question
  },
  [SAVE_ASSESSMENT_SECTION] (state, updateData) {
    const assessment = state.openAssessment.assessment
    const standard = assessment.answers[state.openAssessment.currentStandard]
    const section = standard.assessmentData.data.sections[state.openAssessment.currentSection]

    assessment.progress = updateData.assessmentProgress
    standard.progress = updateData.standardProgress
    section.progress = updateData.sectionProgress
    section.questions = updateData.questionData
  },
  [SAVE_DASHBOARD_INTERACT_DATA] (state, updateData) {
    state.dashboardInteractData = updateData
  },
  [SHOW_TRIAL_MODAL] (state) {
    state.bShowTrialModal = true
  },
  [HIDE_TRIAL_MODAL] (state) {
    state.bShowTrialModal = false
  },
  [SHOW_TRIAL_PENDING_MODAL] (state) {
    state.bShowTrialPendingMadal = true
  },
  [HIDE_TRIAL_PENDING_MODAL] (state) {
    state.bShowTrialPendingMadal = false
  },
  [HIDE_CONFIRM_MODAL] (state) {
    state.user.trialDetails.askExtendingExpireDates.confirmAsking = false
  },
  [SCHEDULE_NOTIFICATION] (state, schedules) {
    state.scheduleNotifications = schedules
  },
  [MEETING_SESSION] (state, meetingSession) {
    state.meetingSession = meetingSession
  },
  [TICKET_ID] (state, ticketId) {
    state.ticketId = ticketId
  },
  [ACTIVE_MEETING_COUNT] (state, activeMeetingCount) {
    state.activeMeetingCount = activeMeetingCount
  }
}

const actions = {
  login ({ commit }, credentials) {
    commit(LOGIN)
    return new Promise((resolve, reject) => {
      axios.post('/api/auth/login', credentials)
        .then((response) => {
          console.log(state.user.permissions)
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  phoneVerification ({ commit }, credentials) {
    commit(LOGIN)
    return new Promise((resolve, reject) => {
      axios.post('/api/auth/phoneVerification', credentials)
        .then((response) => {
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  verifyCode ({ commit }, credentials) {
    commit(LOGIN)
    return new Promise((resolve, reject) => {
      axios.post('/api/auth/verifyCode', credentials)
        .then((response) => {
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  saveSession ({ commit }, userInfos) {
    localStorage.setItem('token', userInfos.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${userInfos.token}`
    commit(LOGIN_SUCCESS, { user: userInfos.user, permissions: userInfos.permissions })
  },
  getPrice ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/standardorigin/getprice')
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  setPrice ({ commit }, priceData) {
    commit(PRICE, { priceData: priceData })
  },
  showTrialModal ({ commit }) {
    commit(SHOW_TRIAL_MODAL)
  },
  hideTrialModal ({ commit }) {
    commit(HIDE_TRIAL_MODAL)
  },
  showTrialPendingModal ({ commit }) {
    commit(SHOW_TRIAL_PENDING_MODAL)
  },
  hideTrialPendingModal ({ commit }) {
    commit(HIDE_TRIAL_PENDING_MODAL)
  },
  hideConfirmModal ({ commit }) {
    commit(HIDE_CONFIRM_MODAL)
  },
  setScheduleNotifications ({ commit }, schedules) {
    commit(SCHEDULE_NOTIFICATION, schedules)
  },
  setMeetingSession ({ commit }, meetingSession) {
    commit(MEETING_SESSION, meetingSession)
  },
  setTicketId ({ commit }, ticketId) {
    commit(TICKET_ID, ticketId)
  },
  setActiveMeetingCount ({ commit }, activeMeetingCount) {
    commit(ACTIVE_MEETING_COUNT, activeMeetingCount)
  },
  setSchedule ({ commit }, scheduleData) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/users/setSchedule`, scheduleData)
        .then(response => {
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  getSchedule ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/users/getSchedule`)
        .then(response => {
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  getScheduleMeetings ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/users/getScheduleMeetings`)
        .then(response => {
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  getNotifications ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/notifications/getNotifications`)
        .then(response => {
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  readNotification ({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios.put(`/api/notifications/readNotification`, id)
        .then(response => {
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  /**
   * Schedule and Meeting
   **/
  changedCalendlyAppUrl ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/users/changedCalendlyAppUrl`, data)
        .then(response => {
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  changedCalendlyApiKey ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/users/changedCalendlyApiKey`, data)
        .then(response => {
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  getCalendlyData ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/users/getCalendlyData`)
        .then(response => {
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  createMeetingRoom ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/videoMeetings/create`, data)
        .then(response => {
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  getMeetings ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/videoMeetings/getAllVideoMeetings`)
        .then(response => {
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  joinVideoMeeting ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/videoMeetings/joinVideoMeeting/${data}`, {})
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  closeVideoMeeting ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.put(`/api/videoMeetings/closeVideoMeeting`, data)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },

  /**
   * Extending Trial days
   **/
  askExtending ({ commit }, askingMessage) {
    commit(HIDE_TRIAL_MODAL)
    commit(SHOW_TRIAL_PENDING_MODAL)
    return new Promise((resolve, reject) => {
      axios.put(`/api/users/askExtending`, askingMessage)
        .then(response => {
          commit(UPDATE_ALL_USER_INFOS, response.data)
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  thanksToSupporTeam ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/users/thanksToSupporTeam`)
        .then(response => {
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  updatePrice ({ commit }, updatePriceData) {
    return new Promise((resolve, reject) => {
      axios.put('/api/standardorigin/updateprice', updatePriceData)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  resetStandards ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/standards/resetstandards')
        .then(response => resolve(response))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  validateEmail ({ commit }, email) {
    return new Promise((resolve, reject) => {
      axios.post('/api/users/validateEmail', email)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  verify ({ commit }, opts) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/users/verify/${opts.token}`)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  register ({ commit }, user) {
    return new Promise((resolve, reject) => {
      axios.post('/api/users', user)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  setAvatar ({ commit }, avatar) {
    commit(SET_AVATAR, avatar)
  },
  registerSocial ({ commit }, user) {
    return new Promise((resolve, reject) => {
      axios.post('/api/users/social', user)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  getProfile ({ commit }) {
    return new Promise((resolve, reject) => {
      // axios.get('/api/users/profile', user)
      axios.get('/api/users/profile')
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  updateProfile ({ commit }, user) {
    return new Promise((resolve, reject) => {
      axios.put('/api/users/profile', user)
        .then((response) => {
          commit(UPDATE_PROFILE, { user: response.data })
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
    // Finish writing updateProfile function to make API call
  },
  updateUserMembership ({ commit }, data) {
    commit(UPDATE_MEMBERSHIP, data)
  },
  forgotPassword ({ commit }, user) {
    return new Promise((resolve, reject) => {
      axios.post('/api/users/forgotPassword', user)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  resetPassword ({ commit }, user) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/users/resetPassword`, user)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  createAssessmentEvidenceBucket ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post('/api/assessments/createEvidenceForAssessmentBucket', { assessmentId: data.assessmentid })
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  uploadEvidence ({ commit }, data) {
    let formData = new FormData()
    data.files.forEach(file => {
      if (file.name) {
        formData.append('evidences', file)
      }
    })
    formData.append('section', data.section)
    return new Promise((resolve, reject) => {
      axios.post(`/api/assessments/${data.assessmentId}/evidence`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  uploadAvatar ({ commit }, data) {
    let formData = new FormData()
    if (data.files.name) {
      formData.append('avatar', data.files)
    }
    return new Promise((resolve, reject) => {
      axios.post(`/api/users/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  uploadStandard_data ({ commit }, data) {
    let formData = new FormData()
    if (data.files.name) {
      formData.append('permissions', this.state.user.permissions)
      formData.append('standards_data', data.files)
      formData.append('file_type', data.file_type)
      formData.append('standard_name', data.standard_name)
      formData.append('standard_description', data.standard_description)
      formData.append('hasParent', data.parentAccount.hasParent)
      if (data.parentAccount.hasParent) {
        formData.append('parentId', data.parentAccount.parentId)
        formData.append('parentMembership', data.parentAccount.parentMembership)
      }
    }
    return new Promise((resolve, reject) => {
      axios.post(`/api/standards/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  downloadJSON ({ commit }, data) {
    return new Promise((resolve, reject) => {
      if (this.state.user.permissions.includes('admin')) {
        axios.get(`/api/standardorigin/downloadjson/${data.id}`)
          .then(response => resolve(response))
          .catch(err => reject(new Error(err.response.data.message)))
      } else {
        axios.get(`/api/standards/downloadjson/${data.name}`)
          .then(response => resolve(response))
          .catch(err => reject(new Error(err.response.data.message)))
      }
    })
  },
  downloadCSV ({ commit }, data) {
    return new Promise((resolve, reject) => {
      if (this.state.user.permissions.includes('admin')) {
        axios.get(`/api/standardorigin/downloadcsv/${data.id}`)
          .then(response => {
            const url = 'https://json-csv.com/api/getcsv'
            const postFields = {
              email: this.state.user.email,
              json: response.data.main
            }
            axios.post(url, postFields)
              .then(result => resolve(result))
              .catch(err => reject(new Error(err.response.data.message)))
            // resolve(response)
          })
          .catch(err => reject(new Error(err.response.data.message)))
      } else {
        axios.get(`/api/standards/downloadcsv/${data.name}`)
          .then(response => resolve(response))
          .catch(err => reject(new Error(err.response.data.message)))
      }
    })
  },
  loadEvidence ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/assessments/${data.assessmentId}/evidence`, {
        params: data
      })
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  updatePassword ({ commit }, user) {
    return new Promise((resolve, reject) => {
      axios.post('/api/forgotPassword/reset/' + user.token, user)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  updatePasswordFromProfilePage ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.put('/api/users/' + data.userId, { user: data.user, password: data.password })
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  addPaymentMethod ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post('/api/users/addCard', data)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  removeCard () {
    return new Promise((resolve, reject) => {
      axios.get('/api/users/removeCard')
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  cancelSubscription () {
    return new Promise((resolve, reject) => {
      axios.get('/api/users/cancelSubscription')
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  getPaymentData ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/users/getCardDetail/${data}`, {})
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  getPaymentHistory ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/users/getPaymentHistory')
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  getPaymentHistoryById ({ commit }, opts) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/users/getPaymentHistoryById/${opts.id}`)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  logout ({ commit }) {
    localStorage.removeItem('token')
    // remove the axios default header
    delete axios.defaults.headers.common['Authorization']
    commit(LOGOUT)
    return new Promise(resolve => resolve())
  },
  getStandards ({ commit }) {
    return new Promise((resolve, reject) => {
      if (this.state.user.permissions.includes('admin')) {
        axios.get('/api/standardorigin')
          .then(response => resolve(response.data)
          )
          .catch(err => reject(new Error(err.response.data.message)))
      } else {
        if (this.state.user.parentAccount.hasParent) {
          axios.get(`/api/standards/refparentstandard/${this.state.user.parentAccount.parentId}`)
            .then((response) => {
              resolve(response.data)
            })
            .catch(err => reject(new Error(err.response.data.message)))
        } else {
          axios.get(`/api/standards`)
            .then((response) => {
              resolve(response.data)
            })
            .catch(err => reject(new Error(err.response.data.message)))
        }
      }
    })
  },
  deleteStandard (standardId) {
    return new Promise((resolve, reject) => {
      if (this.state.user.permissions.includes('admin')) {
        axios.get(`/api/standardorigin/deleteStandard/${standardId}`)
          .then((response) => {
            resolve(response.data)
          })
          .catch(err => reject(new Error(err.response.data.message)))
      } else if (this.state.user.permissions.includes('user_admin')) {
        axios.get(`/api/standards/deleteStandard/${standardId}`)
          .then((response) => {
            resolve(response.data)
          })
          .catch(err => reject(new Error(err.response.data.message)))
      }
    })
  },
  getAllBackupStandardsInfo ({ commit }, backupData) {
    return new Promise((resolve, reject) => {
      if (this.state.user.permissions.includes('admin')) {
        axios.get('/api/standardorigin/getAllBackupStandardsInfo')
          .then(response => resolve(response.data)
          )
          .catch(err => reject(new Error(err.response.data.message)))
      } else {
        axios.get(`/api/standards/getAllBackupStandardsInfo`)
          .then((response) => {
            resolve(response.data)
          })
          .catch(err => reject(new Error(err.response.data.message)))
      }
    })
  },
  backupStandards ({ commit }, backupData) {
    return new Promise((resolve, reject) => {
      if (this.state.user.permissions.includes('admin')) {
        axios.put('/api/standardorigin/backupStandards', backupData)
          .then(response => resolve(response.data)
          )
          .catch(err => reject(new Error(err.response.data.message)))
      } else {
        axios.put(`/api/standards/backupStandards`, backupData)
          .then((response) => {
            resolve(response.data)
          })
          .catch(err => reject(new Error(err.response.data.message)))
      }
    })
  },
  fetchStandards ({ commit }, backupData) {
    return new Promise((resolve, reject) => {
      if (this.state.user.permissions.includes('admin')) {
        axios.put('/api/standardorigin/fetchStandards', backupData)
          .then(response => resolve(response.data)
          )
          .catch(err => reject(new Error(err.response.data.message)))
      } else {
        axios.put(`/api/standards/fetchStandards`, backupData)
          .then((response) => {
            resolve(response.data)
          })
          .catch(err => reject(new Error(err.response.data.message)))
      }
    })
  },
  getUserStandards ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/standards/getUserStandards/${data.id}/${data.organisation}`)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  updateStandard ({ commit }, standard) {
    return new Promise((resolve, reject) => {
      axios.put(`/api/standards/${standard._id}/assessment-data`, standard)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  resetStandard ({ commit }, standard) {
    return new Promise((resolve, reject) => {
      axios.put(`/api/standards/${standard._id}/reset`, standard)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  /**
   *
   * @param commit
   * @param userMembership
   * @returns {Promise<any>}
   */
  updateMembership ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.put(`/api/users/membership`, data)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  /**
   *
   * @param commit
   * @param standardMembership
   * @returns {Promise<any>}
   */

  updateUsersParentAccount ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.put(`/api/users/parentaccounts`, data)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  updateStandardsMembership ({ commit }, data) {
    return new Promise((resolve, reject) => {
      if (this.state.user.permissions.includes('admin')) {
        axios.put(`/api/standardorigin/membership`, data)
          .then(response => resolve(response.data))
          .catch(err => reject(new Error(err.response.data.message)))
      } else {
        axios.put(`/api/standards/membership`, data)
          .then(response => resolve(response.data))
          .catch(err => reject(new Error(err.response.data.message)))
      }
    })
  },
  getStandard ({ commit }, opts) {
    return new Promise((resolve, reject) => {
      if (this.state.user.permissions.includes('admin')) {
        axios.get(`/api/standardorigin/${opts.id}`)
          .then(response => resolve(response.data)
          )
          .catch(err => reject(new Error(err.response.data.message)))
      } else {
        axios.get(`/api/standards/${opts.id}`)
          .then(response => resolve(response.data))
          .catch(err => reject(new Error(err.response.data.message)))
      }
    })
  },
  getUsers ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/users/`)
        .then((response) => {
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  getCompanyUsers ({ commit }) {
    let data = {
      company: this.state.user.organisation
    }
    return new Promise((resolve, reject) => {
      axios.post(`/api/users/companyusers/`, data)
        .then((response) => {
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  createuser ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/users/create`, data)
        .then((response) => {
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  confirmExtendingExpireDate ({ commit }, opts) {
    return new Promise((resolve, reject) => {
      axios.put(`/api/users/confirmExtendingExpireDate`, opts)
        .then((response) => {
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  deleteUser ({ commit }, opts) {
    return new Promise((resolve, reject) => {
      axios.delete(`/api/users/${opts}`)
        .then((response) => {
          resolve(response.data)
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  editUser ({ commit }, user) {
    return new Promise((resolve, reject) => {
      axios.put(`/api/users/edit`, user)
        .then((response) => resolve(response.data)
        )
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  sendTaskToJira ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/standards/sendTaskToJira`, data)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  exportIssue ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/standards/exportIssue`, data)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  getAssessments ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/assessments')
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  getAllAssessments ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post('/api/assessments/getAllAssessments', data)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },

  exportPoam ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post('/api/assessments/exportPoam', data)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },

  createAssessment ({ commit }, assessmentData) {
    return new Promise((resolve, reject) => {
      axios.post('/api/assessments', assessmentData)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  getAssessment ({ commit }, opts) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/assessments/${opts.id}`)
        .then((response) => {
          if (opts.open) {
            console.log('Opening assessment...')
            commit(OPEN_ASSESSMENT, response.data)
            resolve()
          } else {
            resolve(response.data)
          }
        })
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  deleteAssessment ({ commit }, assessmentId) {
    return new Promise((resolve, reject) => {
      axios.delete(`/api/assessments/${assessmentId}`)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  assessmentNav ({ commit }, navData) {
    commit(ASSESSMENT_NAV, navData)
  },
  clearAssessmentData ({ commit }) {
    commit(RESET_ASSESSMENT_DATA)
  },
  setDashboardInteractData ({ commit }, interactData) {
    commit(SAVE_DASHBOARD_INTERACT_DATA, interactData)
  },
  saveAssessmentSection ({ commit, getters }) {
    const standardIndex = getters.currentStandard
    const sectionIndex = getters.currentSection
    const assessment = getters.assessment
    const standard = assessment.answers[standardIndex]
    const section = standard.assessmentData.data.sections[sectionIndex]
    const questionData = section.questions
    var sectionProgress
    if (questionData.filter(question => !question.notApplicable).length === 0) {
      sectionProgress = 100
    } else {
      sectionProgress = Math.round((questionData.filter(question => question.selectedAnswer && !question.markedForReview && !question.notApplicable).length / questionData.filter(question => !question.notApplicable).length) * 100)
    }
    // console.log('section filter: ', sectionProgress)
    section.progress = sectionProgress
    const standardProgress = Math.round(standard.assessmentData.data.sections.map(section => section.progress || 0).reduce((prev, curr) => prev + curr) / standard.assessmentData.data.sections.length)
    standard.progress = standardProgress
    const assessmentProgress = Math.round(assessment.answers.map(standard => standard.progress || 0).reduce((prev, curr) => prev + curr) / assessment.answers.length)
    assessment.progress = assessmentProgress
    return new Promise((resolve, reject) => {
      axios.put(`/api/assessments/${assessment._id}/answers`, {
        standardIndex,
        sectionIndex,
        questionData: questionData,
        sectionProgress: sectionProgress,
        standardProgress: standardProgress,
        assessmentProgress: assessmentProgress
      })
        .then((response) => {
          commit(SAVE_ASSESSMENT_SECTION, { questionData, sectionProgress, standardProgress, assessmentProgress })
          resolve(response.data)
        })
        .catch(err => {
          console.log(err)
          reject(new Error(err.response))
        })
    })
  },

  getCurrentAnswers ({ commit, getters }) {
    // const standardIndex = getters.currentStandard
    const standardIndex = 0
    const sectionIndex = getters.currentSection
    const assessment = getters.assessment
    const standard = assessment.answers[standardIndex]
    console.log(getters, ':::::: in index.js store::::::', standard)
    const section = standard.assessmentData.data.sections[sectionIndex]
    const questionData = section.questions
    const sectionProgress = Math.round((questionData.filter(question => question.selectedAnswer && !question.markedForReview).length / questionData.length) * 100)
    section.progress = sectionProgress
    const standardProgress = Math.round(standard.assessmentData.data.sections.map(section => section.progress || 0).reduce((prev, curr) => prev + curr) / standard.assessmentData.data.sections.length)
    standard.progress = standardProgress
    const assessmentProgress = Math.round(assessment.answers.map(standard => standard.progress || 0).reduce((prev, curr) => prev + curr) / assessment.answers.length)
    assessment.progress = assessmentProgress
    return ({
      standardIndex,
      sectionIndex,
      questionData: questionData,
      sectionProgress: sectionProgress,
      standardProgress: standardProgress,
      assessmentProgress: assessmentProgress
    })
  },
  scrollToTop () {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  },
  listReports ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/reports')
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  listSSPs ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/reports/ssp')
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  getReport ({ commit }, opts) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/reports/${opts.id}`)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },

  downloadReportAsHtml ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post('/api/reports/downloadreportashtml/' + data.reportId, { html: data.html })
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  createReport  ({ commit }, reportData) {
    return new Promise((resolve, reject) => {
      axios.post('/api/reports', reportData)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  createSSP  ({ commit }, reportData) {
    return new Promise((resolve, reject) => {
      axios.post('/api/reports/ssp', reportData)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  deleteEvidence ({ commit }, evidenceId) {
    return new Promise((resolve, reject) => {
      axios.delete(`/api/assessments/evidence/${evidenceId}`)
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  // invitee API
  getInviteEmail ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/invitee/getInviteEmail/${data}`, {})
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  getAllInvitees ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/invitee/getAllInvitees/${data}`, {})
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  getAllPromoteInvitees ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/invitee/getAllPromoteInvitees/${data}`, {})
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  promoteInvitee ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/invitee/promoteInvitee`, {
        data: data
      })
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  sendInviteeEmail ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/invitee/sendInviteeEmail`, {
        data: data
      })
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  acceptRegisteredInvitee ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/invitee/acceptRegisteredInvitee/${data}`, {})
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  acceptPromotionInvitation ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/invitee/acceptPromotionInvitation/${data}`, {})
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  },
  deleteInviteeUser ({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/invitee/deleteInviteeUser/${data}`, {})
        .then(response => resolve(response.data))
        .catch(err => reject(new Error(err.response.data.message)))
    })
  }
}

const getters = {
  isLoggedIn: state => state.isLoggedIn,
  hasPermission: state => permission => {
    return (state.user.permissions && state.user.permissions.includes(permission))
  },
  username: state => state.user.username,
  userEmail: state => state.user.email,
  userFirstName: state => state.user.firstName,
  userLastName: state => state.user.lastName,
  userFullName: state => `${state.user.firstName} ${state.user.lastName}`,
  currentStandard: state => state.openAssessment.currentStandard,
  currentSection: state => state.openAssessment.currentSection,
  currentQuestion: state => state.openAssessment.currentQuestion,
  assessment: state => state.openAssessment.assessment,
  dashboardInteractData: state => state.dashboardInteractData,
  priceData: state => state.priceData
}

export default new Vuex.Store({
  plugins,
  state,
  getters,
  actions,
  mutations
})
