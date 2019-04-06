const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isApprove: 1,
    hasTickets: 12,
    isWork: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
    var user_id = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.globalUrl+'home_onload.php',
      data: {
        user_id: user_id,
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        that.setData({
          isApprove: res.data.isApprove,
          hasTickets: res.data.hasTickets,
          isWork: res.data.isWork
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
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
    var user_id = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.globalUrl+'home_onload.php',
      data: {
        user_id: user_id,
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        that.setData({
          isApprove: res.data.isApprove,
          hasTickets: res.data.hasTickets,
          isWork: res.data.isWork
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
  toPlaceOrder: function() {
    wx.navigateTo({
      url: '../place_order/place_order?activeIndex=0'
    })
  },
  toSharingTicket: function() {
    wx.navigateTo({
      url: '../sharing_ticket/sharing_ticket'
    })
  },
  toApprove: function() {
    wx.navigateTo({
      url: '../approve/approve'
    })
  },
  toWantOrder: function() {
    wx.navigateTo({
      url: '../want_order/want_order'
    })
  },
  toCollectOrder: function() {
    wx.navigateTo({
      url: '../collect_order/collect_order?activeIndex=0'
    })
  },
  toEdit:function() {
    wx.navigateTo({
      url: '../edit/edit'
    })
  },
  toService: function() {
    wx.navigateTo({
      url: '../service/service',
    })
  },
  toControl: function() {
    if (this.data.isWork > 0) {
      wx.navigateTo({
        url: '../password/password',
        
      })
    }
  }
})