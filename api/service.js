import { showErr, showLoading } from "../utils/util.js"
var api = "https://bmweixin.tianrun.cn"
// var api = "http://10.72.31.23:8065"

 // 获取code
  function code() {
      let data = new Promise((resolve, reject) => {
        wx.login({
          success: resolve,
          fail: reject
        })
      })
      return data
    }

  // 获取用户信息
  function getUserInfo() {
    let data = new Promise((resolve, reject) => {
      wx.getUserInfo({
        success: resolve,
        fail: reject
      })
    })
    return data
  }

  // 网络请求
  function httpRequest(options = {}) {
    showLoading()
    let data = new Promise((resolve, reject) => {
      wx.request({
        url: api + options.url,
        // url: options.url,
        data: Object.assign({}, options.data),
        method: options.method || 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: resolve,
        fail: reject
      })
    }).then(res => {
      wx.hideLoading()
      return res.data
      }, err => {
        wx.hideLoading(),
        showErr(err.errMsg)
      })
    return data
  }

  // 跳转
  function navigatePageTo(url = '/') {
    wx.navigateTo({
      url: url,
    })
  }

  //销毁之前页面
  function reLaunch(url = '/') {
    wx.reLaunch({
      url: url,
    })
  }

  // 下拉刷新
  function onPullDownRefresh (options, listFunction) {
    options.pageSize = options.pageSize + 10;
    return listFunction(options)
  }

  function getStorage (key) {
    let data = new Promise((resolve, reject) => {
      wx.getStorage({
        key: key,
        success: resolve,
        fail: reject
      })
    })
    return data
  }

  function setStorage (key, value) {
    wx.setStorage({
      key: key,
      data: value,
    })
  }

export default { code: code, getUserInfo: getUserInfo, httpRequest: httpRequest, navigatePageTo: navigatePageTo, reLaunch: reLaunch, onPullDownRefresh: onPullDownRefresh, getStorage: getStorage, setStorage: setStorage}