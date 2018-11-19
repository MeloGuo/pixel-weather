const path = require('path')
const crypto = require('crypto')
const { WEATHER_KEY: KEY, WEATHER_USER_ID: USER_ID, WECHAT_APPID, WECHAT_APP_SECRET } = require('../../config.server.json')

const $ = {
  generateSignature (params) {
    params.username = USER_ID
    let data = Object.keys(params).filter((key) => {
      return params[key] !== '' && key !== 'sign' && key !== 'key'
    }).sort().map((key) => {
      return `${key}=${params[key]}`
    }).join('&') + KEY
    return crypto.createHash('md5').update(data).digest('base64')
  }
}

/* eslint-disable spaced-comment */
/*<remove>*/
module.exports = $
/*</remove>*/
/* eslint-disable spaced-comment */
