var fileHost = "yjy08042.oss-cn-shanghai.aliyuncs.com"
var config = {
  //aliyun OSS config
  uploadImageUrl: `${fileHost}`, //默认存在根目录，可根据需求改
  AccessKeySecret: 'UVcF2iJbQXYeLtOb4WFCT4Hkq9TcwE',
  OSSAccessKeyId: 'LTAI4FbfadbDpYz6PwB2B1Li',
  timeout: 87600 //这个是上传文件时Policy的失效时间
};
module.exports = config