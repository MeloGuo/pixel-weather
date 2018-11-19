const { CLOUD_ENV: env, QQ_MAP_KEY } = require('../config')

const callFunction = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `http://127.0.0.1:3000/api${url}`,
      data,
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

export const getWeather = (lat, lon) => {
  callFunction('/he-weather', { lat, lon })
}

export const getAir = (city) => {
  callFunction('/he-air', { city })
}

export const test = (a, b) => {
  callFunction('/test', { a, b })
}
