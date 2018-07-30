/**
 * 工具箱定位日志
 */
module.exports.mongo = (Schema) => {
  const ToolBoxLogsSchema = new Schema({
    RFID: String, // RFID 工具箱唯一标识
    remark: String, // 当前定位备注
    task: Schema.Types.ObjectId, // 任务ID
    position: {
      lng: Number,
      lat: Number
    }, // 定位经纬度
    date: Date, // 定位时间
    address: String, // 定位具体地址
    province: String, // 对应省份
    city: String, // 对应城市
    district: String // 对应区
  });
  return ['ToolBoxLogs', ToolBoxLogsSchema];
};