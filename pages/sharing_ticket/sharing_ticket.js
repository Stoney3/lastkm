// pages/sharing_ticket/sharing_ticket.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0,
    use: 0,
    totalConvert: 0,
    button_show: false,
    button_word: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var user_id = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.globalUrl + 'onload_sharing_ticket.php',
      data: {
        user_id: user_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          balance: res.data.balance,
          use: res.data.use,
          totalConvert: res.data.totalConvert,
          button_show: res.data.button_show,
          button_word: res.data.button_word
        })
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
    var that = this
    var user_id = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.globalUrl + 'onload_sharing_ticket.php',
      data: {
        user_id: user_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          balance: res.data.balance,
          use: res.data.use,
          totalConvert: res.data.totalConvert,
          button_show: res.data.button_show,
          button_word: res.data.button_word
        })
      }
    })
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
  toBuy: function() {
    wx.navigateTo({
      url: '../button/button'
    })
  },
  toConvert: function() {
    wx.navigateTo({
      url: '../convert/convert',
    })
  }
})