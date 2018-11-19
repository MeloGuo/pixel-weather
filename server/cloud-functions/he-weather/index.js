// server/cloud-functions/he-weather
// 请求的地址
const API_URL = 'https://free-api.heweather.com/s6/weather'
// request 模块
const request = require('request')

// 引入云函数功能工具方法，跟空气质量公用
// gulp prod 打包的时候将公共utils库嵌入式引入
/* eslint-disable spaced-comment */
/*<jdists import="../../inline/utils.js" />*/
/*<remove>*/
const $ = require('../../inline/utils')
/*</remove>*/
/* eslint-disable spaced-comment */

// 默认 main 函数
exports.main = async ({ lat, lon }) => {
  let location = `${lat},${lon}`
  let params = {
    location,
    t: Math.floor(Date.now() / 1e3),
    unit: 'm'
  }
  // 生成签名
  params.sign = $.generateSignature(params)
  let query = []
  for (const i in params) {
    query.push(`${i}=${encodeURIComponent(params[i])}`)
  }
  let url = API_URL + '?' + query.join('&')
  // promise
  return new Promise((resolve, reject) => {
    request.get(url, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        reject(error)
      } else {
        try {
          // 统一处理接口返回的数据
          let rs = $.handlerData(JSON.parse(body))
          resolve(rs)
        } catch (error) {
          reject(error)
        }
      }
    })
  })
}
