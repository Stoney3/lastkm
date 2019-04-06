// pages/convert/convert.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    convert_code: ''
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
  bindSave: function(e) {
    console.log(e)
    var that = this
    var convert_code = e.detail.value.amount
    var user_id = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.globalUrl+'convert.php',
      data: {
        convert_code: convert_code,
        user_id: user_id
      },
      method: 'GET',
      header: {
        'content-type':'application/json'
      },
      success: function(res) {
        if (res.data == 0) {
          wx.showToast({
            title: '兑换成功',
          })
          that.setData({
            convert_code: ''
          })
        }else if(res.data == 1){
          wx.showModal({
            title: '兑换失败',
            content: '您的兑换码已经兑换过了!',
            showCancel: false
          })
        }else if (res.data == 2) {
          wx.showModal({
            title: '兑换失败',
            content: '您输入的兑换码不存在!',
            showCancel: false
          })
        }else {
          wx.showModal({
            title: '兑换失败',
            content: '兑换错误码为'+res.data+'请联系客服!',
            success: function(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../service/service',
                })
              }
            }
          })
          
        }
        
      }
    })
  }
})