const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ZoneSchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: [
      '1-3',
      '4-6',
      '7-9',
      '10-12',
      '13',
    ]
  },
  description: {
    type: String,
    required: true
  },
})

ZoneSchema.virtual('url').get(function () {
  return '/inventory/zone/' + this._id;
})

module.exports = mongoose.model('Zone', ZoneSchema);
