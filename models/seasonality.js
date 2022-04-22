const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SeasonalitySchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: [
      'Annual',
      'Perennial',
    ]
  },
  description: {
    type: String,
    required: true
  },
})

SeasonalitySchema.virtual('url').get(function () {
  return '/inventory/seasonality/' + this._id;
})

module.exports = mongoose.model('Seasonality', SeasonalitySchema);
