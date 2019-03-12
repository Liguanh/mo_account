//获取应用实例
const app = getApp()
//引入common.js
var util = require('../../utils/util.js');
// pages/user/user.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //用户信息
    userInfo: {},
    count: 0,
    days: 0,
    sign_num:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    var that =this;
    //如果已经有用户信息数据
    if(app.globalData.userInfo){
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }else{//否则手动获取用户的信息
      wx.getUserInfo({
        success: res =>{
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
        }
      })
    }
    this.getUserData();
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
    console.log('tstet');
    this.setData({text:'向下滚动'})
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('向上滚动')
    this.setData({text:'向上滚动'})
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if(res.from == 'button'){
      console.log('按钮分享')
    }
    return {
      title:'用户中心分享',
      path: '/pages/user/user'
    }
  },

  /**
   * 用户页面滚动
   */
  onPageScoll: function(){
    this.setData({text:"页面滚动"})
  },

  /**
   * 用户点击tab使用的信息
   */
  onTabItemTap: function(item){
    console.log(item.index)
  },

  /**
   * 获取用户的数据
   */
  getUserData: function(){
    var that = this;
    var user_data = wx.getStorageSync('user_data');
    wx.request({
      url: app.globalData.request_url+'/api/user/data',
      method: "POST",
      dataType: "json",
      data: {
        openid: user_data.openid
      },
      success(res){
        console.log(res);
        if (res.data.data.sign == null){
          var sign_num = 0;
        }else{
          var sign_num = res.data.data.sign.sign_num;
        }
        that.setData({
          count: res.data.data.count,
          days: res.data.data.days,
          sign_num: sign_num,

        })
      }
    })
  },

  //执行用户的签到的流程
  userSign: function(event){
    var that = this;
    var user_data = wx.getStorageSync('user_data');
    wx.request({
      url: app.globalData.request_url + '/api/user/sign',
      method: "POST",
      dataType: "json",
      data: {
        openid: user_data.openid
      },
      success(res){
        wx.showModal({
          title: '签到提示',
          content: res.data.msg,
          success(res) {
            if (res.confirm) {
              console.log('qu人信息');
              that.getUserData();
            } else if (res.cancel) {
              console.log('取消了签到');
            }
          }
        })
      }
    })
  },
  //获取用户的信息
  getuserinfo(res){
    var user_data = wx.getStorageSync('user_data');
    res.detail.userInfo.openid = user_data.openid;
    wx.request({
      url: app.globalData.request_url+'/api/user/update',
      method: "POST",
      dataType: "json",
      data: res.detail.userInfo,
      success(res){
        if(res.data.status){
          wx.showToast({
            title: '更新成功',
            icon: 'success',
            duration: 3000,
            mask: true,
          });
        }
      }
    })
  }
})