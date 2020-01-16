// 路由加载器
const fs = require('fs')
const path = require('path')
const Router = require('koa-router')
const schedule = require('node-schedule')
const render = require('koa-ejs');


/**
 * 读文件夹
 * @param {文件夹} dir
 * @param {回调，参数是文件名和文件路径} cb
 */
function load(dir, cb) {
  // 获取绝对路径
  const url = path.resolve(__dirname, dir)
  const files = fs.readdirSync(url)

  files.forEach(filename => {
    const cbfilename = filename.replace('.js', '')
    const file = require(`${url}/${filename}`)
    cb(cbfilename, file)
  })
}

/**
 * 初始化路由
 *
 */
function initRouter(app) {
  const router = new Router()
  load('router', (filename, routes) => {
    // 对于index，需要特殊处理：请求后缀为index。指向跟路径
    const prefix = filename === 'index' ? '' : `/${filename}`
    const newroutes = typeof routes === 'function' ? routes(app) : routes
    Object.keys(newroutes).forEach(key => {
      // 根据空格解析
      const [method, newpath] = key.split(' ')
      // 解析路由,处理异步
      router[method](prefix + newpath, async ctx => {
        // 挂载ctx至app
        app.ctx = ctx
        // 路由处理器现在接收到的是app
        await newroutes[key](app)
      })
    })
  })
  return router
}

/**
 * 控制器集成
 */
function initController() {
  const controllers = {}
  load('controller', (filename, controller) => {
    // 添加路由控制器
    controllers[filename] = controller
  })

  return controllers
}

/**
 * 服务集成
 */
function initService() {
  const services = {}
  // 读取控制器目录
  load('service', (filename, service) => {
    // 添加路由,和controller一样的逻辑
    services[filename] = service
  })
  return services
}

function loadConfig(app) {
  load("config", (filename, conf) => {
    //中间件
    if (conf.middleware) {
      conf.middleware.forEach(mid => {
        const midPath = path.resolve(__dirname, "middleware", mid);
        app.$app.use(require(midPath));
      });
    }
    // 数据库
    // if(conf.db) {
    //     app.$db = new Sequelize(conf.db);
    //     // 加载模型
    //     app.$model = {};
    //     // 期望：从model下拿到对应数据表比如user
    //     load("model", (filename, { schema, options }) => {
    //         app.$model[filename] = app.$db.define(filename, schema, options);
    //     });
    //     app.$db.sync();
    // }
  });
}

function initSchedule() {
  // 读取控制器目录
  load("schedule", (filename, scheduleConfig) => {
    schedule.scheduleJob(scheduleConfig.interval, scheduleConfig.handler);
  });
}

function initViews(app) {
  return render(app, {
    root: path.join(__dirname, 'view'),
    layout: '404',
    viewExt: 'ejs',
    cache: false,
    debug: false,
  });
}

module.exports = { initRouter, initController, initService, loadConfig, initSchedule, initViews }
