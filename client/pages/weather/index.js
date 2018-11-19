/* eslint-disable spaced-comment */
/*<remove trigger="prod">*/
import { test } from '../../lib/api-mock'
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
  },

  setPaddingTop () {
    wx.getSystemInfo({
      success: (result) => {
        this.setData({
          paddingTop: result.statusBarHeight + 12
        })
      }
    })
  }
})
