//index.js
const app = getApp()

Page({

  onLoad: function () {
    
    var supervise = function () {
      const ctx = wx.createCameraContext()
      ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          // 将拍摄的照片上传到oss
          const filePath = res.tempImagePath
          const cloudPath = app.globalData.openid + '_clock' + filePath.match(/\.[^.]+?$/)[0]
          console.log('filePath', filePath)
          console.log('cloudPath', cloudPath)

          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              console.log('[打卡照片上传文件] 成功：', res)
              const fileID = res.fileID
              const uploadImage = require('../../utils_images/uploadAliyun.js');
              const env = require('../../utils_images/config.js')
              uploadImage({
                filePath: filePath,
                dir: "supervise/",
                envs: env,
                clockfilenameoss: app.globalData.openid+'',
                success: function (res) {

                  //调用云函数compare，对比上传图片的结果
                  wx.cloud.callFunction({
                    name: 'supervise',
                    data: {
                      superviseurl: 'https://balabala/supervise/' + app.globalData.openid + '_clock.jpg',//这儿改成你自己的oss地址
                      answerurl: 'https://balabala/students_imgs/' + app.globalData.openid + '.jpg',//这儿改成你自己的oss地址
                    },
                    success: res => {
                      console.log(res.result.result_final)
                      wx.showToast({ title: res.result.result_final, icon: 'success' })
                    },
                    fail: err => {
                      console.error('[云函数] [login] 调用失败', err)
                      wx.navigateTo({ url: '../deployFunctions/deployFunctions', })
                    }
                  })
                },
                fail: function (res) {
                  console.log("上传失败")
                  console.log(res)
                },
              })
            },
            fail: e => {
              console.error('[上传文件] 失败：', e)
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            },
            complete: () => {
            }
          })
        }
      })
    }

    //循环执行拍照代码 5000=5s
    // supervise()
    var a = setInterval(function () {
      supervise ()
    }, 10000)
  }
})
