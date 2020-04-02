//index.js
const app = getApp()

Page({

  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })

        // wx.showLoading({ title: '正在进行人脸识别' })
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
              dir: "clockin/",
              envs: env,
              clockfilenameoss: app.globalData.openid,
              success: function (res) {

                //调用云函数compare，对比上传图片的结果
                wx.cloud.callFunction({
                  name: 'compare',
                  data: {
                    clockurl: 'https://balabala/clockin/' + app.globalData.openid + '_clock.jpg',//这儿改成你自己的oss地址
                    answerurl: 'https://balabala/students_imgs/' + app.globalData.openid + '.jpg',//这儿改成你自己的oss地址
                  },
                  success: res => {
                    console.log('打卡结果:', res.result.same_person)
                    if (res.result.same_person) {
                      wx.showToast({ title: '打卡成功', duration: 3000})
                      wx.navigateTo({ url: '../index/index' })
                    }
                    else {
                      wx.showToast({ title: '打卡失败', duration: 30000, image: './fail.jpg',})
                    }
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
            wx.hideLoading()
          }
        })


      }
    })
  },
  error(e) {
    console.log(e.detail)
  }

})
