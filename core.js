const Koa = require('koa')
const chalk = require('chalk')
const favicon = require('koa-favicon');
const { initRouter, initController, initService, loadConfig, initSchedule, initViews } = require('./zlp-loader')

class xc {
  constructor(conf) {
    this.$app = new Koa(conf)
    loadConfig(this)
    initSchedule()
    this.$views = initViews(this.$app);
    this.$ctrl = initController()
    this.$service = initService()
    this.$router = initRouter(this)
    this.$app.use(favicon(__dirname + '/public/favicon.ico'))// 处理favicon
    this.$app.use(this.$router.routes())
  }
  start(port) {
    this.$app.listen(port, () => {
      console.log(chalk.green(`服务器启动成功，端口${port}`))
    })
  }
}
module.exports = xc
