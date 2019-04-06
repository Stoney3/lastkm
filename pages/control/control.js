// pages/control/control.js
var util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_contents: ['0','0','0'],
    times: ['12:00-14:00','18:00-20:00'],
    time: '12:00-14:00',
    buy_value: '',
    buy_code: '----------',
    free_value: '',
    free_code: '----------',
    order_date: '1970-00-00',
    start_date: '1970-00-00',
    end_date: '1970-00-00',
    salary_name: '',
    user_name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var user_id = wx.getStorageSync('openid')
    var today_date = util.formatDate(new Date())
    that.setData({
      order_date: today_date,
      start_date: today_date,
      end_date: today_date
    })
    wx.request({
      url: app.globalData.globalUrl+'onload_control.php',
      data: {
        user_id: user_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.data!=0) {
          that.setData({
            nav_contents: res.data.contents,
            times: res.data.times,
            time: res.data.times[0]
          })
        }
      }
    })
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
  input_buy_value: function(res) {
    this.setData({
      buy_value: res.detail.value
    })
  },
  input_free_value: function(res) {
    this.setData({
      free_value: res.detail.value
    })
  },
  make_buy_code: function() {
    var that = this
    var user_id = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.globalUrl+'get_convert_code.php',
      data: {
        type: 1,
        user_id: user_id,
        ticket_value: that.data.buy_value
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          buy_code: res.data
        })
      }
    })
  },
  make_free_code: function () {
    var that = this
    var user_id = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.globalUrl+'get_convert_code.php',
      data: {
        type: 0,
        user_id: user_id,
        ticket_value: that.data.free_value
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          free_code: res.data
        })
      }
    })
  },
  orderDateChange: function(res) {
    var that = this
    that.setData({
      order_date: res.detail.value
    })
  },
  timesChange:function(res) {
    var that = this
    that.setData({
      time: that.data.times[res.detail.value]
    })
  },
  inquire_order: function() {
    var that = this
    wx.request({
      url: app.globalData.globalUrl+'get_order_num.php',
      data: {
        order_date: that.data.order_date,
        time: that.data.time
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data != 0) {
          wx.showModal({
            title: '订单数量',
            content: '总量:' + res.data.total + ',小件' + res.data.small + '件,中件' + res.data.middle + '件,大件' + res.data.big + '件.',
            showCancel: false
          })
        }else {
          wx.showModal({
            title: '错误提示',
            content: '错误码'+res.data
          })
        }
      }
    })
  },
  inputUserName: function(res) {
    this.setData({
      user_name: res.detail.value
    })
  },
  inquire_user: function(res) {
    var that = this
    wx.request({
      url: app.globalData.globalUrl+'get_user_ticket.php',
      data: {
        user_nick_name: that.data.user_name
      },
      header: {
        'content-type': 'appication/json'
      },
      method: 'GET',
      success(res) {
        console.log(res)
        if (res.data!=0) {
          wx.showModal({
            title: '客户信息',
            content: '客户的剩余券数:'+res.data.ticket_num+'张,消耗券数:'+res.data.cost_num+'张,兑换券数:'+res.data.convert_num+'张,订单数:'+res.data.place_num+'单.',
            showCancel:false
          })
        }else {
          wx.showToast({
            title: '查询失败',
          })
        }
      }
    })
  },
  inputSalaryName: function(res) {
    this.setData({
      salary_name: res.detail.value
    })
  },
  startDateChange: function (res) {
    var that = this
    that.setData({
      start_date: res.detail.value
    })
  },
  endDateChange: function (res) {
    var that = this
    that.setData({
      end_date: res.detail.value
    })
  },
  inquire_salary: function() {
    var that = this
    wx.request({
      url: app.globalData.globalUrl+'get_salary_num.php',
      data: {
        name: that.data.salary_name,
        start_date: that.data.start_date,
        end_date: that.data.end_date
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data != 0) {
          wx.showModal({
            title: '订单数量',
            content: that.data.salary_name+'的总量:' + res.data.total + ',小件' + res.data.small + '件,中件' + res.data.middle + '件,大件' + res.data.big + '件.',
            showCancel: false
          })
        } else {
          wx.showModal({
            title: '错误提示',
            content: '错误码' + res.data
          })
        }
      }
    })
  }
})