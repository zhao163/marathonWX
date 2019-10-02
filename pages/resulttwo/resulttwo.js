//index.js
import http from '../../api/service.js'
import { time, format } from "../../utils/util.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 随机10个列表获取
  rand: function () {
    var option = {
      url: '/userVerify/getUserrankRandom',
      data: {},
      method: 'GET'
    }
    http.httpRequest(option).then(res => {
      console.log('login', res)
      if (res.code == 200) {
        const listArrRandom = res.data;
        for (var i = 0; i < listArrRandom.length; i++) {
          listArrRandom[i].fdUserIdentity = listArrRandom[i].fdUserIdentity.substr(-6);
        }
        this.setData({
          listArrRandom: listArrRandom
        });
      }
    })
  },

  // 排名前十
  rank: function () {
    var optionrank = {
      url: '/userVerify/getUserFirstTenTenRanking',
      data: {
      },
      method: 'GET'
    }
    http.httpRequest(optionrank).then(res => {
      console.log('login', res)
      if (res.code == 200) {
        const listArrRank = res.data;
        for (var i = 0; i < listArrRank.length; i++) {
          listArrRank[i].fdUserIdentity = listArrRank[i].fdUserIdentity.substr(-6);
        }
        this.setData({
          listArrRank: listArrRank
        });
      }
    })
  },

  determineCurrentTime: function (time) {
    http.getStorage('activityTime').then(res => {
      time - format(res.data.playtwoEndTime) >= 1000 * 60 * 60 ? this.rand() : ''
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.rank()
  },

  onShow: function (options) {
    http.httpRequest(time).then(data => {
      data.status == 200 ? this.determineCurrentTime(data.dateTime) : this.determineCurrentTime(new Date().getTime())
    })
  },

  pageToActivityOne: function () {
    http.navigatePageTo("../resultone/resultone")
  }
})