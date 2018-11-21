/* eslint-disable spaced-comment */
/*<remove trigger="prod">*/
import { getWeather, getAir } from '../../lib/api-mock'
import { geocoder } from '../../lib/api'
/*</remove>*/

/*<jdists trigger="prod">
import { getWeather, getAir } from '../../lib/api'
</jdists>*/
/* eslint-disable spaced-comment */

let isUpdate = false

class DayWeahter {
  constructor (daily) {
    this.temp = `${daily.minTemp}/${daily.maxTemp}`
    this.icon = daily.dayIcon
    this.weather = daily.day
  }
}

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
    this.responseQuery()
  },

  onPullDownRefresh () {
    this.getWeatherData(() => {
      wx.stopPullDownRefresh()
    })
  },

  onShareAppMessage () {
    // 数据获取失败的默认情况
    if (!isUpdate) {
      return {
        title: '我发现一个好玩的天气小程序，分享给你看看！',
        path: '/pages/weather/index'
      }
    } else {
      const { lat, lon, address, province, city, county } = this.data
      let url = `/pages/weather/index?lat=${lat}&lon=${lon}&address=${address}&province=${province}&city=${city}&county=${county}`

      return {
        title: `「${address}」现在天气情况，快打开看看吧！`,
        path: url
      }
    }
  },

  responseQuery () {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const query = currentPage.options
    if (query && query.province) {
      let { province, city, county, address, lat, lon } = query
      this.setData({
        city,
        province,
        county,
        address,
        lat,
        lon
      }, () => {
        this.getWeatherData()
      })
    } else {
      this.getLocation()
    }
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

  getWeatherData (callback) {
    wx.showLoading({
      title: '获取数据中',
      mask: true
    })
    const getWeatherFail = (error) => {
      wx.hideLoading()
      console.error(error)
      if (typeof callback === 'function') {
        callback()
      }
      wx.showToast({
        title: '加载失败，请稍后再试',
        icon: 'none',
        duration: 3000
      })
    }
    const { lat, lon, province, city, county } = this.data

    getWeather(lat, lon).then((res) => {
      wx.hideLoading()
      if (typeof callback === 'function') {
        callback()
      }
      if (res.result) {
        this.render(res.result)
      } else {
        getWeatherFail()
      }
    }).catch(getWeatherFail)

    getAir(city).then((res) => {
      if (res && res.result) {
        this.setData({
          air: res.result
        })
      }
    }).catch((error) => {
      console.error(error)
    })
  },

  render (data) {
    console.log(data)
    isUpdate = true
    const { hourly, daily, current, oneWord = '', lifeStyle } = data
    const { backgroundColor, backgroundImage } = current

    const today = new DayWeahter(daily[0])
    const tomorrow = new DayWeahter(daily[1])

    this.setData({
      hourlyData: hourly,
      weeklyData: daily,
      current,
      today,
      tomorrow,
      backgroundColor,
      backgroundImage,
      oneWord,
      lifeStyle
    })
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
