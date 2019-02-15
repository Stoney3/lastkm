//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    switchInfor: "switchInfor",
    switchTip: "switchTip",
    switchPitchValue: true,
    false: "false",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isAgree: false
  },
  //事件处理函数
  bindViewTap: function() {
    console.log("点击了")
    //好像不能导航去home页面
  },
  onLoad: function () {
    console.log(app.globalData.userInfo)
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
  },
  getUserInfo: function(e) {
    console.log(e)
    wx.request({
      url: 'http://zhygl.com/sign.php',
      data: {
        open_id: wx.getStorageSync('openid'),
        nick_name:e.detail.userInfo.nickName,
        gender: e.detail.userInfo.gender,
        city: e.detail.userInfo.city,
        province: e.detail.userInfo.province,
        county: e.detail.userInfo.county,
      },
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success:function (res) {
        console.log("获取用户信息成功")
      },
      fail:function(res) {
        console.log("获取用户信息失败")
      }
    })
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  toOrder: function(){
    if (this.data.isAgree&&this.data.hasUserInfo&&this.data.switchPitchValue) {
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
  toAgreement: function(){
    wx.navigateTo({
      url: '../agreement/agreement'
    })
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  }
})
