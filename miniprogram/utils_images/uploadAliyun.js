console.log('1111111111111111111')
const Base64 = require('./Base64.js');

require('./hmac.js');
require('./sha1.js');
const Crypto = require('./crypto.js');
var env = require('./config.js');
console.log(env)
const uploadFile = function (params) {
  env = params.envs
  if (!params.filePath) {
    wx.showModal({
      title: '图片错误',
      content: '请重试',
      showCancel: false,
    })
    return;
  }
  
  const aliyunFileKey = params.dir + params.clockfilenameoss + '_clock.jpg';
  const aliyunServerURL = env.uploadImageUrl;
  const accessid = env.OSSAccessKeyId;
  const policyBase64 = getPolicyBase64();
  const signature = getSignature(policyBase64);

  wx.uploadFile({
    url: aliyunServerURL, 
    filePath: params.filePath,
    name: 'file',
    formData: {
      'key': aliyunFileKey,
      'policy': policyBase64,
      'OSSAccessKeyId': accessid,
      'signature': signature,
      'success_action_status': '200',
    },
    success: function (res) {
      if (res.statusCode != 200) {
        if(params.fail){
          params.fail(res)
        }
      
      }
      console.log('res',res)
      if(params.success){
        params.success(aliyunFileKey);
        console.log('aliyunFileKey', aliyunFileKey)
        
      }
    },
    fail: function (err) {
      err.wxaddinfo = aliyunServerURL;
      if (params.fail) {
        params.fail(err)
      }
    },
  })

  
}

const getPolicyBase64 = function () {
  // console.log(10)
  let date = new Date();
  // console.log(11)

  date.setHours(date.getHours() + env.timeout);
  // console.log(12)

  let srcT = date.toISOString();
  // console.log(13)

  const policyText = {
    "expiration": srcT, //设置该Policy的失效时间
    "conditions": [
      ["content-length-range", 0, 5 * 1024 * 1024] // 设置上传文件的大小限制,5mb
    ]
  };
  // console.log(14)

  const policyBase64 = Base64.encode(JSON.stringify(policyText));
  // console.log(15)

  return policyBase64;
}

const getSignature = function (policyBase64) {
  // console.log(3.1)
  // console.log(env)
  const accesskey = env.AccessKeySecret;
  // console.log(accesskey)
  // console.log(3.2)

  const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
    asBytes: true
  });
  // console.log(3.3)

  const signature = Crypto.util.bytesToBase64(bytes);
  // console.log(3.4)

  return signature;
}

module.exports = uploadFile;
