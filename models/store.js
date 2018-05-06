const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'Manager'
  },
  address: {
    type: Number,
    unique: true,
    requires: true,
    min: 0,
    max: 50,
    trim: trim
  }
});

const Store = mongoose.model('Store', StoreSchema);

module.exports = Store;
