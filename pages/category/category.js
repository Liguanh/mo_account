// pages/category/category.js
const app = getApp();
const openid = wx.getStorageSync('user_data').openid;
const time = 2000;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    category_list: null,
    show_type: 1,
    error_msg: '',//错误信息
    is_show_error: false,//是否显示报错信息
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
    this.getCategoryList();
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

  //切换类型
  changeType: function(event){
    var type = event.currentTarget.dataset.type;

    this.setData({
      show_type: type
    });
    this.getCategoryList()
  },
  //操作类别显示
  handleCategory: function(event){
    var cid = event.currentTarget.id;
    var that =this;
    wx.showActionSheet({
      itemList: ["删除分类"],
      success(res){
        var tapIndex = res.tapIndex;
        //执行类别删除的操作
        if(tapIndex == 0){
          wx.request({
            url: app.globalData.request_url +'/api/charge/category/remove',
            data: {
              id: cid
            },
            method: "post",
            dataType: "json",
            success(res){
              wx.showToast({
                title: res.data.msg,
                icon: 'success',
                mask: true,
                duration: 3000
              });
              that.getCategoryList();
            }
          })
        }
      }
    })
  },
  //获取类别列表
  getCategoryList: function () {
    var user_data = wx.getStorageSync('user_data');
    var that = this;
    wx.request({
      url: app.globalData.request_url +'/api/charge/category',
      data: {
        c_type: that.data.show_type,
        openid: user_data.openid //用户的openid
      },
      method: "POST",
      dataType: "json",
      success(res) {
        var category = res.data.data;
        console.log(category);
        that.setData({
          category_list: category
        })
      }
    })
  }
})