// pages/edit/edit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    valueName: '',
    valuePhone: '',
    valueCollege: '北京化工大学',
    valueBranch: '昌平校区',
    valueApartment: '',
    valueRoom: '',
    valueIndex: [0,0],
    school: [
      ['北京化工大学','中国石油大学'],//这一行是初始第一列的值
      ['昌平校区', '东校区']//这一行是初始第二列的值
    ],
    /*mutiPicker的VALUE值改变的话通过数组在这下面这个数组找到对应的文本然后将valueSchool和valueBranch置为选择的数据,页面提交数据时提交的是valueCollege和valueBranch*/
    objectSchool:[{
      id: 0,
      college: '北京化工大学',
      branch: [{
        id: 0,
        branch_school: '昌平校区'
      }, {
        id: 1,
        branch_school: '东校区'
      }]
    },{
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
    console.log("hha")
    console.log(this.data.valueCollege)
    var that = this
    var user_id = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.globalUrl+'onload_edit.php',
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
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var value = e.detail.value
    var that = this
    if (e.detail.value[1] == 'a') {
      value[1] = 0
    }
    that.setData({
      valueIndex: e.detail.value,
      valueCollege: that.data.objectSchool[value[0]].college,
      valueBranch: that.data.objectSchool[value[0]].branch[value[1]].branch_school
    })
  },
  /*这个函数是修改第一列之后处理第二列显示的函数*/
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
            data.school[1] = ['昌平校区','东校区']//每个大学的校区在这里添加
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
  formSubmit: function(e) {
    console.log(e)
    var that = this

    var detrueName = e.detail.value.trueName
    var detruePhone = e.detail.value.truePhone
    var detrueCollege = that.data.valueCollege
    var detrueBranch = that.data.valueBranch
    var detrueApartment = e.detail.value.trueApartment
    var detrueRoom = e.detail.value.trueRoom
    console.log(detruePhone)
    let phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$//*电话正则*/
    if (detrueName.length == 0) {
      wx.showModal({
        content: '收件人姓名不能为空',
        showCancel: false
      })
      return;
    }
    if (detruePhone.length == 0) {
      wx.showModal({
        content: '收件人电话不能为空',
        showCancel: false
      })
      return;
    }
    if (!phoneReg.test(detruePhone)) {
      wx.showModal({
        content: '收件人电话格式不正确,请检查',
        showCancel: false
      })
      return;
    }
    //我用真机调试的时候没有选择校区有值但是显示学校为空

    if(detrueCollege.length == 0 || detrueBranch.length == 0) {
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

    var user_id = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.globalUrl+'update_address.php',
      data: {
        user_id: user_id,
        name: detrueName,
        phone: detruePhone,
        college: detrueCollege,
        branch_school: detrueBranch,
        apartment: detrueApartment,
        room: detrueRoom
      },
      method: 'POST',
      header: {'Content-Type':'application/x-www-form-urlencoded'},
      success: function(res) {
        wx.setStorageSync('name', detrueName)
        wx.setStorageSync('phone',detruePhone)
        wx.setStorageSync('college',detrueCollege)
        wx.setStorageSync('branch_school',detrueBranch)
        wx.setStorageSync('apartment',detrueApartment)
        wx.setStorageSync('room',detrueRoom)
        wx.navigateBack({
          delta: 1
        })
      },
      fail: function(res) {
        wx.showModal({
          content: "默认地址修改失败!"
        })
      }

    })
  }
})