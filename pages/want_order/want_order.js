// pages/want_order/want_order.js
const app = getApp()
/*这个页面没有下拉得到更新数据,因为普通用户和工作人员都用不到*/
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["日期", "时间", "楼寓", "大小"],
    contents: ["19-2-29", "12:00-14:00", "0", "小件"],
    /*这个数组的前三个会再onload初始化,其中0为当前日期,1为时间数组里面的第一个,2为公寓里面第一个*/
    start_date: '',
    end_date: '',
    times: [],
    apartments: [],
    volume: ['小件','中件', '大件', '中小件'],
    nav_bar_height: '',
    scroll_height: '',
    bottom_bar_height: '',
    checkboxItems: [],
    week_num: 0,
    if_approve: 0,    //是否认证,从后台得到数据,
    if_work: 0,
    now_item_num: 10,//本页面现在需要的数据量,因为没必要划到底部,所以就只需要固定10
    checked_values: [], //被选择的订单code数组
    order_sum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          nav_bar_height: 0.12 * (res.windowHeight),
          scroll_height: 0.80 * (res.windowHeight),
          bottom_bar_height: 0.08 * (res.windowHeight)
        })
      },
    })
    var start_date = util.formatDate(new Date())
    var end_date = util.formatNextSevenDate(new Date())
    that.setData({
      start_date: start_date,
      end_date: end_date,
      ['contents[0]']: start_date
    })
    var user_id = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.globalUrl+'firstonload_want_order.php',
      data: {
        user_id: user_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

        that.setData({
          times: res.data.time,
          apartments: res.data.apartments,
          week_num: res.data.week_num,
          if_approve: res.data.if_approve,
          if_work: res.data.if_work,
          ['contents[1]']: res.data.time[0],
          ['contents[2]']: res.data.apartments[0],
        })

        if (that.data.if_approve > 0) {
          var volume;
          switch (that.data.contents[3]) {
            case '小件':
              volume = 1;
              break;
            case '中件':
              volume = 2;
              break;
            case '大件':
              volume = 3;
              break;
            case '中小件':
              volume = 4;
              break;
            default:
              break;
          }
          wx.request({
            url: app.globalData.globalUrl + 'onload_want_order.php',
            data: {
              user_id: user_id,
              date: that.data.contents[0],
              time: that.data.contents[1],
              apartment: that.data.contents[2],
              volume: volume,
              now_item_num: that.data.now_item_num
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function (res) {
              that.setData({
                checkboxItems: res.data
              })
            },
            fail: function (res) {
              console.log(res);
            }
          })

        } else {
          return;
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
    var that = this
    var user_id = wx.getStorageSync('openid')
    if (that.data.if_approve > 0) {
      var volume;
      switch (that.data.contents[3]) {
        case '小件':
          volume = 1;
          break;
        case '中件':
          volume = 2;
          break;
        case '大件':
          volume = 3;
          break;
        case '中小件':
          volume = 4;
          break;
        default:
          break;
      }
      wx.request({
        url: app.globalData.globalUrl + 'onload_want_order.php',
        data: {
          user_id: user_id,
          date: that.data.contents[0],
          time: that.data.contents[1],
          apartment: that.data.contents[2],
          volume: volume,
          now_item_num: that.data.now_item_num
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          that.setData({
            checkboxItems: res.data
          })
        },
        fail: function (res) {
          console.log(res);
        }
      })

    } else {
      return;
    }
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
  datechange: function(e) {
    var that = this
    this.setData({
      ['contents[0]']: e.detail.value
    })
    if (that.data.if_approve > 0) {
      var volume;
      var user_id = wx.getStorageSync('openid')
      switch (that.data.contents[3]) {
        case '小件':
          volume = 1;
          break;
        case '中件':
          volume = 2;
          break;
        case '大件':
          volume = 3;
          break;
        case '中小件':
          volume = 4;
          break;
        default:
          break;
      }
      wx.request({
        url: app.globalData.globalUrl+'onload_want_order.php',
        data: {
          user_id: user_id,
          date: that.data.contents[0],
          time: that.data.contents[1],
          apartment: that.data.contents[2],
          volume: volume,
          now_item_num: that.data.now_item_num
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          that.setData({
            checkboxItems: res.data,

          })
        },
        fail: function (res) {
        }
      })

    } else {
      return;
    }
  },
  timechange: function(e) {
    var that = this
    this.setData({
      ['contents[1]']: that.data.times[e.detail.value]
    })
    if (that.data.if_approve > 0) {
      var volume;
      var user_id = wx.getStorageSync('openid')
      switch (that.data.contents[3]) {
        case '小件':
          volume = 1;
          break;
        case '中件':
          volume = 2;
          break;
        case '大件':
          volume = 3;
          break;
        case '中小件':
          volume = 4;
          break;
        default:
          break;
      }
      wx.request({
        url: app.globalData.globalUrl+'onload_want_order.php',
        data: {
          user_id: user_id,
          date: that.data.contents[0],
          time: that.data.contents[1],
          apartment: that.data.contents[2],
          volume: volume,
          now_item_num: that.data.now_item_num
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          that.setData({
            checkboxItems: res.data
          })
        },
        fail: function (res) {
        }
      })

    } else {
      return;
    }
  },
  apartmentchange: function(e) {
    var that = this
    this.setData({
      ['contents[2]']: that.data.apartments[e.detail.value]
    })
    if (that.data.if_approve > 0) {
      var volume;
      var user_id = wx.getStorageSync('openid')
      switch (that.data.contents[3]) {
        case '小件':
          volume = 1;
          break;
        case '中件':
          volume = 2;
          break;
        case '大件':
          volume = 3;
          break;
        case '中小件':
          volume = 4;
          break;
        default:
          break;
      }
      wx.request({
        url: app.globalData.globalUrl+'onload_want_order.php',
        data: {
          user_id: user_id,
          date: that.data.contents[0],
          time: that.data.contents[1],
          apartment: that.data.contents[2],
          volume: volume,
          now_item_num: that.data.now_item_num
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          that.setData({
            checkboxItems: res.data
          })
        },
        fail: function (res) {
        }
      })

    } else {
      return;
    }
  },
  volumechange: function(e) {
    var that = this
    this.setData({
      ['contents[3]']: that.data.volume[e.detail.value]
    })
    if (that.data.if_approve > 0) {
      var volume;
      var user_id = wx.getStorageSync('openid')
      switch (that.data.contents[3]) {
        case '小件':
          volume = 1;
          break;
        case '中件':
          volume = 2;
          break;
        case '大件':
          volume = 3;
          break;
        case '中小件':
          volume = 4;
          break;
        default:
          break;
      }
      wx.request({
        url: app.globalData.globalUrl+'onload_want_order.php',
        data: {
          user_id: user_id,
          date: that.data.contents[0],
          time: that.data.contents[1],
          apartment: that.data.contents[2],
          volume: volume,
          now_item_num: that.data.now_item_num
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          that.setData({
            checkboxItems: res.data
          })
        },
        fail: function (res) {
        }
      })

    } else {
      return;
    }
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    this.setData({
      checked_values: e.detail.value
    })
    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems
    });
  },
  affirm:function() {
    var that = this
    if (that.data.checked_values.length > that.data.week_num) {
      wx.showModal({
        title: '用户提醒',
        content: '您所选的订单数超过了您所允许的领取数',
        showCancel: false
      })
      return;
    }else if (that.data.checked_values.length == 0){
      wx.showModal({
        title: '用户提醒',
        content: '您没有选取所要领取的订单',
        showCancel: false
      })
    }else {
      wx.showToast({
        title: '正在提交',
        icon: 'loading',
      })
      var user_id = wx.getStorageSync('openid')
      wx.request({
        url: app.globalData.globalUrl+'collect_some_orders.php',
        data: {
          user_id: user_id,
          checked_values: that.data.checked_values,
          if_work: that.data.if_work
        },
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          console.log(res)
          if (res.data > 0) {
            wx.hideToast()
            wx.showToast({
              title: '提交成功',
              icon: 'success'
            })
          }else {
            wx.hideToast()
            wx.showModal({
              title: '提交失败',
              content: '提交失败,失败提示'+res.data,
              success(res) {
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
  },
  affirmAll:function(res) {
    
    var that = this
    if (that.data.if_work < 1) {
      wx.showModal({
        title: '用户提醒',
        content: '只有工作人员可以通过此按钮领单',
        showCancel: false
      })
      return;
    }else {
      wx.showModal({
        title: '工作提醒',
        content: '您确定选择'+that.data.contents[0]+' '+that.data.contents[1]+' '+that.data.contents[2]+'号楼所有'+that.data.contents[3]+'吗?',
        success(res) {
          var volume
          switch (that.data.contents[3]) {
            case '小件':
              volume = 1;
              break;
            case '中件':
              volume = 2;
              break;
            case '大件':
              volume = 3;
              break;
            case '中小件':
              volume = 4;
              break;
            default:
              break;
          }
          var user_id = wx.getStorageSync('openid')
          if(res.confirm) {
            wx.request({
              url: app.globalData.globalUrl+'collect_all_orders.php',
              data: {
                user_id: user_id,
                date: that.data.contents[0],
                time: that.data.contents[1],
                apartment: that.data.contents[2],
                volume: volume,
                if_work: that.data.if_work/*以防万一*/
              },
              method: 'POST',
              header: {
              'Content-Type':'application/x-www-form-urlencoded' 
              },
              success(res) {
                console.log(res)
                if (res.data > 0) {
                  wx.showToast({
                    title: '领单成功'
                  })
                }else {
                  wx.showModal({
                    title: '错误警告',
                    content: '请联系管理员错误码'+res.data,
                    showCancel: false
                  })
                }
              }
            })
          }else {
            return;
          }
        }
      })
    }
  }
})