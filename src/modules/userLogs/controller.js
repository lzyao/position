/**
 * 用户日志
 */
const mongoose = require('mongoose');

// 插入用户登录日志
const addUserLoginLogs = async (userLos) => {
  const UserLogs = mongoose.model('UserLogs');
  await UserLogs.create(userLos);
};

module.exports.addUserLoginLogs = addUserLoginLogs;

module.exports.register = ({ router }) => {
};