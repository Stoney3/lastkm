// pages/buy/buy.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timestart: '',
    timeend: '',
    imgUrl: ''
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
  timestart: function (e) {
    var _this = this;
    _this.setData({ timestart: e.timeStamp });
  },
  //点击结束的时间
  timeend: function (e) {
    var _this = this;
    _this.setData({ timeend: e.timeStamp });
  },

  //保存图片
  saveImg: function (e) {
    var _this = this;
    var times = _this.data.timeend - _this.data.timestart;
    if (times > 300) {
      console.log("长按");
      
      wx.getSetting({
        success: function (res) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function (res) {
              console.log("授权成功");
              
              wx.getImageInfo({
                src: '../../images/buy.jpg',
                success: function(res) {
                  _this.setData({
                    imgUrl: res.path
                  })
                }
              })
              
              wx.saveImageToPhotosAlbum({
                filePath: _this.data.imgUrl,//返回的临时文件路径，下载后的文件会存储到一个临时文件
                success: function (res) {
                  wx.showToast({
                    title: '成功保存到相册',
                    icon: 'success'
                  })
                }
              })
            }
          })
        }
      })
    }
  }
})