import http from '../../api/service.js'
import { time, format, showErr } from "../../utils/util.js"

Page({
  data: {
    activityOne: true,
    time: '',
    activityTime: {}
  },

  goLogin: function () {
    if (this.data.time < format(this.data.activityTime.playoneStartTime) || (this.data.time > format(this.data.activityTime.playoneEndTime) && this.data.time < format(this.data.activityTime.playtwoStartTime)) || this.data.time >= format(this.data.activityTime.playtwoEndTime)) {
      showErr('非活动时间，无法登陆')
      return
    }
    http.navigatePageTo('/pages/login/login')
  },

  getStorage: function () {
    http.getStorage('activityTime').then(res => {
      this.setData({ activityTime: res.data })
      http.httpRequest(time).then(res => {
        res.status == 200 ? this.setData({ time: res.dateTime }) : this.setData({ time: new Date().getTime() })
      })
    })
  },

  onLoad: function (options) {
    options.goDes == 2 ? this.setData({ activityOne: false }) : ''
  }, 

  onShow: function () {
    this.getStorage()
  }
})