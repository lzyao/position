
/**
 * 定位设备主数据
 */
module.exports.mongo = (Schema) => {
  const DeviceSchema = new Schema({
    device: String, // 定位设备唯一ID
    toolBox: {
      type: Schema.Types.ObjectId,
      ref: 'ToolBox'
    },
    RFID: String, // RFID 工具箱唯一标识
    status: {
      type: String,
      enum: [
        '正常',
        '损坏',
        '设备分离'
      ],
      default: '正常'
    } // 设备状态
  });
  return ['Device', DeviceSchema];
};