var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companySchema = new Schema({
  _id: String,
  companyname: { type: String, required: true, unique: true },
  url: { type: String, required: true, unique: true },
  created_at: Date,
  updated_at: Date
})

// on every save, add the date
companySchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;

  if (!this.created_at)
    this.created_at = currentDate;
  next()
})

var Company = mongoose.model('Company', companySchema);

module.exports = Company;