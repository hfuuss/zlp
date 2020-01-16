// 可复用的服务，一个同步，一个异步
module.exports={
  index: app =>{ 
    app.ctx.body = '首页'
  },
  detail: app => {
    app.ctx.body = '首页详情'
  }
}