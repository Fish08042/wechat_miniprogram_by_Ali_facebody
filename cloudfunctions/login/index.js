// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */

exports.main = async(event, context) => {
  
  console.log(event)
  console.log(context)

  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext()

  //for dubg, temp to true
  const db = cloud.database();

  let get_student_infos = await db.collection('student_infos').where({
    _openid: wxContext.OPENID
  }).get().then(res => {
    console.log('查询数据库结果成功', res)
    if (res.data.length==0)
    {
      return { data: "no this person infos" }
    }
    else { return { data: res.data[0]}}
  }).catch(error => {
    console.log('查询数据库结果失败', res)
    return { data: "no this person infos" }
    // do something
  })
    
  var student_infos = get_student_infos.data
  console.log('student_infos', student_infos)
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    env: wxContext.ENV,
    result: student_infos
  }
}

