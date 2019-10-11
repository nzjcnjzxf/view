const Koa = require('./koa3');
const app = new Koa();

// logger
app.use(async (ctx, next) => {
    console.log('1')
    await next();
    console.log('2')
    const rt = ctx['X-Response-Time'];
    console.log(`${ctx.req.method} ${ctx.req.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
    console.log('3');
    const start = Date.now();
    await next();
    console.log('4');
    const ms = Date.now() - start;
    ctx['X-Response-Time'] = `${ms}ms`;
});

// response
app.use(async ctx => {
    console.log('5');
    ctx.res.end('This is like koa2');
    console.log('6');
});

app.listen(8888);