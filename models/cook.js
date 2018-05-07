const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CookSchema = new Schema({
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
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
});

CookSchema.statics.authenticate = function(email, password, callback) {
  Cook.findOne({ email: email, password: password }).exec((err, cook) => {
    if (err) {
      callback(err);
    } else if (!cook) {
      const err = new Error('Cook not found.');
      err.status = 401;
      callback(err);
    } else {
      callback(null, cook);
    }
  });
};

const Cook = mongoose.model('Cook', CookSchema);

module.exports = Cook;
