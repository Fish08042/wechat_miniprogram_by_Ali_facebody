// miniprogram/pages/addInfo/addInfo.js
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    student_id:'',
    name:'',
    class_:'',
    clock_infos: null,
    upload_img_flag: false,
    init_img_id:'',
    clock_img_id:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //获取姓名  
  getName(e) {
    this.setData({
      name: e.detail.value
    })
  },

  //获取学号  
  getStudentId(e) {
    this.setData({
      student_id: e.detail.value
    })
  },

  //获取班级
  getClass(e){
    this.setData({
      class_: e.detail.value
    })
  },

  //submit to database
  submit(e){
    if (! this.data.upload_img_flag){
      wx.showToast({
        title: '请先上传您的照片',
      })
    }
    else{
    const db = wx.cloud.database()
    db.collection('student_infos').add({
      data: this.data,
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        // this.setData({
        //   counterId: res._id,
        //   count: 1
        // })
        wx.showToast({
          title: '新增记录成功',
        })
        wx.navigateTo({
          url: '../index/index',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
    }
  },

  // 上传图片
  doUpload_regist: function () {
    // 选择图片
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      // sourceType: ['album', 'camera'],
      sourceType: ['camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = app.globalData.openid + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            that.setData({
              upload_img_flag: true,
              init_img_id: res.fileID
            })
            console.log('upload_img_flag', that.data.upload_img_flag)
            console.log('init_img_id', that.data.init_img_id)
            
            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath


          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
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

  }
})