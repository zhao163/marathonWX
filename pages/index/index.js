//index.js
import http from '../../api/service.js'
import { time, format, showErr } from "../../utils/util.js"
var app = getApp();
Page({
  data: {
    disabled: false,
    time: '',
    activitytwoShow: false,
    activityNotice: false,
    activitytwoEndShow: false,
    activityTime: {},
    activitytwoTime: ''
  },

  describeShow:function(){
    !this.data.activitytwoShow ? http.navigatePageTo('/pages/Introduc/Introduc?goDes=' + JSON.stringify(1)) : http.navigatePageTo('/pages/Introduc/Introduc?goDes=' + JSON.stringify(2))
  },

  hideFrocastTwo:function(){
    this.setData({
      activityNotice: false
    })
  },

  saveImg:function(){
    wx.saveImageToPhotosAlbum({
      success(res) {
        wx.showToast({
          title: '保存成功',
        })
      }
    })
  },

  activityStatu: function () {
    //活动一最后一天及活动二前
    if (this.data.time >= format(this.data.activityTime.playtwoStartTime)) {
      this.setData({ activitytwoShow: true })
      this.data.time >= format(this.data.activityTime.playtwoEndTime) ? this.setData({ activitytwoEndShow: true }) : ''
    }
  },

  getStorage: function (callback) {
    http.getStorage('activityTime').then(date => {
      this.setData({ activityTime: date.data })
      http.httpRequest(time).then(res => {
        res && res.status == 200 ? this.setData({ time: res.dateTime }) : this.setData({ time: new Date().getTime() })
        callback()
      })
    })
  },

  getActivityNotice: function () {
    this.setData({
      activitytwoTime: this.data.activityTime.playtwoStartTime.split("-").slice(1, 3).map((item, index) => {
        return index == 1 ? item.split(" ").splice(0, 1) + '号' : item + '月'
      }).join('')
    })
    console.log(this.data.time, format(this.data.activityTime.playoneEndTime) - 1000 * 60 * 60 * 24)
    if (this.data.time >= format(this.data.activityTime.playoneEndTime) - 1000 * 60 * 60 * 24 && this.data.time < format(this.data.activityTime.playtwoStartTime)) {
      this.setData({ activityNotice: true })
    }
  },

  onLoad: function () {
    //活动二预告显示
    this.getStorage(this.getActivityNotice)
  },
  

  onShow: function () {
    //根据时间判断显示活动说明
    this.getStorage(this.activityStatu)
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  onShareAppMessage: function(res) {
    return {
      title: '金风科技北京马拉松等你来挑战',
      path: '/pages/index/index',
      success: function(res) {},
      fail: function(res) {
        // 转发失败
      }
    }
  },

  getWinnersList: function () {
    !this.data.activitytwoEndShow ? http.navigatePageTo('../resultone/resultone') : http.navigatePageTo('../resulttwo/resulttwo')
  }
})