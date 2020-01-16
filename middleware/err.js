// 错误捕捉
module.exports = async (ctx, next) => {
    if (ctx.url === '/favicon.ico') {
        return
    }
    try {
        await next();
        if (ctx.status !== 200) {
            ctx.throw(ctx.status);
        }
    } catch (err) {
        console.log(err.status, 'err')
        const status = err.status || 500;
        ctx.status = status;
        if (status === 404) {
            await ctx.render("404");
        } else if (status === 500) {
            console.log('sss')
            await ctx.render("500", { message: err, stack: err.stack });
        }
    }
};