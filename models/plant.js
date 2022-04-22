const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  seasonality: {
    type: Schema.Types.ObjectId,
    ref: 'Seasonality',
    required: true,
  },
  zone: {
    type: Schema.Types.ObjectId,
    ref: 'Zone',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  }
})

PlantSchema.virtual('url').get(function () {
  return '/inventory/plant/' + this._id;
})

module.exports = mongoose.model('Plant', PlantSchema);
