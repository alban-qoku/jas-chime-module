export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      permissions: ['user']
    },
    {
      name: 'JAS-ADMIN',
      url: '/jas-admin',
      icon: 'icon-speedometer',
      permissions: ['admin']
    },
    {
      title: true,
      name: 'Security Compliance'
    },
    {
      name: 'Users',
      url: '/jas-admin/users',
      icon: 'icon-list',
      permissions: ['admin']
    },
    {
      name: 'Membership',
      url: '/jas-admin/membership',
      icon: 'icon-list',
      permissions: ['admin']
    },
    {
      name: 'Assessments',
      url: '/assessments/list',
      icon: 'icon-folder',
      permissions: ['user']
    },
    {
      name: 'Reports',
      url: '/reports',
      icon: 'icon-graph',
      permissions: ['user']
    },
    {
      name: 'Evidence',
      url: '/evidence',
      icon: 'icon-docs',
      permissions: ['user']
    },
    {
      name: 'Standards',
      url: '/standards',
      icon: 'icon-docs',
      children: [
        {
          name: 'Edit  Standards',
          url: '/jas-admin/standards/standardorigin',
          icon: '',
          permissions: ['admin']
        },
        {
          name: 'Import JSON',
          url: '/jas-admin/standards/create',
          icon: '',
          permissions: ['admin']
        },
        {
          name: 'Export JSON',
          url: '/jas-admin/standards/export',
          icon: '',
          permissions: ['admin']
        },
        // {
        //   name: 'Backup Standard',
        //   url: '/jas-admin/standards/backup',
        //   icon: '',
        //   permissions: ['admin']
        // },
        {
          name: 'Edit Standards',
          url: '/standards/list',
          icon: '',
          permissions: ['user']
        },
        {
          name: 'Backup Standards',
          url: '/standards/backup',
          icon: '',
          permissions: ['user']
        },
        {
          name: 'Import JSON',
          url: '/standards/create',
          icon: '',
          permissions: ['user']
        }
        // {
        //   name: 'Export JSON',
        //   url: '/standards/export',
        //   icon: '',
        //   permissions: ['user']
        // }
      ]
    },
    {
      name: 'Jira Export',
      url: '/jiraexport',
      icon: 'icon-docs',
      permissions: ['user']
    },
    {
      name: 'System Security Plan',
      url: '/ssp',
      icon: 'icon-graph',
      permissions: ['user']
    },
    {
      name: 'POA & M Generator',
      url: '/poamgenerator',
      icon: 'icon-docs',
      permissions: ['user']
    },
    {
      name: 'Jira Integration',
      url: '/jas-admin/jiraintegration',
      icon: 'icon-star',
      permissions: ['admin']
    },
    {
      name: 'Schedule',
      url: '/jas-admin',
      icon: 'icon-social-youtube',
      children: [
        {
          name: 'Appointment',
          url: '/schedule/appointment',
          permissions: ['user']
        },
        {
          name: 'Appointment',
          url: '/jas-admin/schedule',
          permissions: ['admin']
        },
        {
          name: 'Meeting List',
          url: '/jas-admin/meetinglist',
          permissions: ['admin']
        },
        {
          name: 'Change Key',
          url: '/jas-admin/changekey',
          permissions: ['admin']
        }
      ]
    },
    // {
    //   name: 'Schedule Appointment',
    //   url: '/jas-admin/schedule',
    //   icon: 'icon-social-youtube',
    //   permissions: ['admin']
    // },
    {
      name: 'User Admin',
      url: '/user-admin/membership',
      icon: 'icon-list',
      children: [
        {
          name: 'User List',
          url: '/user-admin/userlist',
          icon: '',
          permissions: ['user_admin']
        },
        {
          name: 'Membership',
          url: '/user-admin/membership',
          icon: '',
          permissions: ['user']
        }
      ]
      // permissions: ['user']
    }
  ]
}
