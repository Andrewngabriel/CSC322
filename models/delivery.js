const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
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
  password: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  orderDelivering: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: false
  }
});

ManagerSchema.statics.authenticate = function(email, password, callback) {
  Manager.findOne({ email: email }).exec((err, delivery) => {
    if (err) {
      callback(err);
    } else if (!delivery) {
      const err = new Error('Manager not found.');
      err.status = 401;
      callback(err);
    }

    if (password == delivery.password) {
      callback(null, delivery);
    } else {
      callback();
    }
  });
};

const Delivery = mongoose.model('Delivery', DeliverySchema);

module.exports = Delivery;
