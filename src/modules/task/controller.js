/**
 * 任务操作
 */

// 引入所需库
const mongoose = require('mongoose');
// 引入其他方法
const baidu = require('./../baidu/controller');
const util = require('./../util/service');

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
    const {RFID, startAddress, endAddress} = ctx.request.body;
    const {user} = ctx.req;
    const Task = mongoose.model('Task');
    const ToolBox = mongoose.model('ToolBox');
    const task = await Task.findOne({RFID, status: 'start'});
    if (task) {
      ctx.body = util.returnBody('err', '存在未完成任务'); return;
    };
    const toolBox = ToolBox.findOne({RFID});
    const startPositition = await baidu.handleAddress(startAddress);
    const endPosition = await baidu.handleAddress(endAddress);
    if (startPositition.status === 0 && endPosition.status === 0) {
      const task = await Task.create({
        toolBox: toolBox._id,
        RFID: RFID,
        user: user._id,
        startPosition: {
          lng: startPositition.result.location.lng,
          lat: startPositition.result.location.lat
        },
        endPosition: {
          lng: endPosition.result.location.lng,
          lat: endPosition.result.location.lat
        },
        startAddress: startAddress,
        endAddress: endAddress
      });
      await ToolBox.update({RFID}, {
        $set: {
          status: '可调配',
          remark: ''
        }
      });
      ctx.body = util.returnBody('ok', '任务创建成功', task);
    } else {
      ctx.body = util.returnBody('err', '地址异常');
    }
  } catch (err) {
    console.log(err);
    ctx.body = util.returnBody('err', '服务器异常');
  }
};

// 查询某用户下创建的所有任务
const findTaskList = async (ctx) => {
  try {
    const {user} = ctx.req;
    const Task = mongoose.model('Task');
    const task = await Task.find({user: user._id});
    ctx.body = util.returnBody('ok', '查询成功', task);
  } catch (err) {
    console.log(err);
  }
};

// 通用辅助方法

module.exports.register = ({router, authRouter}) => {
  authRouter.post('/create/task', createTask);
  router.get('/find/task/one', findTaskOne);
  authRouter.get('/find/task/list', findTaskList);
};