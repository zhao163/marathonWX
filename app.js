const APP_ID = 'wxe6eef2d9c8d135a6';//小程序appid
const APP_SECRET = 'a63ca665d8fe991925875be96bc9892a';//小程序app_secret
var SESSION_KEY = ''//session_key
import { showModal, format } from "./utils/util.js"
import http from "./api/service.js"

App({
  globalData: {
    activityTime: {}
  },

  getActivityTime: function () {
    var params = {
      url: '/userVerify/getUserActivityTime',
      data: {},
      method: 'GET'
    }
    http.httpRequest(params).then(res => {
      http.setStorage('activityTime',  res.data)
      res.code == 200 ? this.globalData.activityTime = res.data : ''
    })
  },

  onShow:function(){
    this.getActivityTime();
    this.getPhone();
  },

  onLaunch: function () {
  },
  getPhone:function(){
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        if ((res.model.indexOf("iPhone X")!= -1) ) {
          that.globalData.isIPX = true;
        }
      }
    })
  }, 
  //从前台进入后台
  onHide: function() {
  },
  //监听页面卸载
  onUnload: function() {
  }
})
