const mongoose = require('mongoose')

const Schema = mongoose.Schema

const drinkSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  drinkType: {
    type: Schema.Types.ObjectId,
    ref: 'DrinkType',
  },
  count: {
    type: [String],
    required: true,
  },
})

module.exports = mongoose.model('Drink', drinkSchema)
