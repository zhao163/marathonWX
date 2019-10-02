//activity.js
import http from '../../api/service.js'
import { showModel, showErr } from "../../utils/util.js"
var app = getApp();
Page({
  data: {
    phone: '',
    countDown: '',
    time:  5 * 60,
    clearTimer: '',
    checkNum: 0,
    question:{},
    activeQ: 0
  },

  onLoad: function (options) {
    this.setData({ question: JSON.parse(decodeURIComponent(options.question)) })
    this.countminutes(this.data.time)
    this.data.clearTimer = setInterval(() => { this.countminutes(this.data.time) }, 1000)
  },

  onHide: function () {
    let that = this
    clearInterval(this.data.clearTimer)
    wx.showModal({
      title: '',
      content: '由于您上次强制退出，已消耗一次答题机会！',
      showCancel: false,
      mask: true,
      success: function (res) {
        res.confirm ? that.sendQuestionStatus('quit') : ''
      }
    })
  },

  countminutes: function (time) {
    if (time >= 0) {
      let minutes = Math.floor(time / 60)
      let seconds = Math.floor(time % 60)
      --this.data.time
        // (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds)
      this.setData({
        countDown: (minutes+'分'+seconds+'秒')
      })
    } else {
      clearInterval(this.data.clearTimer)
      this.sendQuestionStatus()
    }
  },

  checkAnswer: function (e) {
    this.setData({ checkNum: e.currentTarget.dataset.id})
  },

  sendQuestionStatus: function (quit) {
    http.getStorage('user').then(res => {
      this.setData({
        phone: res.data.fdUserPhone
      })
      var params = {
        url: '/Answer/acceptUserAnswerData',
        data: {
          qid: this.data.question.id,
          userPhone: this.data.phone,
          isRight: this.data.checkNum == this.data.question.correct ? 1 : 0,
          degreeDay: this.data.question.degreeDay
        },
        method: 'POST'
      }
      http.httpRequest(params).then(res => {
        //quit 是否放弃答题
        if (quit) {
          http.reLaunch('../index/index')
          return
        }
        if (this.data.checkNum != this.data.question.correct) {
          this.data.checkNum == 0 ? showErr('答题时间已到') : (showErr('答案错误,本轮答题结束') , clearInterval(this.data.clearTimer))
          setTimeout(() => { http.reLaunch('../activityone/activityone' )}, 1000)
        } else {
          //处理check，下题数据{}
          this.setData({ 
            checkNum: 0,
            question: res,
            activeQ: ++this.data.activeQ,
          })
        }
      })
    })
  },

  nextQuestion: function () {
    !this.data.checkNum ? showErr('您还未选择答案') : this.sendQuestionStatus()
  },
})