const mongoose = require('mongoose')

const Schema = mongoose.Schema
const registeredDrinkSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  drinkType: {
    type: Schema.Types.ObjectId,
    ref: 'DrinkType',
  },
})

module.exports = mongoose.model('RegisteredDrink', registeredDrinkSchema)
