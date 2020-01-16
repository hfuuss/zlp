module.exports = {
  interval: '*/3 * * * * *',
  handler() {
      console.log('定时任务log：嘿嘿嘿 三秒执行一次' + new Date())
  }
}