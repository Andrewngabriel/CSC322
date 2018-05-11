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
  storeJoinedName: {
    type: Schema.Types.String,
    ref: 'Store'
  },
  storeJoinedId: {
    type: Schema.Types.ObjectId,
    ref: 'Store'
  },
  blacklist: {
    type: Boolean,
    default: false,
    required: false
  },
  accountType: {
    // Three types: Regular(default), Visitor, VIP
    type: String,
    required: false,
    default: 'customer',
    lowercase: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  active: {
    type: Boolean,
    default: false
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
    } else if (user.active == false) {
      const err = new Error('User not activated yet');
      err.status = 401;
      callback(err);
    } else {
      callback(null, user);
    }
  });
};

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
