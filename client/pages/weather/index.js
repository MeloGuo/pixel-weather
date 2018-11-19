/* eslint-disable spaced-comment */
/*<remove trigger="prod">*/
import { test } from '../../lib/api-mock'
import { geocoder } from '../../lib/api'
/*</remove>*/

/*<jdists trigger="prod">
import { test } from '../../lib/api'
</jdists>*/
/* eslint-disable spaced-comment */

Page({
  data: {
    statusBarHeight: 32,
    backgroundImage: '../../images/cloud.jpg',
    backgroundColor: '#62aadc',
    current: {
      temp: '0',
      weather: '数据获取中',
      humidity: '1',
      icon: 'xiaolian'
    },
    today: {
      temp: 'N/A',
      weather: '暂无'
    },
    tomorrow: {
      temp: 'N/A',
      weather: '暂无'
    },
    hourlyData: [],
    city: '北京',
    weeklyData: [],
    width: 375,
    scale: 1,
    address: '定位中',
    lat: 40.056974,
    lon: 116.307689
  },

  onLoad () {
    this.setPaddingTop()
    this.getLocation()
  },

  setPaddingTop () {
    wx.getSystemInfo({
      success: (result) => {
        this.setData({
          paddingTop: result.statusBarHeight + 12
        })
      }
    })
  },

  getAddress (lat, lon, name) {
    wx.showLoading({
      title: '定位中',
      mask: true
    })

    let fail = (error) => {
      console.error(error)
      this.setData({
        address: name || '北京市海淀区西二旗北路'
      })
      wx.hideLoading()

      this.getWeatherData()
    }

    geocoder(
      lat,
      lon,
      (res) => {
        wx.hideLoading()
        let result = (res.data || {}).result

        if (res.statusCode === 200 && result && result.address) {
          let { address, formatted_addresses: formattedAddresses, address_component: addressComponent } = result
          if (formattedAddresses && (formattedAddresses.recommend || formattedAddresses.rough)) {
            address = formattedAddresses.recommend || formattedAddresses.rough
          }
          let { province, city, district: county } = addressComponent
          this.setData({
            province,
            county,
            city,
            address: name || address
          })
          this.getWeatherData()
        } else {
          fail()
        }
      },
      fail
    )
  },

  getWeatherData () {

  },

  chooseLocation () {
    wx.chooseLocation({
      success: (res) => {
        let { latitude, longitude } = res
        let { lat, lon } = this.data
        if (latitude == lat && lon == longitude) {
          this.getWeatherData()
        } else {
          this.updateLocation(res)
        }
      }
    })
  },

  updateLocation (res) {
    let { latitude: lat, longitude: lon, name } = res
    let data = { lat, lon }
    if (name) {
      data.address = name
    }
    this.setData(data)
    this.getAddress(lat, lon, name)
  },

  getLocation () {
    wx.getLocation({
      type: 'gcj02',
      success: this.updateLocation,
      fail: (error) => {
        console.error(error)
        this.openLocation()
      }
    })
  },

  openLocation () {
    wx.showToast({
      title: '检测到您未授权使用位置权限，请先开启哦',
      icon: 'none',
      duration: 3000
    })
  }
})
