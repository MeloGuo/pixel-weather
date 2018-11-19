const { CLOUD_ENV: env, QQ_MAP_KEY } = require('../config')

wx.cloud.init({ env })

const db = wx.cloud.database()

/**
 * 逆地址查询
 * @param {*} lat
 * @param {*} lon
 * @param {*} success
 * @param {*} fail
 */
export const geocoder = (lat, lon, success = () => {}, fail = () => {}) => {
  return wx.request({
    url: 'https://apis.map.qq.com/ws/geocoder/v1/',
    data: {
      location: `${lat},${lon}`,
      key: QQ_MAP_KEY,
      get_poi: 0
    },
    success,
    fail
  })
}

/**
 * 获取和风天气
 * @param {*} lat
 * @param {*} lon
 */
export const getWeather = (lat, lon) => {
  return wx.cloud.callFunction({
    name: 'he-weather',
    data: {
      lat,
      lon
    }
  })
}

/**
 * 获取和风空气质量
 * @param {*} city
 */
export const getAir = (city) => {
  return wx.cloud.callFunction({
    name: 'he-air',
    data: {
      city
    }
  })
}

export const test = (a, b) => {
  return wx.cloud.callFunction({
    name: 'test',
    data: {
      a, b
    }
  })
}
