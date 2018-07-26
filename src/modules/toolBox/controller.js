/**
 * 工具操作
 */

// 引入所需库
const mongoose = require('mongoose');

// 引入其他方法
const util = require('./../util/service');

// 操作接口

// 添加工具箱信息
const createToolBox = async (ctx) => {
  try {
    const {RFID, tool} = ctx.request.body;
    const ToolBox = mongoose.model('ToolBox');
    const toolBox = await ToolBox.findOne({RFID: RFID});
    // 不存在就添加
    if (!toolBox) {
      await ToolBox.create({
        RFID: RFID,
        tool: tool
      });
      ctx.body = {success: 1, status: 200, message: '添加成功'};
    } else {
      ctx.body = {success: 0, status: 1001, message: '硬件ID已存在'};
    }
  } catch (err) {
    console.log(err);
  }
};

// 更新工具状态，标记损坏
const updateToolBox = async (ctx) => {
  try {

  } catch (err) {
    console.log(err);
  }
};

// 查询所有可以调用的工具箱集合
const findToolBox = async (ctx) => {
  try {
    const ToolBox = mongoose.model('ToolBox');
    const toolbox = await ToolBox.find({status: '正常'});
    ctx.body = util.returnBody('ok', '查询成功', toolbox);
  } catch (err) {
    console.log(err);
  }
};

// 通用辅助方法

module.exports.register = ({router}) => {
  router.post('/create/toolbox', createToolBox);
  router.get('/update/toolbox', updateToolBox);
  router.get('/find/toolbox', findToolBox);
};