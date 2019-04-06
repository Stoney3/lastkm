// pages/approve/approve.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    file: '../../images/idcard.png',
    valueName: '',                  /*这些value在进入页面没有初始值的话其实欸用,提交表单信息的值由name得到而不是这些value,先放着吧,说不定以后改成如果认证的话进入页面的默认值为已经认证的信息*/
    valueId: '',
    valuePhone: '',
    valueCollege: '北京化工大学',
    valueBranch: '昌平校区',
    valueApartment: '',
    valueRoom: '',
    valueIndex: [0, 0],
    school: [
      ['北京化工大学', '中国石油大学'],
      ['昌平校区', '东校区']
    ],
    objectSchool: [{
      id: 0,
      college: '北京化工大学',
      branch: [{
        id: 0,
        branch_school: '昌平校区'
      }, {
        id: 1,
        branch_school: '东校区'
      }]
    }, {
      id: 1,
      college: '中国石油大学',
      branch: [{
        id: 0,
        branch_school: '昌平校区'
      }, {
        id: 1,
        branch_school: '本部'
      }]
    }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var user_id = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.globalUrl+'onload_approve.php',
      data: {
        user_id: user_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data != 0) {
          that.setData({
            valueName: res.data.name,
            valueId: res.data.id,
            valuePhone: res.data.phone,
            valueApartment: res.data.apartment,
            valueRoom: res.data.room,
            valueCollege: res.data.college,
            valueBranch: res.data.branch
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  /*  picker值改变函数  */
  bindMultiPickerChange: function (e) {
    var value = e.detail.value
    var that = this
    if(e.detail.value[1] == 'a') {
      value[1] = 0
    }
    that.setData({
      valueIndex: e.detail.value,
      valueCollege: that.data.objectSchool[value[0]].college,
      valueBranch: that.data.objectSchool[value[0]].branch[value[1]].branch_school
    })
  },

  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);

    var data = {
      school: this.data.school,
      valueIndex: this.data.valueIndex
    }
    data.valueIndex[e.detail.column] = e.detail.value
    switch (e.detail.column) {
      case 0:
        switch (e.detail.value) {
          case 0:            //选择第一列第一行
            data.school[1] = ['昌平校区', '东校区']//每个大学的校区在这里添加
            break;
          case 1:           //选择第一列第二行
            data.school[1] = ['昌平校区', '本部']
            break;
          /*
          如果还有大学加入,则将this.data中school第一个数组后添加大学,并且在这里添加校区
          case 2:
            data.shool[1] = ['XX校区,'XX校区']
            break;
          */
        }
        data.valueIndex[1] = 0
        break;
    }
    this.setData({
      school: data.school,
      valueIndex: data.valueIndex
    })
  },
  formSubmit: function (e) {
    var that = this

    var detrueName = e.detail.value.trueName
    var detrueId = e.detail.value.trueId
    var detruePhone = e.detail.value.truePhone
    var detrueCollege = that.data.valueCollege
    var detrueBranch = that.data.valueBranch
    var detrueApartment = e.detail.value.trueApartment
    var detrueRoom = e.detail.value.trueRoom

    let phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$//*电话正则*/
    if (detrueName.length == 0) {
      wx.showModal({
        content: '真实姓名不能为空',
        showCancel: false
      })
      return;
    }

    if (detrueId.length == 0) {
      wx.showModal({
        content: '学号不能为空',
        showCancel: false
      })
      return
    }

    if (detruePhone.length == 0) {
      wx.showModal({
        content: '认证人电话不能为空',
        showCancel: false
      })
      return;
    }
    if (!phoneReg.test(detruePhone)) {
      wx.showModal({
        content: '认证人电话格式不正确,请检查',
        showCancel: false
      })
      return;
    }
    //我用真机调试的时候没有选择校区有值但是显示学校为空

    if (detrueCollege.length == 0 || detrueBranch.length == 0) {
      wx.showModal({
        content: '学校相关信息不能为空',
        showCancel: false
      })
      return;
    }

    if (detrueApartment.length == 0) {
      wx.showModal({
        content: '楼宇号不能为空',
        showCancel: false
      })
      return;
    }

    if (detrueRoom.length == 0) {
      wx.showModal({
        content: '宿舍不能为空',
        showCancel: false
      })
      return;
    }

    wx.showToast({
      title: '正在上传',
      icon: 'loading',
      duration: 2000
    })
    var imagePath
    var user_id = wx.getStorageSync('openid')
    wx.uploadFile({
      url: app.globalData.globalUrl+'save_studentId_image.php',
      filePath: this.data.file[0],
      formData:{
        college: detrueCollege,
        branch: detrueBranch,
        studentId: detrueId
      },
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      success: function (res) {
        console.log(res)
        imagePath = res.data
        wx.request({
          url: app.globalData.globalUrl+'approve.php',
          data: {
            user_id: user_id,
            student_id: detrueId,
            name: detrueName,
            phone: detruePhone,
            college: detrueCollege,
            branch_school: detrueBranch,
            apartment: detrueApartment,
            room: detrueRoom,
            imagePath: imagePath
          },
          method: 'POST',
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            wx.hideToast()
            wx.showToast({
              content: '上传成功',
              duration: 2000
            })
            wx.navigateBack({
              url: '../home/home'
            })
          },
          fail: function (res) {
            wx.hideToast()
            wx.showModal({
              content: "上传认证信息失败,请联系客服",
              showCancel: false
            })
          }
        })
      },

      fail: function (res) {
        wx.hideToast()
        wx.showModal({
          title: '用户提示',
          content: '认证照片上传失败,请联系客服',
          showCancel: false,
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
  preViewImage: function() {
    wx.previewImage({
      urls: this.data.file
    })
  },
  chooseImage: function() {
    var that = this

    wx.chooseImage({
      count: 1,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: function (res) {
        that.setData({
          file: res.tempFilePaths
        })
      },
    })
  }
})