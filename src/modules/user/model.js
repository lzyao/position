/**
 * 用户model
 */
module.exports.mongo = (Schema) => {
  const UserSchema = new Schema({
  });
  return ['User', UserSchema];
};