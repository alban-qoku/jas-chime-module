import * as Msal from 'msal'

export default class AuthService {
  constructor () {
    let PROD_REDIRECT_URI = 'https://jascloud.jascorp.io/login'
    let redirectUri = 'http://localhost:8080/login'
    if (window.location.hostname !== 'localhost') {
      redirectUri = PROD_REDIRECT_URI
    }
    console.log('host name: ', window.location.hostname)
    this.applicationConfig = {
      clientID: '3de4442f-9f91-4fbb-a60e-af8092dd24bb',
      // clientID: '91b3ba69-a10d-444d-9de5-9c6156388ff8',
      // clientID: '9d86c8dc-bf7d-4573-bc3c-4df2f2c32b93',
      graphScopes: ['user.read']
    }
    this.app = new Msal.UserAgentApplication(
      this.applicationConfig.clientID,
      '',
      () => {
        // console.log('login redirect')
      },
      {
        redirectUri
      }
    )
  }
  login () {
    return this.app.loginPopup(this.applicationConfig.graphScopes).then(
      idToken => {
        const user = this.app.getUser()
        if (user) {
          return user
        } else {
          return null
        }
      },
      () => {
        return null
      }
    )
  }
  logout () {
    this.app.logout()
  }
  getToken () {
    return this.app.acquireTokenSilent(this.applicationConfig.graphScopes).then(
      accessToken => {
        return accessToken
      },
      // eslint-disable-next-line handle-callback-err
      error => {
        return this.app
          .acquireTokenPopup(this.applicationConfig.graphScopes)
          .then(
            accessToken => {
              return accessToken
            },
            err => {
              console.error(err)
            }
          )
      }
    )
  }
}
