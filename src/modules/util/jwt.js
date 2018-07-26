/**
 * 登录时 第一次生成token
 */
const jwt = require('jwt-simple');
const moment = require('moment');
const mongoose = require('mongoose');
const config = require('./../../common/config');
const util = require('./service');

// 加密token
const getToken = async (user, next) => {
  const tokenString = config.parsed.TOKEN_KEYS;
  // 设置token有效期
  var expires = moment().add(30, 'd').valueOf();
  // 生成token
  var token = await jwt.encode(
    {
      iss: user._id,
      exp: expires
    }, tokenString
  );
  return {
    token: token,
    user: user.toJSON()
  };
};

// 解密token
const decryToken = async (ctx, next) => {
  if (/^\/[^qs]/.test(ctx.request.url)) {
    await next();
  } else {
    // Parse the URL, we might need this
    // 解析url地址
    const { query, body, headers } = ctx.request;
    const tokenString = config.parsed.TOKEN_KEYS;
    const User = mongoose.model('User');
    /**
     * Take the token from:
     *  - the POST value token
     *  - the GET parameter token
     *  - the access-token header
     *    ...in that order.
     */
    var token = (body && body.token) || query.token || headers['access-token'] || headers['token'];
    let {latitude, longitude, accuracy, uuid} = headers;
    let position = {latitude: latitude, longitude: longitude, accuracy: accuracy, uuid: uuid};
    // if (!query.version || query.version !== 'v1') {
    //   ctx.body = util.returnBody('err', '版本信息错误');
    //   return;
    // }
    // 如果token存在
    if (token) {
      try {
        // 使用密钥解析token
        var decoded = jwt.decode(token, tokenString);
        // 判断token过期时间
        if (decoded.exp <= Date.now()) {
          ctx.body = util.returnBody('invalid', 'token失效');
        } else {
          // 没有过期 根据解析出的内容 查询数据库是否存在
          await User.findOne({ '_id': decoded.iss })
          .then(async (user) => {
            if (user) {
              user.phone = undefined;
              user.password = undefined;
              ctx.req.user = user;  // 如果数据库存在，将查询到用户信息附加到请求上
              ctx.req.position = position;
              await next();
            } else {
              ctx.body = util.returnBody('invalid', 'token解析失败');
            }
          });
        }
      } catch (err) {
        ctx.status = 400;
        console.log(err);
        ctx.body = util.returnBody('invalid', 'token解析失败');
      }
    } else {
      ctx.body = util.returnBody('invalid', 'token不存在');
    }
  }
};

module.exports.getToken = getToken;
module.exports.decryToken = decryToken;
