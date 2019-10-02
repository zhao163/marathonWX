//activity.js
import http from '../../api/service.js'
import { showModel, showErr, countTime, format, time } from "../../utils/util.js"
var app = getApp()

Page({
  data: {
    userPhone: '',
    clearTimer: '',
    activityEndTime: '',
    greenDialog_show: false,
    rankTitle: ['排名', '姓名', '身份证后六位', '绿证数'],
    activity1Homepage: {},
    commemorateGreenCart: false,
    conventionalGreenCart: false,
    moreflag:true,
    phoneX: ''
  },

  gomain: function () {
    http.navigatePageTo('/pages/index/index')
  },
  onPageScroll: function (e) {
    if (e.scrollTop>10){
      this.setData({ moreflag: false })
    }else{
      this.setData({ moreflag: true })
    }
  },
  buyCommemorate: function () {
    this.setData({ commemorateGreenCart: true })
  },

  buyCustom: function () {
    this.setData({ conventionalGreenCart: true })
  },

  countTime: function (activityEndTime, clearTime) {
    clearTime ? '' : activityEndTime -= 1000
    this.setData({ activityEndTime: activityEndTime })
    if (activityEndTime > 0) {
      let d = Math.floor(activityEndTime / 1000 / 60 / 60 / 24)
      let h = Math.floor(activityEndTime / 1000 / 60 / 60 % 24)
      let m = Math.floor(activityEndTime / 1000 / 60 % 60)
      let s = Math.floor(activityEndTime / 1000 % 60)
      var time = (d < 10 ? '0' + d : d) + '天' + (h < 10 ? '0' + h : h) + '时' + (m < 10 ? '0' + m : m) + '分' + (s < 10 ? '0' + s : s) + '秒'
      return this.setData({ time: time })
    }else {
      clearInterval(this.data.clearTimer)
      http.reLaunch('/pages/index/index')
    }
  },

  buyGreenCard: function(){
    wx.pageScrollTo({
      scrollTop: 0
    })
     this.setData({ greenDialog_show: true })
  },

  close: function() {
    this.setData({ greenDialog_show: false })
  },

  preventTouchMove: function () {

  },

  //个人信息及排名
  getUserAndRankInfo: function () {
    http.getStorage('user').then(res => {
      this.setData({ userPhone: res.data.fdUserPhone })
      let params = {
        url: '/userVerify/getUserTenRanking',
        data: { fdUserPhone: res.data.fdUserPhone },
        method: 'GET'
      }
      //获取个人信息及排名
      http.httpRequest(params).then(res => {
        function processCard(data) {
          data.list.map(item => {
            item.fdUserIdentity = item.fdUserIdentity.substr(-6)
          })
          return data
        }
        res.code == 200 ? this.setData({ activity1Homepage: processCard(res.data) }) : showErr(res.desc)
      })
    })
  },

  //距活动时间
  getActivityTimeDifference: function () {
    http.httpRequest(time).then(res => {
      http.getStorage('activityTime').then((time) => {
        let endTime = time.data.playtwoEndTime
        this.setData({ activityEndTime: res.status == 200 ? format(endTime) - res.dateTime : format(endTime) - new Date().getTime()})
        this.setData({
          clearTimer: setInterval(() => { this.countTime(this.data.activityEndTime) }, 1000)
        })
        this.countTime(this.data.activityEndTime, this.data.clearTimer)
      })
    })
  },

  onLoad: function (option) {
    this.getActivityTimeDifference()
    this.getUserAndRankInfo()
    this.setData({
      phoneX: app.globalData.isIPX
    })
  },
})