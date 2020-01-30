const mongoose = require('mongoose')

const Schema = mongoose.Schema

const drinkTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdDrinks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Drink',
    },
  ],
})

module.exports = mongoose.model('DrinkType', drinkTypeSchema)
