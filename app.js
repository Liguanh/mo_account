//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    var get_openid = wx.getStorageSync('is_get_openid')//是否获取过openid
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //var user_data = wx.getStorageSync('user_data');
    // 登录
    wx.login({
      success: res => {
        //发起网络请求 发送 res.code 到后台换取 openId, sessionKey, unionId
        var that = this;
        //服务端获取openid的信息并且入库
        wx.request({
          url: this.globalData.request_url + '/api/wechat/openid',
          data: {
            code: res.code,
          },
          success(res) {
            //设置用户数据的本地缓存
            wx.setStorage({
              key: 'user_data',
              data: res.data.data,
            })
          }
        })
      }
    })
  },
  globalData: {
    userInfo: {},
    request_url: "https://www.happyknowshare.cn",
    user_data: null,
  }
})