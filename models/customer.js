const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: false,
    trim: true,
    lowercase: true
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
  storeJoined: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: false
  },
  blacklist: {
    type: Boolean,
    default: false,
    required: false
  },
  accountType: {
    type: String,
    required: true,
    lowercase: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
});

CustomerSchema.statics.authenticate = function(
  email,
  password,
  accountType,
  callback
) {
  Customer.findOne({
    email: email,
    password: password,
    accountType: accountType
  }).exec((err, user) => {
    if (err) {
      callback(err);
    } else if (!user) {
      const err = new Error('User not found.');
      err.status = 401;
      callback(err);
    } else {
      callback(null, user);
    }
  });
};

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
