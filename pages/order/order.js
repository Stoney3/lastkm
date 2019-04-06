// pages/order/order.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDefault: true,
    defaultAddress: {
      name: '',
      phone: '',
      college: '',
      branch: '',
      apartment: '',
      room: ''
    },
    add_address_content: '添加收货地址',
    files: '',
    focus_mid: false,
    focus_post: false,
    target_date:'1970-01-01',
    start_date: '1970-01-01',
    end_date: '1970-01-01',
    target_time_array: ["12:00-14:00","18:00-20:00"],
    target_time_index: '0',
    need_pieces: '0',
    need_piecesArray: [],
    ticket_num: '0',
    image_path: '',
    show_pro_code: false,
    pre_value: '',
    mid_value: '',
    post_value: '',
    button_show: false,
    button_word: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user_id = wx.getStorageSync('openid')
    var start_date = util.formatDate(new Date())
    var end_date = util.formatNextSevenDate(new Date())

    var that = this
    that.setData({
      start_date : start_date,
      end_date: end_date,
      target_date: start_date
    })
    wx.request({
      url: app.globalData.globalUrl+'order_onload.php',
      data: {
        user_id: user_id,
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success:function(res) {
        //console.log(res.data)
        //处理默认地址
        if (!res.data.address) {
          that.setData({
            isDefault: false
          })
        }
        else {
          that.setData({
            isDefault: true,
            ['defaultAddress.name']: res.data.address.receiver_name,
            ['defaultAddress.phone']: res.data.address.receiver_phone_num,
            ['defaultAddress.college']: res.data.address.college,
            ['defaultAddress.branch']: res.data.address.branch_school,
            ['defaultAddress.apartment']: res.data.address.apartment_num,
            ['defaultAddress.room']: res.data.address.room_num,
            
          })
          
        }
        //处理共享券张数
        that.setData({
          ticket_num: res.data.ticket_num,
          target_time_array: res.data.times,
          need_piecesArray: res.data.need_piecesArray,
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
    /*这里完成的功能是从edit页面编辑回来后的显示*/
    if (wx.getStorageSync('name')) {
      var that = this
      that.setData({
        isDefault: true,
        ['defaultAddress.name']: wx.getStorageSync('name'),
        ['defaultAddress.phone']: wx.getStorageSync('phone'),
        ['defaultAddress.college']: wx.getStorageSync('college'),
        ['defaultAddress.branch']: wx.getStorageSync('branch_school'),
        ['defaultAddress.apartment']: wx.getStorageSync('apartment'),
        ['defaultAddress.room']: wx.getStorageSync('room'),

      })
    }else {
      console.log("没有缓存")
    }
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
  /*  用户选择短信照片  */
  chooseImage: function () {
    var that = this

    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album'],
      success: function(res) {
        that.setData({
          files: res.tempFilePaths
        })
      },
    })
    
  },
  previewImage: function() {
    var ulr = this.data.files
    wx.previewImage({
      urls: ulr
    })
  },
  isEnough: function(res) {
    var that = this
    switch(res.detail.value) {
      case '1':
        that.setData({
          need_pieces: that.data.need_piecesArray[0]
        })
        break;
      case '2':
        that.setData({
          need_pieces: that.data.need_piecesArray[1]
        })
        break;
      case '3':
        that.setData({
          need_pieces: that.data.need_piecesArray[2],
          target_time_index: 1
        })
        break;
    }
    /*将用户导航置button页面*/
    if (parseInt(this.data.need_pieces) > parseInt(this.data.ticket_num)) {
      wx.showModal({
        title: '用户提醒',
        content: '您的余量不足,请先获取或兑换',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../button/button',
            })
          }
        }
      })
    }
  },
  inputPre:function(res) {
    var that = this
    /*precode焦点长度为2时自动换焦点*/
    if (res.detail.cursor == 2) {
      that.setData({
        focus_mid: true,
        focus_post: false
      })
    }
    that.setData({
      pre_value: res.detail.value
    })
  },
  inputMid: function (res) {
    var that = this
    if (res.detail.cursor == 1) {
      that.setData({
        focus_mid: false,
        focus_post: true
      })
    }
    that.setData({
      mid_value: res.detail.value
    })
  },
  inputPost: function(res) {
    this.setData({
      post_value: res.detail.value
    })
  },
  dateChange: function(res) {
    console.log(res)
    this.setData({
      target_date: res.detail.value
    })
  },
  timeChange: function(res) {
    //console.log(res),value以0开头,0,1,2
    var that = this
    if (that.data.need_pieces == 4) {
      if (res.detail.value != 1) {
        wx.showModal({
          title: '用户提示',
          content: '您好,大件物品统一晚上配送',
          showCancel: false
        })
      }
    }else {
      that.setData({
        target_time_index: res.detail.value
      })
    }
  },
  toBuy: function(res) {
    wx.navigateTo({
      url: '../button/button'
    })
  },
  formSubmit: function(res) {
    var that = this

    var user_id = wx.getStorageSync('openid')
    var volume = res.detail.value.volume
    var cost = this.data.need_pieces
    var code_pre = that.data.pre_value
    var code_mid = that.data.mid_value
    var code_post = that.data.post_value
    var target_date = res.detail.value.target_date
    var target_time = that.data.target_time_array[that.data.target_time_index]
    var image_path

    if (!that.data.isDefault) {
      wx.showModal({
        title: '用户提示',
        content: '请填写默认地址',
        showCancel: false
      })
      return;
    }

    if (volume.length == 0) {
      wx.showModal({
        title: '用户提示',
        content: '请选择快递大小',
        showCancel: false
      })
      return;
    }
    

    if (code_mid.length == 0 || code_mid.length == 0 || code_post.length == 0) {
      wx.showModal({
        title: '用户提示',
        content: '请选择快递公司!',
        showCancel: false
      })
      return;
    }

    if (parseInt(this.data.need_pieces) > parseInt(this.data.ticket_num)) {
      wx.showModal({
        title: '用户提示',
        content: '您的共享券余额不足,请获取或兑换',
        showCancel: false
      })
      return;
    }

    var myDate = new Date();
    var myYear = myDate.getFullYear()
    var myMonth = myDate.getMonth()+1
    var myDay = myDate.getDate()
    var myHour = myDate.getHours()
    var myMinute = myDate.getMinutes()
    var tarDateArray = that.data.target_date.split("-")
    var tarYear = tarDateArray[0];
    var tarMonth = tarDateArray[1];
    var tarDay = tarDateArray[2];
    if (that.data.target_time_index == 0) {
      if ((myYear <= tarYear) && (myMonth <= tarMonth)) {
        if (myDay < tarDay) {
          //如果在前一天下单的话不论时间多少都可以
        }else {
          //如果是同一天下单的话
          if ((myYear == tarYear) && (myMonth == tarMonth) && (myDay == tarDay)) {
            if (myHour < 12) {
              //如果是同一天下单且时间在12之前的话的话可以
            }
            else {
              wx.showModal({
                title: '用户提示',
                content: '此时间段您需要在当天12:00前下单，您可以尝试下傍晚时间段的单。',
                showCancel: false
              })
              return
            }
          }
        }
      }
    }

    if (that.data.target_time_index == 1) {
      if ((myYear <= tarYear) && (myMonth <= tarMonth)) {
        if (myDay < tarDay) {
          //如果在前一天下单的话不论时间多少都可以
        } else {
          //如果是同一天下单的话
          if ((myYear == tarYear) && (myMonth == tarMonth) && (myDay == tarDay)) {
            if (myHour < 18) {
              //如果是同一天下单且时间在18之前的话的话可以
            }
            else {
              wx.showModal({
                title: '用户提示',
                content: '此时间段您需要在当天18:00前下单，您可以尝试下明天的单。',
                showCancel: false
              })
              return
            }
          }
        }
      }
    }

    wx.showToast({
      title: '正在下单',
      icon: 'loading',
      duration: 2000
    })
    wx.uploadFile({
      url: app.globalData.globalUrl+'save_express_image.php',
      filePath: this.data.files[0],
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        target_date: that.data.target_date,
        target_time: that.data.target_time_array[that.data.target_time_index],
        code_pre: code_pre,
        code_mid: code_mid,
        code_post: code_post,
        college: that.data.defaultAddress.college,
        branch: that.data.defaultAddress.branch
      },
      /*上传图片成功后再提交表单数检查*/
      success: function (res) {
        image_path = res.data
        /*返回的快递图片存储相对地址,用于表单数据提交,存储到数据库中,
        以便后面请求对应订单的图片*/
        wx.request({
          url: app.globalData.globalUrl+'place_order.php',
          data: {
            user_id: user_id,
            volume: volume,
            cost: cost,
            code_pre: code_pre,
            code_mid: code_mid,
            code_post: code_post,
            target_date: target_date,
            target_time: target_time,
            image_path: image_path
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function (res) {
            console.log(res)
            /*11表明增加订单成功并且更改用户订单数成功*/
            if (res.data == 11) {
              wx.hideToast()
              wx.showToast({
                title: '下单成功',
                icon: 'success',
                duration: 2000
              })
              wx.switchTab({
                url: '../index/index',
              })
            }
            else {
              wx.hideToast()
              wx.showModal({
                title: '下单失败',
                content: '请联系客服,失败码'+res.data,
                success:function(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '../service/service',
                    })
                  }
                }
              })
            }
          },
          fail: function (res) {
            wx.hideToast()
            wx.showModal({
              title: '用户提示',
              content: '下单失败,请联系客服'.res.data,
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../service/service',
                  })
                }
              }
            })
          }
        })
      },
      
      fail: function(res) {
        console.log(res)
        wx.hideToast()
        wx.showModal({
          title: '用户提示',
          content: '快递图片上传失败,请联系客服',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../service/service',
              })
            }
          }
        })
        return;
      }
    })  
  },
  show_pro_code: function(res) {
    var that = this
    console.log(res)
    /*菜鸟驿站*/
    if (res.detail.value == 1) {
      that.setData({
        show_pro_code: true
      })
    }else if(res.detail.value == 2) {
      /*顺丰快递*/
      that.setData({
        pre_value: '00',
        mid_value: '0',
        post_value: '0000'
      })
    }else if (res.detail.value == 3) {
      /*京东快递*/
      that.setData({
        pre_value: '00',
        mid_value: '0',
        post_value: '0001'
      })
    }
  }
})