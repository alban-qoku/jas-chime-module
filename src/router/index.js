import Vue from 'vue'
import Router from 'vue-router'
import Store from '../store'

// Containers
import Full from '@/containers/Full'

// Views
import Dashboard from '@/views/Dashboard'
import DetailAnswers from '@/views/DetailAnswers'

// Views - Accounts
// import AdminDashboard from '@/views/admin/Admin_dashboard'
import Login from '@/views/account/Login'
import Register from '@/views/account/Register'
import Profile from '@/views/account/Profile'
import PasswordReset from '@/views/account/PasswordReset'
import Reset from '@/views/account/Reset'
import Verify from '@/views/account/Verify'
import Payment from '@/views/account/Payment'
import CardInfo from '@/views/account/CardInfo'
import Invite from '@/views/account/invite'
import AcceptInvitation from '@/views/account/acceptInvitation'
import AcceptPromotion from '@/views/account/acceptPromotion'
import Invoice from '@/views/account/Invoice'

// Views - Assessments
import MyAssessments from '@/views/assessments/MyAssessments'
import ViewAssessment from '@/views/assessments/ViewAssessment'
import AssessmentAnswers from '@/views/assessments/AssessmentAnswers'

// Views - ReportsassessmentEvidences
import MyReports from '@/views/reports/MyReports'
import ViewReport from '@/views/reports/ViewReport'
import GenerateReport from '@/views/reports/GenerateReport'

import MySSPs from '@/views/ssp/MySSPs'
import ViewSSP from '@/views/ssp/ViewSSP'

// Views - Documents
import MyEvidence from '@/views/evidence/MyEvidence'
import assessmentEvidences from '@/views/evidence/assessmentEvidences'

import userList from '@/views/admin/UserList'
import createuser from '@/views/admin/UserCreate'

import membership from '@/views/admin/MembershipEdit'

import userListForUserAdmin from '@/views/user-admin/UserList'
// Views - Documents
import Standards from '@/views/admin/StandardList'
import ViewStandard from '@/views/standards/ViewStandard'
import CreateStandard from '@/views/admin/StandardCreate'
import ExportStandard from '@/views/admin/StandardExport'
import BackupStandards from '@/views/admin/BackupStandards'

// View - Standards
import Export from '@/views/JiraExport/JiraExport.vue'
import ExportAssessmentList from '@/views/JiraExport/ExportAssessmentList.vue'

// view - Generate Poam
import GeneratePoam from '@/views/generatePoam/GeneratePoam'
import GeneratePoamAnswers from '@/views/generatePoam/GeneratePoamAnswers'

// view - Jira Integration
import JiraIntegration from '@/views/admin/JiraIntegration'

// view - Video Conference
import Schedule from '@/views/admin/Schedule/Schedule'
import ChangeKey from '@/views/admin/Schedule/ChangeKey'
import MeetingList from '@/views/admin/Schedule/MeetingList'
// import ScheduleClasses from '@/views/schedule-appointment/SheduleClasses'
import ScheduleClasses from '@/views/schedule-appointment/Calendly'
import VideoMeetingScreen from '@/views/schedule-appointment/VideoMeetingScreen'

