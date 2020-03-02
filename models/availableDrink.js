const mongoose = require('mongoose')

const Schema = mongoose.Schema

const availableDrinkSchema = new Schema({
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
  consumedDateList: {
    type: [String],
    required: true,
  },
})

module.exports = mongoose.model('AvailableDrink', availableDrinkSchema)
