const Koa = require('koa');
// 引入其他第三方库
const Router = require('koa-router'); // 路由模块
const responseTime = require('koa-response-time'); // 请求响应时间
const logger = require('koa-bunyan-logger'); // 日志模块
const { requestIdContext, requestLogger, timeContext } = require('koa-bunyan-logger'); // 日志模块
const cors = require('koa-cors'); // 跨域模块
const convert = require('koa-convert'); // 处理请求参数模块
const bodyParser = require('koa-bodyparser'); // 解析请求体
const bytes = require('bytes'); // 解析字节模块
const { pick, merge, trimEnd } = require('lodash'); // 工具模块

// 引入初始化模块
const config = require('./common/config');
const controllers = require('./common/controllers');
const logs = require('./common/logs');
const mongo = require('./common/mongo');
const app = new Koa();

const publicRouter = new Router({prefix: '/qs'});

app.use(responseTime()); // 放在最前面

// 初始化日志模块
app.use(logger(logs));

// 处理请求
app.use(convert(cors({
  origin: true,
  credentials: true,
  headers: ['Content-Type', 'accept', 'X-CLOUD-TOKEN', 'token'],
  expose: ['Total', 'X-Response-Time', 'Content-Disposition']
})));

// request 请求头中添加请求ID
app.use(requestIdContext({
  header: 'Request-Id'
}));

app.use(requestLogger({
  durationField: 'responseTime',
  updateRequestLogFields: (ctx) => {
    return pick(ctx.req.headers, ['host', 'referer', 'accept-encoding', 'accept-language']);
  },
  updateResponseLogFields: (ctx) => {
    const { _headers: headers } = ctx.res;
    const time = headers['x-response-time'];
    const length = bytes(headers['content-length']);
    const fields = pick(ctx.res._headers, ['host', 'content-type', 'accept-encoding', 'accept-language']);
    return merge(fields, {
      responseTime: trimEnd(time, 'ms'),
      bodySize: length ? bytes(length) : '-'
    });
  }
}));
// 日志级别
app.use(timeContext({ logLevel: 'debug' }));
app.use(bodyParser({
  enableTypes: ['json', 'form', 'text'],
  extendTypes: {
    text: ['text/xml'] // will parse application/x-javascript type body as a JSON string
  },
  multipart: true,
  textLimit: '100mb',
  jsonLimit: '100mb',
  formLimit: '100mb'
}));

// 注册所有路由
controllers({
  router: publicRouter
});

app.use(publicRouter.routes());

// catch all exceptions  捕获所有异常
app.use(async (ctx, next) => {
  try {
    await next();
    if (ctx.status === 404) ctx.throw(404);
  } catch (err) {
    console.log(err);
    ctx.status = err.status || 500;
    ctx.body = {message: err.message, success: false};
  };
});

mongo().then(() => {
  const port = config.parsed.APP_PORT;
  app.listen(port, async function () {
    console.log('Server started on', port);
  });
});