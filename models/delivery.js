const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
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

DeliverySchema.statics.authenticate = function(email, password, callback) {
  Delivery.findOne({ email: email, password: password }).exec(
    (err, delivery) => {
      if (err) {
        callback(err);
      } else if (!delivery) {
        const err = new Error('Delivery Person not found.');
        err.status = 401;
        callback(err);
      } else {
        callback(null, delivery);
      }
    }
  );
};

const Delivery = mongoose.model('Delivery', DeliverySchema);

module.exports = Delivery;
