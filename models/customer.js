const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: false,
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
  },
  blacklist: {
    type: Boolean,
    default: false,
    required: false
  },
  accountType: {
    type: String,
    required: true
  },
  rating: {
    type: { type: Number, min: 0, max: 5 },
    default: 0
  }
});

CustomerSchema.statics.authenticate = function(
  email,
  password,
  accountType,
  callback
) {
  Customer.findOne({
    email: email
  }).exec((err, user) => {
    if (err) {
      callback(err);
    } else if (!user) {
      const err = new Error('User not found.');
      err.status = 401;
      callback(err);
    }

    if (password == user.password && accountType == user.accountType) {
      callback(null, user);
    } else {
      callback();
    }
  });
};

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
