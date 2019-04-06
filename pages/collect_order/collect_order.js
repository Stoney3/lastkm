// pages/place_order/place_order.js
const app = getApp()
var sliderWidth = 70
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["待领取", "待送达", "待签收", "已完成"],
    navbar_num: ["0", "0", "0", "0"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    start_items: [],
    start_num: 1,//这几个好像没用
    send_items: [],
    send_num: 1,
    arrive_items: [],
    arrive_num: 1,
    end_items: [],
    end_num: 1,
    need_start_num: 20,
    need_send_num: 20,
    need_arrive_num: 20,
    need_end_num: 20,
    need_all_num: 20
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    var user_id = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.globalUrl+'onload_collect_order.php',
      data: {
        activeIndex: parseInt(that.data.activeIndex),
        user_id: user_id,
        need_all_num: (parseInt)(that.data.need_start_num)

      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          'navbar_num[0]': res.data.itemNumArray[0],
          start_num: res.data.itemNumArray[0],
          'navbar_num[1]': res.data.itemNumArray[1],
          send_num: res.data.itemNumArray[1],
          'navbar_num[2]': res.data.itemNumArray[2],
          arrive_num: res.data.itemNumArray[2],
          'navbar_num[3]': res.data.itemNumArray[3],
          end_num: res.data.itemNumArray[3]
        })

        var itemdata = res.data.itemArray
        switch (that.data.activeIndex) {
          /*因为从home进来的页面携带的是字符型的0,1,2虽然页面顺序可以正常加载,但是用判断语句不能判断,所以不考虑转换了,直接用两种case*/
          case 0:
          case '0':
            function sortOrder(a, b) {
              var aCode = a.code
              var bCode = b.code
              var num = (Number(aCode.charAt(0)) - Number(bCode.charAt(0))) * 1000000 + (Number(aCode.charAt(1)) - Number(bCode.charAt(1))) * 100000 + (Number(aCode.charAt(3)) - Number(bCode.charAt(3))) * 10000 + (Number(aCode.charAt(5)) - Number(bCode.charAt(5))) * 1000 + (Number(aCode.charAt(6)) - Number(bCode.charAt(6))) * 100 + (Number(aCode.charAt(7)) - Number(bCode.charAt(7))) * 10 + (Number(aCode.charAt(8)) - Number(bCode.charAt(9)))
              return num;//利用order_code进行排序
            }
            itemdata = itemdata.sort(sortOrder)
            that.setData({
              start_items: itemdata
            })
            break;
          case 1:
          case '1':
            function sortApartment(a, b) {
              var aApa = String(a.apartment)
              var bApa = String(b.apartment)
              var aRoom = String(a.room)
              var bRoom = String(b.room)
              var num = Number(aApa+aRoom)-Number(bApa+aRoom)
              return num
            }
            itemdata = itemdata.sort(sortApartment)
            that.setData({
              send_items: itemdata
            })
            break;
          case 2:
          case '2':
            function sortApartment(a, b) {
              var aApa = String(a.apartment)
              var bApa = String(b.apartment)
              var aRoom = String(a.room)
              var bRoom = String(b.room)
              var num = Number(aApa + aRoom) - Number(bApa + aRoom)
              return num
            }
            itemdata = itemdata.sort(sortApartment)
            that.setData({
              arrive_items: itemdata
            })
            break;
          case 3:
          case '3':
            that.setData({
              end_items: itemdata
            })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    var temp_num = 0
    switch (that.data.activeIndex) {
      case 0:
      case '0':
        that.setData({
          need_start_num: that.data.need_start_num + 20
        })
        temp_num = that.data.need_start_num
        break;
      case 1:
      case '1':
        that.setData({
          need_send_num: that.data.need_send_num + 20
        })
        temp_num = that.data.need_send_num
        break;
      case 2:
      case '2':
        that.setData({
          need_arrive_num: that.data.need_arrive_num + 20
        })
        temp_num = that.data.need_arrive_num
        break;
      case 3:
      case '3':
        that.setData({
          need_end_num: parseInt(that.data.need_end_num) + 20
        })
        temp_num = that.data.need_end_num
        break;
    }
    var user_id = wx.getStorageSync('openid')

    wx.request({
      url: app.globalData.globalUrl+'onload_collect_order.php',
      data: {
        activeIndex: parseInt(that.data.activeIndex),
        user_id: user_id,
        need_all_num: temp_num

      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          'navbar_num[0]': res.data.itemNumArray[0],
          start_num: res.data.itemNumArray[0],
          'navbar_num[1]': res.data.itemNumArray[1],
          send_num: res.data.itemNumArray[1],
          'navbar_num[2]': res.data.itemNumArray[2],
          arrive_num: res.data.itemNumArray[2],
          'navbar_num[3]': res.data.itemNumArray[3],
          end_num: res.data.itemNumArray[3]
        })

        var itemdata = res.data.itemArray
        switch (that.data.activeIndex) {
          /*因为从home进来的页面携带的是字符型的0,1,2虽然页面顺序可以正常加载,但是用判断语句不能判断,所以不考虑转换了,直接用两种case*/
          case 0:
          case '0':
            function sortOrder(a, b) {
              var aCode = a.code
              var bCode = b.code
              var num = (Number(aCode.charAt(0)) - Number(bCode.charAt(0))) * 1000000 + (Number(aCode.charAt(1)) - Number(bCode.charAt(1))) * 100000 + (Number(aCode.charAt(3)) - Number(bCode.charAt(3))) * 10000 + (Number(aCode.charAt(5)) - Number(bCode.charAt(5))) * 1000 + (Number(aCode.charAt(6)) - Number(bCode.charAt(6))) * 100 + (Number(aCode.charAt(7)) - Number(bCode.charAt(7))) * 10 + (Number(aCode.charAt(8)) - Number(bCode.charAt(9)))
              return num;//利用order_code进行排序
            }
            itemdata = itemdata.sort(sortOrder)
            that.setData({
              start_items: itemdata
            })
            break;
          case 1:
          case '1':
            function sortApartment(a, b) {
              var aApa = String(a.apartment)
              var bApa = String(b.apartment)
              var aRoom = String(a.room)
              var bRoom = String(b.room)
              var num = Number(aApa + aRoom) - Number(bApa + aRoom)
              return num
            }
            itemdata = itemdata.sort(sortApartment)
            that.setData({
              send_items: itemdata
            })
            break;
          case 2:
          case '2':
            function sortApartment(a, b) {
              var aApa = String(a.apartment)
              var bApa = String(b.apartment)
              var aRoom = String(a.room)
              var bRoom = String(b.room)
              var num = Number(aApa + aRoom) - Number(bApa + aRoom)
              return num
            }
            itemdata = itemdata.sort(sortApartment)
            that.setData({
              arrive_items: itemdata
            })
            break;
          case 3:
          case '3':
            that.setData({
              end_items: itemdata
            })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  seeDetail: function (e) {

    wx.navigateTo({
      url: '../place_order_detail/place_order_detail?order_code=' + e.currentTarget.dataset.order_code+'&if_collect='+1,
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });

    var that = this
    var user_id = wx.getStorageSync('openid')
    var need_item_num
    switch (that.data.activeIndex) {
      case 0:
      case '0': need_item_num = that.data.need_start_num; break;
      case 1:
      case '1': need_item_num = that.data.need_send_num; break;
      case 2:
      case '2': need_item_num = that.data.need_arrive_num; break;
      case 3:
      case '3': need_item_num = that.data.need_end_num; break;
    }
    wx.request({
      url: app.globalData.globalUrl+'onload_collect_order.php',
      data: {
        activeIndex: that.data.activeIndex,
        user_id: user_id,
        need_all_num: need_item_num
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          'navbar_num[0]': res.data.itemNumArray[0],
          start_num: res.data.itemNumArray[0],
          'navbar_num[1]': res.data.itemNumArray[1],
          send_num: res.data.itemNumArray[1],
          'navbar_num[2]': res.data.itemNumArray[2],
          arrive_num: res.data.itemNumArray[2],
          'navbar_num[3]': res.data.itemNumArray[3],
          end_num: res.data.itemNumArray[3]
        })
        var itemdata = res.data.itemArray
        switch (that.data.activeIndex) {
          /*因为从home进来的页面携带的是字符型的0,1,2虽然页面顺序可以正常加载,但是用判断语句不能判断,所以不考虑转换了,直接用两种case*/
          case 0:
          case '0':
            function sortOrder(a, b) {
              var aCode = a.code
              var bCode = b.code
              var num = (Number(aCode.charAt(0)) - Number(bCode.charAt(0))) * 1000000 + (Number(aCode.charAt(1)) - Number(bCode.charAt(1))) * 100000 + (Number(aCode.charAt(3)) - Number(bCode.charAt(3))) * 10000 + (Number(aCode.charAt(5)) - Number(bCode.charAt(5))) * 1000 + (Number(aCode.charAt(6)) - Number(bCode.charAt(6))) * 100 + (Number(aCode.charAt(7)) - Number(bCode.charAt(7))) * 10 + (Number(aCode.charAt(8)) - Number(bCode.charAt(9)))
              return num;//利用order_code进行排序
            }
            itemdata = itemdata.sort(sortOrder)
            that.setData({
              start_items: itemdata
            })
            break;
          case 1:
          case '1':
            function sortApartment(a, b) {
              var aApa = String(a.apartment)
              var bApa = String(b.apartment)
              var aRoom = String(a.room)
              var bRoom = String(b.room)
              var num = Number(aApa + aRoom) - Number(bApa + aRoom)
              return num
            }
            itemdata = itemdata.sort(sortApartment)
            that.setData({
              send_items: itemdata
            })
            break;
          case 2:
          case '2':
            function sortApartment(a, b) {
              var aApa = String(a.apartment)
              var bApa = String(b.apartment)
              var aRoom = String(a.room)
              var bRoom = String(b.room)
              var num = Number(aApa + aRoom) - Number(bApa + aRoom)
              return num
            }
            itemdata = itemdata.sort(sortApartment)
            that.setData({
              arrive_items: itemdata
            })
            break;
          case 3:
          case '3':
            that.setData({
              end_items: itemdata
            })
        }
      }
    })
  },
  chargeback: function(e) {
    var that = this
    var order_code = e.currentTarget.dataset.order_code
    var user_id = wx.getStorageSync('openid')
    wx.showModal({
      title: '退领确认',
      content: '您确认要退领吗?请先保存用户电话通过短信方式告知用户退领原因并保存相关凭证用以平台查验。',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.globalUrl+'abandon_order.php',
            data: {
              order_code: order_code,
              user_id: user_id
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'GET',
            success(res) {
              if (res.data == 1) {
                wx.showToast({
                  title: '退领成功'
                })
                var j;
                for (var i = 0; i < parseInt(that.data.start_items.length); i++) {
                  if (that.data.start_items[i].order_code == order_code) {
                    j = i;
                    break;
                  }
                }
                j = parseInt(j)
                var start_item = "start_items[" + j + "].show"
                that.setData({
                  [start_item]: false,
                  ['navbar_num[0]']: that.data.navbar_num[0] - 1,
                  ['navbar_num[3]']: that.data.navbar_num[3] + 1
                })
              }else {
                wx.showToast({
                  title: '退领失败',
                  content: '错误码'+res.data
                })
              }
            }
          })
        }
      }
    })
  },
  sendOrder: function (e) {

    var that = this
    var order_code = e.currentTarget.dataset.order_code
    var user_id = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.globalUrl+'send_order.php',
      data: {
        order_code: order_code,
        user_id: user_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (e) {

        if (e.data > 0) {
          wx.showToast({
            title: '领件成功'
          })
          var j;
          for (var i = 0; i < parseInt(that.data.start_items.length); i++) {
            if (that.data.start_items[i].order_code == order_code) {
              j = i;
              break;
            }
          }
          j = parseInt(j)
          var start_item = "start_items[" + j + "].show"
          that.setData({
            [start_item]: false,
            ['navbar_num[0]']: that.data.navbar_num[0] - 1,
            ['navbar_num[1]']: that.data.navbar_num[1] + 1
          })
        } else {
          wx.showModal({
            title: '错误提示',
            content: '请联系管理员,错误码' + e.data,
            showCancel: false
          })
        }
      }
    })
  },
  arriveOrder:function(e) {
    var that = this
    var order_code = e.currentTarget.dataset.order_code
    var user_id = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.globalUrl+'arrive_order.php',
      data: {
        order_code: order_code,
        user_id: user_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (e) {
        if (e.data > 0) {
          wx.showToast({
            title: '送达成功'
          })
          var j;
          for (var i = 0; i < parseInt(that.data.send_items.length); i++) {
            if (that.data.send_items[i].order_code == order_code) {
              j = i;
              break;
            }
          }
          j = parseInt(j)
          var send_item = "send_items[" + j + "].show"
          that.setData({
            [send_item]: false,
            ['navbar_num[1]']: that.data.navbar_num[1] - 1,
            ['navbar_num[2]']: that.data.navbar_num[2] + 1
          })
        } else {
          wx.showModal({
            title: '错误提示',
            content: '请联系管理员,错误码' + e.data,
            showCancel: false
          })
        }
      }
    })
  },
  /*预览取件码图片*/
  preview: function(res) {
    wx.previewImage({
      urls: [res.currentTarget.dataset.src]
    })
  }
})