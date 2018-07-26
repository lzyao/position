const bcrypt = require('bcrypt');

module.exports.mongo = function (Schema) {
  const UserSchema = new Schema({
    phone: String, // 登录密码
    password: String, // 登录密码
    name: String,
    role: {
      type: Number,
      comment: '角色',
      enum: [ 1, 2, 3, 4 ]
    },
    active: String,
    freeze: {
      type: Boolean,
      default: false
    }
  });
  UserSchema.pre('save', function (next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    var salt = bcrypt.genSaltSync(10);
    var hash;
    hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
    next();
  });
  return ['User', UserSchema];
};