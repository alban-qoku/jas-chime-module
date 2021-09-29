// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import store from './store'
import Toastr from 'vue-toastr'
import { VuejsDatatableFactory } from 'vuejs-datatable'
import CoreuiVue from '@coreui/vue'
import VueTabs from 'vue-nav-tabs'
import VueCalendly from 'vue-calendly'
import { DropDownButtonPlugin } from '@syncfusion/ej2-vue-splitbuttons'
import { SchedulerInstaller } from '@progress/kendo-scheduler-vue-wrapper'
import '@progress/kendo-ui'
import '@progress/kendo-theme-default/dist/all.css'
import 'vue-nav-tabs/themes/vue-tabs.css'
import Chat from 'vue-beautiful-chat'
require('vue-toastr/src/vue-toastr.scss')

Vue.use(SchedulerInstaller)
Vue.use(Chat)
// Vue.config.devtools = true
Vue.use(DropDownButtonPlugin)
Vue.use(SchedulerInstaller)
Vue.use(VueTabs)
Vue.use(BootstrapVue)
Vue.use(CoreuiVue)
Vue.use(VuejsDatatableFactory)
Vue.use(VueCalendly)
Vue.use(Toastr, {
  defaultProgressBar: false
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
