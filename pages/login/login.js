import { showModel, showErr, time, format } from "../../utils/util.js"
import http from '../../api/service.js'
var app = getApp();
Page({
  data: {
    time: new Date().getTime(),
    fdUserIdentity: '',
    fdUserPhone: '',
    getUserInfoBtn: true,
    userInfo: {},
    greenCount: 0,
    isGreenCard: false,
    greenDialog_show: false,
    isDisable: false,
    commemorateGreenCart: false,
    conventionalGreenCart: false
  },

  getUserInfo: function (e) {
    var userInfo = e.detail.value;
    var option = {
      url: '/userVerify/queryUserInfo',
      data: {
        userIdentity: userInfo.fdUserIdentity,
        userPhone: userInfo.fdUserPhone
      },
      method: 'POST'
    }

    if (userInfo.fdUserIdentity == '' || !(/^\d{5}[0-9Xx]$/).test(userInfo.fdUserIdentity)) {
      showModel('', '请填写身份证后六位')
      return
    }
    if (userInfo.fdUserPhone == '' || !(/^[1][3,4,5,7,8][0-9]{9}$/).test(userInfo.fdUserPhone)) {
      showModel('', '请正确填写手机号码')
      return
    }
    // get用户详细信息
    http.httpRequest(option).then(res => {
      if(res.code == 200) {
        var useInfo = res.data.userInfo
        useInfo.fdUserIdentity = res.data.userInfo.fdUserIdentity.substr(-6)
        http.setStorage('user', useInfo)
        this.setData({
          getUserInfoBtn: false,
          userInfo: useInfo,
          greenCardCount: res.data.list.length,
          isDisable: true
        })
      } else {
        res.code == 500 ? showErr(res.desc) : (showErr(res.desc), this.setData({ isGreenCard: true}))
      }
    })
  },

  buyGreenCard: function () {
    this.setData({
      greenDialog_show: true
    })
  },

  buyCommemorate: function () {
    this.setData({ commemorateGreenCart : true})
  },

  buyCustom: function () {
    this.setData({ conventionalGreenCart: true })
  },

  bindfocus: function (e) {
    this.setData({
      isGreenCard:false
    })
  },

  currentTime: function () {
    http.httpRequest(time).then(res => {
      res.status == 200 ? this.setData({ time: res.dateTime }) : ''
    })
  },

  confirm: function () {
    var activityTime = app.globalData.activityTime;
    if (this.data.time >= format(activityTime.playoneStartTime) && this.data.time < format(activityTime.playoneEndTime)) {
      http.navigatePageTo('../activityone/activityone')
    } else if (this.data.time >= format(activityTime.playtwoStartTime) && this.data.time < format(activityTime.playtwoEndTime)) {
      http.navigatePageTo('../activitytwo/activitytwo')
    }
  },

  close: function () {
    this.setData({
      greenDialog_show: false
    })
  },

  onLoad: function () {
    var that = this
    that.currentTime()
    http.getStorage('user').then(res => {
      res.data ? (that.setData({ userInfo: res.data }), this.setData({ getUserInfoBtn: true, isGreenCard: false, greenDialog_show: false })) : ''
    }, err => {})
  }
})