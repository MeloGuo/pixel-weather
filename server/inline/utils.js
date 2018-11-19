const path = require('path')
const crypto = require('crypto')
const { WEATHER_KEY: KEY, WEATHER_USER_ID: USER_ID, WECHAT_APPID, WECHAT_APP_SECRET } = require('../../config.server.json')

const $ = {
  /**
   * 生成和风天气数字签名
   * @param {*} params
   */
  generateSignature (params) {
    params.username = USER_ID
    let data = Object.keys(params).filter((key) => {
      return params[key] !== '' && key !== 'sign' && key !== 'key'
    }).sort().map((key) => {
      return `${key}=${params[key]}`
    }).join('&') + KEY
    return crypto.createHash('md5').update(data).digest('base64')
  },
  /**
   * 获取背景色颜色
   * @param {*} name
   * @param {*} night
   */
  getBackgroundColor (name, night = 'day') {
    name = `${night}_${name}`
    const map = {
      day_cloud: '62aadc',
      night_cloud: '27446f',
      day_rain: '2f4484',
      night_rain: '284469',
      day_thunder: '3a4482',
      night_thunder: '2a2b5a',
      day_clear: '57b9e2',
      night_clear: '173868',
      day_overcast: '5c7a93',
      night_overcast: '22364d',
      day_snow: '95d1ed',
      night_snow: '7a98bc',
      night_smog: '494d57'
    }
    let color = map[name] ? map[name] : '27446f'
    return `#${color}`
  },
  handleData (data) {
    if (data && data.HeWeather6 && data.HeWeather6[0].now) {
      let result = data.HeWeather6[0]
      let { now, daily_forecast: dailyForecast, lifestyle, hourly } = result
      return {
        status: 0,
        effect: $.getEffectSettings(now.cond_code),
        oneWord: $.getOneWord(now.cond_code),
        current: $._now(now, result),
        hourly: $._hourly(hourly, result),
        lifeStyle: $._lifestyle(lifestyle),
        daily: $._daily(dailyForecast, result)
      }
    } else {
      return {
        status: 500,
        msg: data.HeWeather6.status
      }
    }
  }

}

/* eslint-disable spaced-comment */
/*<remove>*/
module.exports = $
/*</remove>*/
/* eslint-disable spaced-comment */
