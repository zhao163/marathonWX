const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

var format = time => {
  return time ? new Date(time.replace(/\-/g, '/')).getTime() : new Date().getTime()
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
})

var showLoading = () => wx.showLoading({
  title: '加载...',
  mask: true
})


var showDialog = (title, icon, time, mask) => wx.showToast({
  title: title,
  icon: icon,
  duration: time,
  mask: mask
})

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
})

var showErr = text => wx.showToast({
  title: text,
  icon: 'none'
})


// 显示失败提示
var showModel = (title, content) => {
  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  })
}
var time = {
  url: '/Answer/getNowDate',
  data: {},
  method: 'POST'
}

module.exports = { formatTime, showBusy, showSuccess, showModel, showErr, showDialog, showLoading, format, time }
