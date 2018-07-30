/**
 * 任务表
 */
module.exports.mongo = (Schema) => {
  const TaskSchema = new Schema({
    RFID: String, // 工具箱ID
    user: Schema.Types.ObjectId,
    startPosition: {
      lng: Number,
      lat: Number
    }, // 起始地经纬度
    startAddress: String, // 起始地址
    endPosition: {
      lng: Number,
      lat: Number
    }, // 目的地经纬度
    transflow: Array, // 任务流程
    endAddress: String, // 目的地地址
    remark: {
      type: String,
      enum: [
        '起始',
        '在途',
        '到达'
      ],
      default: '起始'
    },
    status: {
      type: String,
      enum: ['start', 'end'], // 开始/结束
      default: 'start'
    },
    startdate: Date, // 任务创建时间
    endDate: Date // 任务完成时间
  });
  return ['Task', TaskSchema];
};