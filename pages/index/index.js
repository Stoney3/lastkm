//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isAgree: true
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    if (this.data.hasUserInfo) {
      /*如果用户已经授权用户信息的话每次登陆则更新用户信息*/
      var user_id = wx.getStorageSync('openid')
      wx.request({
        url: app.globalData.globalUrl+'sign.php',
        data: {
          user_id: user_id,
          nick_name: this.data.userInfo.nickName,
          gender: this.data.userInfo.gender,
          city: this.data.userInfo.city,
          province: this.data.userInfo.province,
          country: this.data.userInfo.country
        },
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res)
        },
        fail: function (res) {
          //console.log(res)
        }
      })
    }
  },
  getUserInfo: function(e) { 
    var that = this
    if(e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      var user_id = wx.getStorageSync('openid')
      wx.request({
        url: app.globalData.globalUrl+'sign.php',
        data: {
          user_id: user_id,
          nick_name: this.data.userInfo.nickName,
          gender: this.data.userInfo.gender,
          city: this.data.userInfo.city,
          province: this.data.userInfo.province,
          country: this.data.userInfo.country
        },
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data == 2) {
            wx.showModal({
              title: '用户提示',
              content: '您的用户信息插入失败!请联系管理员。',
            })
          }
        },
        fail: function (res) {
          //console.log(res)
        }
      })
    }
    //console.log(app.globalData.userInfo)
  },
  toAuthorize: function () {
    wx.navigateTo({
      url: '../authorize/authorize'
    })
  },
  toOrder: function(){
    if (this.data.isAgree&&this.data.hasUserInfo) {
      wx.navigateTo({
        url: '../order/order'
      })
    }
    else if (!this.data.hasUserInfo) {
      wx.showModal({
        title: '用户提示',
        content: '请授权用户信息。'
        
      })
    }
    else {
      wx.showModal({
        title: '用户提示',
        content: '请先阅读用户须知。',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../agreement/agreement',
            })
          }
        }
      })
    }
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  //事件处理函数
  bindViewTap: function () {
    wx.switchTab({
      url: '../home/home',
    })
  }
})
