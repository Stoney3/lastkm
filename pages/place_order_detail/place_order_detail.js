// pages/place_order_detail/place_order_detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_code: '---------',
    product_cost: '',
    express_role: '工作人员',
    phone_num: '',
    target_time: '1970-01-01 00:00:00',
    start_time: '1970-01-01 00:00:00',
    accept_time: '1970-01-01 00:00:00',
    send_time: '1970-01-01 00:00:00',
    arrive_time: '1970-01-01 00:00:00',
    end_time: '1970-01-01 00:00:00',
    is_convert: false,
    convert_code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    if (options.if_collect == 1) {
      that.setData({
        is_convert: true
      })
    }
    wx.request({
      url: app.globalData.globalUrl+'onload_order_detail.php',
      data: {
        order_code: options.order_code
      },
      method: 'GET',
      header: {
        'content-type':'application/json'
      },
      success(res) {
        console.log(res)
        that.setData({
          order_code: options.order_code,
          product_cost: res.data.cost,
          express_role: res.data.courier,
          phone_num: res.data.phone_num,
          target_time: res.data.target_time,
          start_time: res.data.start_time,
          accept_time: res.data.accept_time,
          send_time: res.data.send_time,
          arrive_time: res.data.arrive_time,
          end_time: res.data.end_time,
          convert_code: res.data.convert_code
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
  ran: function() {
    wx.navigateBack({
      dleta: 1
    })
  }
})