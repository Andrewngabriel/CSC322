const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VisitorSchema = new Schema({
  accountType: {
    type: String,
    required: true
  },
  storeJoined: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: false
  }
});
