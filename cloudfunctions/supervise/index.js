// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 调用阿里云api实现人脸计数和活体检测
 * 
 * event 参数包含小程序端调用传入的superviseurl answerurl
 * 
 */
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  //aliyun api 请求
  const Core = require('@alicloud/pop-core');
  var client = new Core({
    accessKeyId: 'balabala',//这儿改成你自己的accessKeyId
    accessKeySecret: 'balabala',//这儿改成你自己的accessKeySecret
    endpoint: 'https://facebody.cn-shanghai.aliyuncs.com',
    apiVersion: '2019-12-30'
  });
  
  var params_DetectBodyCount = {
    "RegionId": "cn-shanghai",
    "ImageURL": event.superviseurl//url_supervise_img_id
  }
  console.log("params_DetectBodyCount", params_DetectBodyCount);
  var params_DetectLivingFace = {
    "RegionId": "cn-shanghai",
    "Tasks.1.ImageURL": event.superviseurl//url_supervise_img_id
  }
  console.log("params_DetectLivingFace", params_DetectLivingFace);
  var requestOption = {
    method: 'POST'
  };

  //DetectBodyCount_api
  let DetectBodyCount = await client.request('DetectBodyCount', params_DetectBodyCount, requestOption).then(result => {
    var arrJosn = JSON.stringify(result);
    var deArr = JSON.parse(arrJosn);
    console.log('DetectBodyCount',deArr);
    const PersonNumber = parseInt(deArr['Data']['PersonNumber']);
    console.log('PersonNumber', PersonNumber);
    return { result: PersonNumber }
  }).catch(error => {
    console.log('DetectBodyCount失败')
    return { result: "error！" }
  })

  //DetectLivingFace_api
  let DetectLivingFace = await client.request('DetectLivingFace', params_DetectLivingFace, requestOption).then(result => {
    var arrJosn = JSON.stringify(result);
    var deArr = JSON.parse(arrJosn);
    console.log('DetectLivingFace',deArr);
    const Label = deArr['Data']['Elements'][0]['Results'][0]['Label'];
    console.log('Label', Label);
    return { result: Label}
  }).catch(error => {
    console.log('DetectLivingFace失败')
    return { result: "error！" }
  })

  var result_final='出错啦！'
  const PersonNumber = DetectBodyCount.result
  if (PersonNumber == 0) {
    result_final = '快回来学习呀！'
   }
  if (PersonNumber == 1) { 
    const Label = DetectLivingFace.result
    if (Label == 'normal') {
      result_final = '认真学习中~'
    }
    if (Label == 'liveness') {
      result_final = '检测出翻拍照片~'
    }
  }
  if (PersonNumber > 1) {
    result_final = '检测到多人~'
   }
  
  console.log("result_final", result_final);
  return {
    result_final: result_final
  }
}

