//activity.js
import http from '../../api/service.js'
import { showModel, showErr, format, time } from "../../utils/util.js"
var app = getApp()

Page({
  data: {
    personalRank: false,
    userPhone: '',
    clearTimer: '',
    currentTime: new Date().getTime(),
    time: '',
    rankTitle: ['排名', '姓名', '身份证后六位', '答题数'],
    activity1Homepage: {},
    activityEndTime: '',
    moreflag: true,
    phoneX:''
  },

  gomain:function(){
    http.navigatePageTo('/pages/index/index')
  },
  onPageScroll: function (e) {
    if (e.scrollTop > 10) {
      this.setData({ moreflag: false })
    } else {
      this.setData({ moreflag: true })
    }
  },
  startAnswer: function () {
    var params = {
      url: '/Answer/getquestion',
      data: {
        userPhone: this.data.userPhone,
        time: new Date().getTime()
      },
      method: 'POST'
    }
    http.httpRequest(params).then(res => {
      if (res.status == 200){
        res.degreeDay > 2 ? showErr('今天的答题机会已用完，明天记得再来哦') : http.reLaunch('../answer/answer?question=' + encodeURIComponent(JSON.stringify(res)))
      }else{
        showErr(res.message)
      }
    })
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
    } else {
      clearInterval(this.data.clearTimer)
      http.reLaunch('/pages/index/index')
    }
  },

  //个人信息及排名
  getUserAndRankInfo: function () {
    http.getStorage('user').then(res => {
      this.setData({ userPhone: res.data.fdUserPhone })
      var params = {
        url: '/Answer/UserAnTotalranking',
        data: { userPhone: res.data.fdUserPhone },
        method: 'POST'
      }
      //获取个人信息及排名
      http.httpRequest(params).then(res => {
        function processCard(data) {
          res.rankList.map(item => {
            item.identity = item.identity.substr(-6)
          })
          return data
        }
        if (res.status == 200) {
          !res.unAnswered ? this.setData({
            personalRank: true,
            activity1Homepage: processCard(res)
          }) : this.setData({
            activity1Homepage: Object.assign({}, processCard(res), { today_question: 0, total_question: 0 })
          })
        } else {
          showErr(res.message)
        }
      })
    })
  },

  //距活动时间
  getActivityTimeDifference: function () {
    http.httpRequest(time).then(res => {
      http.getStorage('activityTime').then((time) => {
        let endTime = time.data.playoneEndTime
        this.setData({ activityEndTime: res.status == 200 ? format(endTime) - res.dateTime : format(endTime) - new Date().getTime() })
        this.setData({
          clearTimer: setInterval(() => { this.countTime(this.data.activityEndTime) }, 1000)
        })
        this.countTime(this.data.activityEndTime, this.data.clearTimer)
      })
    })
  },

  onLoad: function (option) {
    this.getUserAndRankInfo()
    this.getActivityTimeDifference()
    this.setData({
      phoneX: app.globalData.isIPX
    })
  },
})