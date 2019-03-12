// pages/home/home.js
const app = getApp();

const time = 3000;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrls: [
      '../../static/images/1.png',
      '../../static/images/2.png',
      '../../static/images/3.png'
    ],
    indicatorcolor: "#ff0000",
    indicatordots: true,
    autoplay:true,
    circular: true,
    interval: 2000,
    duration: 500,
    home_charge_record: {},
    income: '0.00',
    pay_out: '0.00',
    left: '0.00',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(function () {
      wx.hideLoading()
    }, time);
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
    //获取首页的数据列表
    this.getHomeCharge();
    //首页的统计数据
    this.getHomeData();
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

  },
  
  //获取首页用户记账的列表
  getHomeCharge: function(){
    var user_data = wx.getStorageSync('user_data');
    var that = this;
    wx.request({
      url: app.globalData.request_url +'/api/charge/record/today',
      data: {
        openid: user_data.openid
      },
      method: "POST",
      dataType: "json",
      success(res) {
          that.setData({
            home_charge_record: res.data.data
          })
      }
    })
  },
  
  //首页获取数据统计信息
  getHomeData: function(){
    var user_data = wx.getStorageSync('user_data');
    var that = this;
    wx.request({
      url: app.globalData.request_url + '/api/charge/data',
      data: {
        openid: user_data.openid
      },
      method: "POST",
      dataType: "json",
      success(res) {
        if(res.data.data !=""){
          that.setData({
            income: res.data.data.income,
            pay_out: res.data.data.pay_out,
            left: res.data.data.left,
          })
        }
        
      }
    })
  },

  /**
   * 删除记录的操作
   */
  removeRecord: function (event) {
    var id = event.currentTarget.id;
    var that = this;
    wx.showActionSheet({
      itemList: ['删除记账'],
      success(res) {
        var tapIndex = res.tapIndex;

        //执行类别删除的操作
        if (tapIndex == 0) {
          wx.request({
            url: app.globalData.request_url + '/api/charge/remove',
            data: {
              id: id
            },
            method: "post",
            dataType: "json",
            success(res) {
              that.getHomeCharge();
              that.getHomeData();
              wx.showToast({
                title: res.data.msg,
                icon: 'success',
                mask: true,
                duration: 3000,
              });
             
            }
          })
        }
      }
    })
  }
  
})