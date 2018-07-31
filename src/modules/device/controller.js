
/**
 * 设备操作
 */

// 引入所需库
const mongoose = require('mongoose');
const util = require('./../util/service');

// 引入其他方法

// 操作接口

// 创建新的设备信息
const createDevice = async (ctx) => {
  try {
    const {device} = ctx.request.body;
    const Device = mongoose.model('Device');
    // 判断硬件是否已经存在
    const deviceOne = await Device.findOne({device: device});
    // 不存在就添加
    if (!deviceOne) {
      await Device.create({
        device: device
      });
      ctx.body = util.returnBody(true, '添加成功');
    } else {
      ctx.body = {success: 0, status: 1001, message: '硬件ID已存在'};
      ctx.body = util.returnBody(false, '硬件ID已存在');
    }
  } catch (err) {
    console.log(err);
    ctx.body = util.returnBody(false, '操作异常');
  }
};

// 硬件绑定到对应工具箱
const updateDeviceToolBox = async (ctx) => {
  try {
    const {device, RFID} = ctx.request.body;
    // 更新硬件设备对应的工具箱
    const result = await updateDevice(device, RFID);
    if (result) {
      ctx.body = util.returnBody(true, '绑定成功');
    }
  } catch (err) {
    console.log(err);
  };
};

// 通用辅助方法

/**
 * 更新设备对应的工具箱
 * @param {*} device 设备唯一编号
 * @param {*} RFID 工具箱唯一编号
 */
const updateDevice = async (device, RFID) => {
  try {
    const Device = mongoose.model('Device');
    const ToolBox = mongoose.model('ToolBox');
    const toolBox = await ToolBox.findOne({RFID});
    if (toolBox) {
      // 更新硬件设备对应的工具箱
      await Device.update({device: device}, {
        $set: {
          RFID: RFID,
          toolBox: toolBox._id
        }
      });
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  };
};

module.exports.register = ({router}) => {
  // 对应接口路由
  router.post('/create/device', createDevice);
  router.post('/update/device/toolbox', updateDeviceToolBox);
};