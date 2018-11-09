const { CLOUD_ENV: env } = require('./config')

App({
  onLaunch () {
    wx.cloud.init({ env })
  }
})
