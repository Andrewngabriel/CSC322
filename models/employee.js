const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

EmployeeSchema.statics.authenticate = function(
  email,
  password,
  position,
  callback
) {
  Employee.findOne({
    email: email,
    password: password,
    position: position
  }).exec((err, employee) => {
    if (err) {
      callback(err);
    } else if (!employee) {
      const err = new Error('Employee not found.');
      err.status = 401;
      callback(err);
    } else {
      callback(null, employee);
    }
  });
};

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;
