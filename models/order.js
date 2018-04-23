const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  customerAddress: {
    type: String,
    required: true
  },
  pizzaSize: {
    type: String,
    required: true,
    trim: true
  },
  pizzaToppings: {
    type: String,
    required: true,
    trim: true
  },
  pizzaRating: {
    value: { type: Number, min: 0, max: 5 },
    required: false
  },
  deliveryRating: {
    value: { type: Number, min: 0, max: 5 },
    required: false
  },
  customerRating: {
    value: { type: Number, min: 0, max: 5 },
    required: false
  }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
