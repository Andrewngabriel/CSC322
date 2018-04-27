const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManagerSchema = new Schema({
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
  accountType: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

ManagerSchema.statics.authenticate = function(email, password, callback) {
  Manager.findOne({ email: email }).exec((err, manager) => {
    if (err) {
      callback(err);
    } else if (!manager) {
      const err = new Error('Manager not found.');
      err.status = 401;
      callback(err);
    }

    if (password == manager.password) {
      callback(null, manager);
    } else {
      callback();
    }
  });
};

const Manager = mongoose.model('Manager', ManagerSchema);

module.exports = Manager;
