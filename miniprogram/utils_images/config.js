var fileHost = "https://yjy08042.oss-cn-shanghai.aliyuncs.com"
var config = {
  //aliyun OSS config
  uploadImageUrl: `${fileHost}`, //默认存在根目录，可根据需求改
  AccessKeySecret: 'balabala',//这儿改成你自己的AccessKeySecret
  OSSAccessKeyId: 'balabala',//这儿改成你自己的OSSAccessKeyId
  timeout: 87600 //这个是上传文件时Policy的失效时间
};
module.exports = config
