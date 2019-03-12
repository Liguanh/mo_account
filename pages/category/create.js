// pages/category/create.js
const app = getApp();
const time = 3000;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info: null,
    c_type: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    this.setData({
      c_type: query.type
    });
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

  },

  /**
   * 保存类型数据
   */
  categorySave: function(event){
    var that = this;
    var user_data = wx.getStorageSync('user_data');
    var sumbitData = event.detail.value;
    sumbitData.openid = user_data.openid;
    sumbitData.c_type = this.data.c_type;

    if(sumbitData.cate_name == ""){
      that.setData({
        is_show_error: true,
        error_msg: "类别名称不能为空",
        loading: false
      });
      return false;
    }

    wx.request({
      url: app.globalData.request_url +'/api/charge/category/store',
      data: sumbitData,
      dataType: "json",
      method: "post",
      success: function(res){
        //返回上级页面
        wx.navigateTo({
          url: '/pages/category/category',
        });
      }
    })
  },
})