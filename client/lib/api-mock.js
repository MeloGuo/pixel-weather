const { CLOUD_ENV: env, QQ_MAP_KEY } = require('../config')

export const getWeather = (lat, lon) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:3000/api/he-weather',
      data: {
        lat,
        lon
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

export const test = (a, b) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:3000/api/test',
      data: { a, b },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}
