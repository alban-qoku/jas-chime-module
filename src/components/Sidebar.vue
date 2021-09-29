<template>
  <div class="sidebar">
    <nav class="sidebar-nav">
      <div slot="header"></div>
      <ul class="nav">
        <li class="nav-item" v-for="(item, index) in navItems">
          <template v-if="item.title">
            <SidebarNavTitle :name="item.name"/>
          </template>
          <template v-else-if="item.divider">
            <li class="divider"></li>
          </template>
          <template v-else>
            <template v-if="item.children">
              <SidebarNavDropdown :name="item.name" :url="item.url" :icon="item.icon" v-if="item.name !== 'User Admin' && item.name !== 'Schedule'">
                <template v-for="(child, index) in item.children">
                  <template v-if="child.children">
                    <SidebarNavDropdown :name="child.name" :url="child.url" :icon="child.icon">
                      <li class="nav-item" v-for="(child, index) in item.children">
                        <SidebarNavLink v-if="getPermissions(child.permissions)" :name="child.name" :url="child.url" :icon="child.icon" :badge="child.badge"/>
                      </li>
                    </SidebarNavDropdown>
                  </template>
                  <template v-else>
                    <li class="nav-item">
                      <SidebarNavLink v-if="getPermissions(child.permissions)" :name="child.name" :url="child.url" :icon="child.icon" :badge="child.badge"/>
                    </li>
                  </template>
                </template>
              </SidebarNavDropdown>
              <SidebarNavDropdown :name="item.name" :url="item.url" :icon="item.icon" v-else-if="item.name === 'Schedule' && (user.permissions.includes('admin') || (user.permissions.includes('user') && (user.membership === 1 || user.membership === 2)))">
                <template v-for="(child, index) in item.children">
                  <template v-if="child.children">
                    <SidebarNavDropdown :name="child.name" :url="child.url" :icon="child.icon">
                      <li class="nav-item" v-for="(child, index) in item.children">
                        <SidebarNavLink v-if="getPermissions(child.permissions)" :name="child.name" :url="child.url" :icon="child.icon" :badge="child.badge"/>
                      </li>
                    </SidebarNavDropdown>
                  </template>
                  <template v-else>
                    <li class="nav-item">
                      <SidebarNavLink v-if="getPermissions(child.permissions)" :name="child.name" :url="child.url" :icon="child.icon" :badge="child.badge"/>
                    </li>
                  </template>
                </template>
              </SidebarNavDropdown>
              <SidebarNavDropdown :name="item.name" :url="item.url" :icon="item.icon" v-else-if="item.name !== 'Schedule' && ((user.permissions.includes('user_admin') && !user.parentAccount.hasParent) || (user.membership === 3 && !user.parentAccount.hasParent))">
                <template v-for="(child, index) in item.children">
                  <template v-if="child.children">
                    <SidebarNavDropdown :name="child.name" :url="child.url" :icon="child.icon">
                      <li class="nav-item" v-for="(child, index) in item.children">
                        <SidebarNavLink v-if="getPermissions(child.permissions)" :name="child.name" :url="child.url" :icon="child.icon" :badge="child.badge"/>
                      </li>
                    </SidebarNavDropdown>
                  </template>
                  <template v-else>
                    <li class="nav-item">
                      <SidebarNavLink v-if="getPermissions(child.permissions)" :name="child.name" :url="child.url" :icon="child.icon" :badge="child.badge"/>
                    </li>
                  </template>
                </template>
              </SidebarNavDropdown>
            </template>
            <template v-else>
              <template v-if="getPermissions(item.permissions) && item.name !== 'Jira Export'">
                <SidebarNavLink :name="item.name" :url="item.url" :icon="item.icon" :badge="item.badge"/>
              </template>
              <template v-else-if="getPermissions(item.permissions) && item.name === 'Jira Export'">
                <SidebarNavLink v-if="user.membership == 2" :name="item.name" :url="item.url" :icon="item.icon" :badge="item.badge"/>
              </template>
            </template>
          </template>
        </li>
      </ul>
      <slot></slot>
      <div slot="footer"></div>
    </nav>
  </div>
</template>
<script>
  import SidebarNavDropdown from './SidebarNavDropdown'
  import SidebarNavLink from './SidebarNavLink'
  import SidebarNavTitle from './SidebarNavTitle'
  import { mapState } from 'vuex'
  export default {
    name: 'sidebar',
    props: {
      navItems: {
        type: Array,
        required: true,
        default: () => []
      }
    },
    computed: mapState({
      user: state => state.user
    }),
    components: {
      SidebarNavDropdown,
      SidebarNavLink,
      SidebarNavTitle
    },
    methods: {
      handleClick (e) {
        e.preventDefault()
        e.target.parentElement.classList.toggle('open')
      },
      getPermissions (permissions) {
        var tmp = true
        for (var i = 0; i < permissions.length; i++) {
          var item = permissions[i]
          if (this.user.permissions.includes(item)) {
            tmp = tmp & true
          } else {
            tmp = tmp & false
          }
        }
        return tmp
      }
    }
  }
</script>

<style lang="css">
  .nav-link {
    cursor:pointer;
  }
</style>
