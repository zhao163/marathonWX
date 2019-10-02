//index.js
import http from '../../api/service.js'
import { showErr } from "../../utils/util.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    randomList: {},
    rankList: {}
  },

  filterIdentity: function (list, type) {
    for (var i = 0; i < list.length; i++) {
      list[i].identity = list[i].identity.substr(-6);
    }
    console.log(Boolean(type), list)
    type ? this.setData({ rankList: list }) : this.setData({ randomList: list })
  },

  // 排名前十
  rank: function () {
    var optionrank = {
      url: '/Answer/ActivityAnTotalranking',
      data: {},
      method: 'POST'
    }
    http.httpRequest(optionrank).then(res => {
      console.log(res.rankList)
      res.status == 200 ? this.filterIdentity(res.rankList, 'type') : showErr(res.message)
    })
  },

  onLoad: function (options) {
    this.rank()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})