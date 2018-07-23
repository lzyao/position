/**
 * 工具箱主数据
 */
module.exports.mongo = (Schema) => {
  const ToolBoxSchema = new Schema({
    RFID: String, // RFID 工具箱唯一标识
    status: {
      type: String,
      enum: [
        '可调配',
        '占用',
        '异常'
      ],
      default: '可调配'
    }, // 工具箱状态
    remark: String, // 状态详情
    tool: Array  // 工具箱中工具数量
  });
  return ['ToolBox', ToolBoxSchema];
};