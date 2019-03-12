// pages/charge/list.js
const app = getApp();
const utils = require('../../utils/util.js');
const time = 2000;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_date: utils.formatMonth(new Date),
    charge_record: null,//记账记录
    page:1,
    total_page: null,
    c_type: [{ name: "全部", value: '' },{ name: "支出", value: 1 }, { name: "收入", value: 2 }],
    index:0,
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
    this.getChargeRecord();
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
    console.log('tset');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('tset1');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取用户记账记录的列表
  getChargeRecord: function(){
    var user_data = wx.getStorageSync('user_data');
    var that = this;
    wx.request({
      url: app.globalData.request_url +'/api/charge/record/list',
      data: {
        openid: user_data.openid,
        page: that.data.page,
        charge_date: that.data.current_date,
        c_type: that.data.c_type[that.data.index].value
      },
      method: "POST",
      dataType: "json",
      success(res){
        that.setData({
          charge_record: res.data.data.data,
          total_page: res.data.data.last_page,
        })
      }
    })
  },
  //选择查询的日期
  selectDate: function(event){
    this.setData({
      current_date: event.detail.value
    })

    this.getChargeRecord();
  },
  /** 选择类型 */
  selectType: function(event){
    this.setData({
      index: event.detail.value
    });
    this.getChargeRecord();
  },

  /**
   * 删除记录的操作
   */
  removeRecord: function(event){
    var id=event.currentTarget.id;
    var that = this;
    wx.showActionSheet({
      itemList: ['删除记账'],
      success(res){
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
              wx.showToast({
                title: res.data.msg,
                icon: 'success',
                mask: true,
                duration: 3000
              });
              that.getChargeRecord();
            }
          })
        }
      }
    })
  }
})