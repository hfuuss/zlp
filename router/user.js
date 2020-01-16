// router/user.js
module.exports = {
  'get /': async app => {
    const name = await app.$service.user.getName()
    // app.ctx.status = 404
    app.ctx.body = `hello, ${name}`
  },
  'get /info': async app => {
    const age = await app.$service.user.getAge()
    app.ctx.body = `i am ${age} years old`
    // app.ctx.status = 500
  },
}
