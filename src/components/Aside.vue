<template>
  <aside class="aside-menu">
    <b-tabs>
      <b-tab title="<i class='icon-list'></i>">
        <Callout class="m-0 py-2 text-muted text-center bg-light text-uppercase">
          <small><b>Notifications</b></small>
        </Callout>
        <hr class="transparent mx-3 my-0">
      </b-tab>
    </b-tabs>
  </aside>
</template>

<script>
import Callout from './Callout'
import cSwitch from './Switch'
export default {
  name: 'aside',
  components: {
    Callout,
    cSwitch
  }
}
</script>
