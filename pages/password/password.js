// pages/password/password.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: ''
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
  inputPassword: function(res) {
    this.setData({
      password: res.detail.value
    })
  },
  toControl: function() {
    var that = this
    wx.request({
      url: app.globalData.globalUrl+'check_password.php',
      data: {
        password: that.data.password
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success(res) {
        console.log(res)
        if (res.data == 1) {
          wx.navigateTo({
            url: '../control/control'
          })
        } else {
          wx.showModal({
            title: '错误提示',
            content: '您输入的密码有误',
            showCancel: false
        
          })
        }
      }
    })
  }
})