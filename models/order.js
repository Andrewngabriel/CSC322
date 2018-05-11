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
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
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
  drink: {
    type: String,
    required: true,
    trim: true
  },
  salad: {
    type: String,
    required: true,
    trim: true
  },
  dough: {
    type: String,
    required: true,
    trim: true
  },
  delivery: {
    type: Schema.Types.ObjectId,
    ref: 'Delivery',
    required: false
  },
  cook: {
    type: Schema.Types.ObjectId,
    ref: 'Cook',
    required: false
  },
  pizzaRating: {
    type: Number,
    min: 1,
    max: 5
  },
  status: {
    type: Boolean,
    default: false
  }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
