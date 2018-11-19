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

export const test = (a, b) => {
  return wx.cloud.callFunction({
    name: 'test',
    data: {
      a, b
    }
  })
}
