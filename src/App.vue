<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
  /* Import Font Awesome Icons Set */
  $fa-font-path: "~font-awesome/fonts/";
  @import "~font-awesome/css/font-awesome.min.css";
  /* Import Simple Line Icons Set */
  $simple-line-font-path: "~simple-line-icons/fonts/";
  @import "~simple-line-icons/css/simple-line-icons.css";
  /* Import Bootstrap Vue Styles */
  @import '~bootstrap-vue/dist/bootstrap-vue.css';
  /* Import DropDown Styles*/
  @import '../node_modules/@syncfusion/ej2-base/styles/material.css';
  @import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';
  @import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
  @import '../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css';
</style>
<style lang="scss">
  // Import Main styles for this application
  @import "./scss/style";
</style>
