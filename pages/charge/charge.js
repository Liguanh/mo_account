// pages/charge/charge.js
var utils = require("../../utils/util.js");
const duration= 3000;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_date: utils.formatDate(new Date),//当前时间
    c_type: [{name:"收入", value:1},{name:"支出",value:2}],
    show_type: 1,//在选中支出收入的类别
    category_list: null,//收入支出对应的数据类别
    index:0,//默认显示的索引
    error_msg: '',//错误信息
    is_show_error: false,//是否显示报错信息
    loading: false,

    //计算器功能
    back: 'back',
    C: 'C',
    addSub: 'addSub',
    add: '+',
    sub: '-',
    mut: '×',
    div: '÷',
    equ: '=',
    history: 'history',
    dot: '.',
    id0: '0',
    id1: '1',
    id2: '2',
    id3: '3',
    id4: '4',
    id5: '5',
    id6: '6',
    id7: '7',
    id8: '8',
    id9: '9',
    result: '0',
    valiBackOfArray: ['+', '-', '×', '÷', '.'],
    completeCalculate: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

  /**自定义的事件 */
  //订单事件获取
  chargeDate: function(event){
    this.setData({
      current_date: event.detail.value
    })
  },

  //记账类别显示
  set_charge_type: function(event){
    var c_type = event.detail.value; 
    this.setData({
      show_type: c_type,
      index: 0,
    })
    this.getCategoryList();
  },
//选择对应的类别
  selectCategory: function(event){
    var key = event.detail.value;

    this.setData({
      index: key
    })
    console.log(event);
  },

  //显示计算器
  show_cal: function(event){
    this.setData({
      completeCalculate: false,
    })
  },

  /**
   * 保存记账的信息
   */
  saveChargeInfo: function(event){
    var that = this;
    var user_data = wx.getStorageSync('user_data');
    var sumbitData = event.detail.value;
    sumbitData.openid = user_data.openid;
    console.log(sumbitData);
    that.setData({
      loading:true
    })
    if (sumbitData.amount == "") {
      that.setData({
        is_show_error: true,
        error_msg: "记账金额不能为空",
        loading: false
      });
      return false;
    }

    //数据校验
    if (sumbitData.note == "") {
      that.setData({
        is_show_error: true,
        error_msg: "备注信息不能为空",
        loading: false
      });
      return false;
    }

    that.setData({
      is_show_error: false,
      error_msg: "",
      loading: false
    });
    /**
     * 提交保存的数据
     */
    wx.request({
      url: app.globalData.request_url +'/api/charge/store',
      data: sumbitData,
      method: "post",
      dataType: "json",
      success(res) {
        if(res.data.status == true){
          wx.showToast({
            title: res.data.msg,
            icon: "success",
            duration:duration,
            mask: true
          })
          
        }else{
          that.setData({
            is_show_error: true,
            error_msg: res.data.msg,
            loading: false,
          });
        }
      }
    })
  },
  //获取类别列表
  getCategoryList: function(){
    var user_data = wx.getStorageSync('user_data');
    var that = this;
    wx.request({
      url: app.globalData.request_url +'/api/charge/category',
      data: {
        c_type: that.data.show_type,
        openid: user_data.openid
      },
      method: "POST",
      dataType: "json",
      success(res){
        var category = res.data.data;
        console.log(category);
        that.setData({
          category_list: category
        })
      }
    })
  },
  /**自定义的事件 */


  /**
   * 计算器相关的功能
   */

  // 计算结果

  calculate: function (str) {

    // 判断是不是有负数

    var isNagativeNum = false;

    if (str.charAt(0) == '-') {

      str = str.replace('-', '').replace('(', '').replace(')', '');

      isNagativeNum = true;

    }

    // 对字符串解析并运算

    var addArray = str.split('+');

    var sum = 0.0;

    for (var i = 0; i < addArray.length; i++) {

      if (addArray[i].indexOf('-') == -1) {

        if (addArray[i].indexOf('×') != -1 || addArray[i].indexOf('÷') != -1)

          sum += this.calculateMutDiv(addArray[i]);

        else sum += Number(addArray[i]);

      }

      else {

        var subArray = addArray[i].split('-');

        var subSum = 0;

        if (subArray[0].indexOf('×') != -1 || subArray[0].indexOf('÷') != -1) subSum = this.calculateMutDiv(subArray[0]);

        else subSum = Number(subArray[0]);

        for (var j = 1; j < subArray.length; j++) {

          if (subArray[i].indexOf('×') != -1 || subArray[i].indexOf('÷') != -1)

            subSum -= this.calculateMutDiv(subArray[j]);

          else subSum -= Number(subArray[j]);

        }

        sum += subSum;

      }

    }

    if (isNagativeNum) return (-sum).toString();

    else return sum.toString();

  },

  // 分块乘除运算

  calculateMutDiv: function (str) {

    var addArray = str.split('×');

    var sum = 1.0;

    for (var i = 0; i < addArray.length; i++) {

      if (addArray[i].indexOf('÷') == -1) {

        sum *= Number(addArray[i]);

      }

      else {

        var subArray = addArray[i].split('÷');

        var subSum = Number(subArray[0]);

        for (var j = 1; j < subArray.length; j++) {

          subSum /= Number(subArray[j]);

        }

        sum *= subSum;

      }

    }

    return sum;

  },

  // 是否以运算符结尾

  isOperatorEnd: function (str) {

    for (var i = 0; i < this.data.valiBackOfArray.length; i++) {

      if (str.charAt(str.length - 1) == this.data.valiBackOfArray[i]) return true;

    }

    return false;

  },

  clickButton: function (event) {

    if (this.data.result == 0) {

      if (event.target.id == 'back' || event.target.id == 'C' || event.target.id == 'addSub' || event.target.id == 'history' || event.target.id == '+' || event.target.id == '-' || event.target.id == '×' || event.target.id == '÷' || event.target.id == '=') return;

      this.setData({ result: event.target.id });

    }

    else if (event.target.id == 'back') {

      this.setData({ result: this.data.result.length == 1 ? '0' : this.data.result.substring(0, this.data.result.length - 1) });

    }

    else if (event.target.id == 'C') {

      this.setData({ result: '0' });

    }

    else if (event.target.id == 'addSub') {

      var r = this.data.result;

      if (this.isOperatorEnd(r)) return;

      if (r.charAt(0) == '-') this.setData({ result: r.replace('-', '').replace('(', '').replace(')', '') });

      else this.setData({ result: '-(' + r + ')' });

    }

    else if (event.target.id == 'history') {



    }

    else if (event.target.id == '=') {

      if (this.isOperatorEnd(this.data.result)) return;

      this.setData({ result: this.calculate(this.data.result) });

      this.setData({ completeCalculate: true });

    }

    else {

      if (this.isOperatorEnd(this.data.result) && this.isOperatorEnd(event.target.id)) return;

      // 如果计算结果有小数点，直到输入运算符前不能再输入小数点

      if (this.data.completeCalculate && this.data.result.indexOf('.') != -1 && event.target.id == '.') return;

      for (var i = 0; i < this.data.valiBackOfArray.length - 1; i++) {

        if (this.data.valiBackOfArray[i] == event.target.id) {

          this.setData({ completeCalculate: false });

          break;

        }

      }

      this.setData({ result: this.data.result + event.target.id });

    }

  }
})