// Views - Errors
import Error404 from '@/views/errors/Error404'
import Error500 from '@/views/errors/Error500'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  // mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({y: 0}),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: Full,
      meta: {auth: true},
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
          meta: {auth: true}
        },
        {
          path: '/dashboard/detailanswers',
          name: 'DetailAnswers',
          component: DetailAnswers,
          meta: {auth: true}
        },
        {
          path: 'account',
          redirect: '/account/profile',
          name: 'Account',
          component: {
            render (c) {
              return c('router-view')
            }
          },
          meta: {auth: true},
          children: [
            {
              path: 'profile',
              name: 'Profile',
              component: Profile,
              meta: {auth: true}
            },
            {
              path: 'payment',
              name: 'Billing Info',
              component: Payment,
              meta: {auth: true}
            },
            {
              path: 'invoice/:id',
              name: 'Invoice',
              component: Invoice,
              meta: {auth: true}
            },
            {
              path: 'cardinfo',
              name: 'CardInfo',
              component: CardInfo,
              meta: {auth: true}
            },
            {
              path: 'invite',
              name: 'invite',
              component: Invite,
              meta: {auth: true}
            }
          ]
        },
        // {
        //   path: 'useradmin',
        //   redirect: '/useradmin/membership',
        //   name: 'Membership',
        //   meta: {auth: true},
        //   component: {
        //     render (c) {
        //       return c('router-view')
        //     }
        //   },
        //   children: [
        //     {
        //       path: 'membership',
        //       name: 'Edit Membership',
        //       meta: {auth: true},
        //       component: membership
        //     }
        //   ]
        // },
        {
          path: 'assessments',
          redirect: '/assessments/list',
          name: 'Assessments',
          component: {
            render (c) {
              return c('router-view')
            }
          },
          meta: {auth: true},
          children: [
            {
              path: 'list',
              name: 'My Assessments',
              component: MyAssessments,
              meta: {auth: true}
            },
            {
              path: ':id',
              name: 'View Assessment',
              meta: {auth: true},
              component: ViewAssessment
            },
            {
              path: ':id/answers',
              name: 'Assessment Answers',
              component: AssessmentAnswers,
              meta: {auth: true}
            }
          ]
        },
        {
          path: 'reports',
          redirect: '/reports/list',
          name: 'Reports',
          meta: {auth: true},
          component: {
            render (c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'list',
              name: 'My Reports',
              meta: {auth: true},
              component: MyReports
            },
            {
              path: ':id',
              name: 'View Report',
              meta: {auth: true},
              component: ViewReport
            },
            {
              path: 'generate',
              name: 'Generate Report',
              meta: {auth: true},
              component: GenerateReport
            }
          ]
        },
        {
          path: 'ssp',
          redirect: '/ssp/list',
          name: 'System Security Plan',
          meta: {auth: true},
          component: {
            render (c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'list',
              name: 'Security Plans',
              meta: {auth: true},
              component: MySSPs
            },
            {
              path: ':id',
              name: 'View SSP',
              meta: {auth: true},
              component: ViewSSP
            }
          ]
        },
        {
          path: 'evidence',
          redirect: '/evidence/list',
          name: 'Evidence',
          meta: {auth: true},
          component: {
            render (c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'list',
              name: 'My Evidence',
              meta: {auth: true},
              component: assessmentEvidences
            },
            {
              path: ':id',
              name: 'View Evidence',
              meta: {auth: true},
              component: MyEvidence
            }
          ]
        },
        {
          path: 'standards',
          name: 'Standards',
          meta: {auth: true},
          component: {
            render (c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '/standards/create',
              name: 'Create Standard',
              meta: {auth: true},
              component: CreateStandard
            },
            {
              path: '/standards/list',
              name: 'User Standards',
              meta: {auth: true},
              component: Standards
            },
            {
              path: '/standards/export',
              name: 'Export Standards',
              meta: {auth: true},
              component: ExportStandard
            },
            {
              path: '/standards/backup',
              name: 'Backup Standards',
              meta: {auth: true},
              component: BackupStandards
            },
            {
              path: ':id',
              name: 'Edit User Standard',
              meta: {auth: true},
              component: ViewStandard
            },
            {
              path: '/standards/standardorigin/:id',
              name: 'Edit Original Standard',
              meta: {auth: true},
              component: ViewStandard
            }
          ]
        },
        {
          path: '/jiraexport',
          redirect: '/jiraexport/list',
          name: 'Jira Export',
          meta: {auth: true},
          component: {
            render (c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'list',
              name: 'View Assessment',
              meta: {auth: true},
              component: ExportAssessmentList
            },
            {
              path: ':id',
              name: 'Export Assessment',
              meta: {auth: true},
              component: Export
            }
          ]
        },
        {
          path: '/poamgenerator',
          redirect: '/poamgenerator/list',
          name: 'POA & M Generator',
          meta: {auth: true},
          component: {
            render (c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'list',
              name: 'View Assessment',
              meta: {auth: true},
              component: GeneratePoam
            },
            {
              path: ':id/answers',
              name: 'Assessment Answers',
              meta: {auth: true},
              component: GeneratePoamAnswers
            }
          ]
        },
        {
          path: '/schedule',
          redirect: '/schedule/appointment',
          name: 'Scheduling',
          meta: {auth: true},
          component: {
            render (c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'appointment',
              name: 'Appointment',
              meta: {auth: true},
              component: ScheduleClasses
            },
            {
              path: 'videomeeting',
              name: 'Video Meeting',
              meta: {auth: true},
              component: VideoMeetingScreen
            }
          ]
        }
      ]
    },
    {
      path: '/user-admin',
      name: 'User Admin',
      component: Full,
      children: [
        {
          path: 'membership',
          name: 'Membership',
          meta: {auth: true},
          component: membership
        }
      ]
    },
    {
      path: '/user-admin',
      name: 'User Admin',
      component: Full,
      children: [
        {
          path: 'userlist',
          name: 'User List',
          meta: {auth: true},
          component: userListForUserAdmin
        }
      ]
    },
    {
      path: '/jas-admin',
      name: 'JAS Admin',
      component: Full,
      children: [
        {
          path: 'users',
          name: 'User List',
          meta: {auth: true},
          component: userList
        },
        {
          path: 'users/create',
          name: 'Create User',
          meta: {auth: true},
          component: createuser
        },
        {
          path: 'membership',
          name: 'Edit Membership',
          meta: {auth: true},
          component: membership
        },
        {
          path: 'standards/standardorigin',
          name: 'Edit Original Standards',
          meta: {auth: true},
          component: Standards
        },
        {
          path: 'standards/create',
          name: 'Create Standard',
          meta: {auth: true},
          component: CreateStandard
        },
        {
          path: 'standards/export',
          name: 'Export Origin Standards',
          meta: {auth: true},
          component: ExportStandard
        },
        {
          path: 'jiraintegration',
          name: 'Jira Integration',
          meta: {auth: true},
          component: JiraIntegration
        },
        {
          path: 'schedule',
          name: 'Schedule',
          meta: {auth: true},
          component: Schedule
        },
        {
          path: 'changekey',
          name: 'Change API Key',
          meta: {auth: true},
          component: ChangeKey
        },
        {
          path: 'meetinglist',
          name: 'Meeting List',
          meta: {auth: true},
          component: MeetingList
        },
        {
          path: 'videomeeting',
          name: 'Video Meeting',
          meta: {auth: true},
          component: VideoMeetingScreen
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/acceptInvitation',
      name: 'acceptInvitation',
      component: AcceptInvitation,
      meta: {auth: true}
    },
    {
      path: '/acceptPromotion',
      name: 'acceptPromotion',
      component: AcceptPromotion,
      meta: {auth: true}
    },
    {
      path: '/verify',
      name: 'Verify',
      component: Verify
    },
    {
      path: '/passwordReset',
      name: 'PasswordReset',
      component: PasswordReset
    },
    {
      path: '/resetPassword',
      name: 'reset',
      component: Reset
    },
    {
      path: '/error',
      redirect: '/error/404',
      name: 'Errors',
      component: {
        render (c) {
          return c('router-view')
        }
      },
      children: [
        {
          path: '404',
          name: 'Error404',
          component: Error404
        },
        {
          path: '500',
          name: 'Error500',
          component: Error500
        }
      ]
    },
    // {
    //   path: '*',
    //   name: Error404,
    //   component: Error404
    // }
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.auth && !Store.getters.isLoggedIn) {
    console.log('You must be logged in to access this route!')
    next({path: '/login'})
  } else {
    if (to.meta.admin && !Store.getters.hasPermission('admin')) {
      console.log("You don't have sufficient permissions to view this route!")
      next({path: '/'})
    } else {
      next()
    }
  }
})

export default router
