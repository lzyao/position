/**
 * 任务操作
 */

// 引入所需库
const mongoose = require('mongoose');
// 引入其他方法
const baidu = require('./../baidu/controller');

// 操作接口

// 查询单个设备执行中任务
const findTaskOne = async (ctx) => {
  try {
    const {RFID} = ctx.request.query;
    const Task = mongoose.model('Task');
    const task = await Task.findOne({RFID: RFID, status: 'start'});
    ctx.body = {success: 1, data: task, message: '添加成功'};
  } catch (err) {
    console.log(err);
  }
};

// 创建任务
const createTask = async (ctx) => {
  try {
    const {RFID, user, startAddress, endAddress} = ctx.request.query;
    const Task = mongoose.model('Task');
    const ToolBox = mongoose.model('ToolBox');
    const startPositition = await baidu.handleAddress(startAddress);
    const endPosition = await baidu.handleAddress(endAddress);
    if (startPositition.status === 0 && endPosition.status === 0) {
      const task = await Task.create({
        RFID: RFID,
        user: user,
        startPosition: {
          longitude: startPositition.result.location.lng,
          latitude: startPositition.result.location.lat
        },
        endPosition: {
          longitude: endPosition.result.location.lng,
          latitude: endPosition.result.location.lat
        },
        startAddress: startAddress,
        endAddress: endAddress
      });
      await ToolBox.update({RFID}, {
        $set: {
          status: '正常',
          remark: ''
        }
      });
      ctx.body = {success: 1, data: task, message: '任务创建成功'};
    } else {
      ctx.body = {success: 0, data: {}, message: '地址异常'};
    }
  } catch (err) {
    console.log(err);
  }
};

// 通用辅助方法

module.exports.register = ({router}) => {
  router.get('/create/task', createTask);
  router.get('/find/task/one', findTaskOne);
};