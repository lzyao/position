// 用户

// 引入所需库
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');

// 引入其他方法
const util = require('./../util/service');
const logs = require('./../userLogs/controller');
const jwtToken = require('./../util/jwt');

// 操作接口

// 登录
const login = async (ctx, next) => {
  let { phone, password } = ctx.request.body;
  const { version } = ctx.request.query;
  if (version === 'v2') { };
  const User = mongoose.model('User');
  let ip = ctx.req.headers['x-forwarded-for'] ||
    ctx.req.connection.remoteAddress ||
    ctx.req.socket.remoteAddress ||
    ctx.req.connection.socket.remoteAddress;
  const user = await User.findOne({'phone': phone});
  let userLogs = {
    date: new Date(), phone: phone, ip: ip, type: 'login'
  };
  if (!user) {
    _.merge(userLogs, { result: false, remark: '用户不存在' });
    await logs.addUserLoginLogs(userLogs);
    ctx.body = util.returnBody('err', '用户不存在');
  } else {
    if (user.freeze) {
      _.merge(userLogs, { result: false, remark: '帐号已冻结' });
      await logs.addUserLoginLogs(userLogs);
      ctx.body = util.returnBody('err', '帐号冻结-请联系管理员');
      return;
    } else {
      // 判断密码是否正确
      await bcrypt.compare(password, user.password).then(async (res) => {
        if (!res) {
          _.merge(userLogs, { result: false, remark: '密码错误' });
          await logs.addUserLoginLogs(userLogs);
          ctx.body = util.returnBody('err', '密码错误');
        } else {
          // 清空密码
          user.password = undefined;
          // 生成token
          const tokenJson = await jwtToken.getToken(user);
          _.merge(userLogs, { user: user._id, tokenValid: true, result: true, remark: '登录成功' });
          await logs.addUserLoginLogs(userLogs);
          ctx.body = util.returnBody('ok', '登录成功', tokenJson);
        }
      });
    }
  }
};

// 注册用户
const register = async (ctx) => {
  try {
    const User = mongoose.model('User');
    const {role = 4, phone, password, name} = ctx.request.body;
    let ip = ctx.req.headers['x-forwarded-for'] ||
      ctx.req.connection.remoteAddress ||
      ctx.req.socket.remoteAddress ||
      ctx.req.connection.socket.remoteAddress;
    // 验证二维码
    const type = 'register';
    let remark;
    let result;
    let tokenJson;
    let user = await User.findOne({phone: phone});
    if (!user) {
      user = await User.create({
        phone: phone,
        password: password,
        role: role,
        name: name
      });
      tokenJson = await jwtToken.getToken(user);
      remark = '注册成功';
      result = true;
    } else {
      remark = '用户已存在';
      result = false;
    }
    await logs.addUserLoginLogs({
      date: new Date(),
      ip: ip,
      type: type,
      user: user._id,
      result: result,
      remark: remark
    });
    ctx.body = util.returnBody(result ? 'ok' : 'err', remark, tokenJson);
  } catch (err) {
    console.log(err);
    ctx.body = util.returnBody('err', '注册异常');
  }
};

module.exports.register = ({router}) => {
  router.post('/login', login);
  router.post('/register', register);
};