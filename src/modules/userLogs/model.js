
module.exports.mongo = function (Schema) {
  const UserLogsSchema = new Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    date: Date,
    type: String,
    username: String,
    ip: String,
    result: String,
    remark: String
  });
  return ['UserLogs', UserLogsSchema];
};