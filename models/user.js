const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email }).exec((err, user) => {
    if (err) {
      callback(err);
    } else if (!user) {
      const err = new Error('User not found.');
      err.status = 401;
      callback(err);
    }

    if (password == user.password) {
      callback(null, user);
    } else {
      callback();
    }
  });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
