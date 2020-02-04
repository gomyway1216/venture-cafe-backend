const mongoose = require('mongoose')

const Schema = mongoose.Schema

const currentDrinkSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  drinkId: {
    type: String,
    required: true,
  },
  drinkType: {
    type: Schema.Types.ObjectId,
    ref: 'DrinkType',
  },
  count: {
    type: [Date],
    required: true,
  },
})

module.exports = mongoose.model('CurrentDrink', currentDrinkSchema)
