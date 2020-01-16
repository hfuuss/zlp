// 这里就是数据库的配置

module.exports = {
  db: {
      dialect:'mysql',
      host:'127.0.0.1',
      port:'3306',
      username:'root',
      password:'12345678',
      database:'xcmvc'
  },
  middleware: ['logger'] // 以数组形式，保证执行顺序
}