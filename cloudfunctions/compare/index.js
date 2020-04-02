// 部署：在 cloud-functions/comapre 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 调用阿里云api实现人脸识别
 * 
 * event 参数包含小程序端调用传入的clockurl answerurl
 * 
 */
exports.main = async(event, context) => {
  var that = this;
  const wxContext = cloud.getWXContext()
  //aliyun api 请求
  const Core = require('@alicloud/pop-core');
  var client = new Core({
    accessKeyId: 'balabala',//这儿改成你自己的accessKeyId
    accessKeySecret: 'balabala',//这儿改成你自己的accessKeySecret
    endpoint: 'https://facebody.cn-shanghai.aliyuncs.com',
    apiVersion: '2019-12-30'
  });
  
  var params = {
    "RegionId": "cn-shanghai",
    "ImageURLA":event.answerurl,
    "ImageURLB":event.clockurl
  }
  var requestOption = {
    method: 'POST'
  };

  let CompareFace = await client.request('CompareFace', params, requestOption).then(result => {
      var arrJosn = JSON.stringify(result);
      var deArr = JSON.parse(arrJosn);
      console.log(deArr);
      const Confidence = parseInt(deArr['Data']['Confidence']);
      console.log('Confidence', Confidence);
      var same_person_flag = false
      if (Confidence > 70) {
        console.log("yes");
        same_person_flag = true
      }
      console.log('人脸比对成功', same_person_flag)
      return {result: same_person_flag}
    }).catch(error => {
      console.log('人脸比对失败')
      return {result: "error！" }
    })

  const result = CompareFace.result
  console.log("result", result);
  return {
    same_person: result
  }
}

