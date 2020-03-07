const mongoose = require('mongoose')

const Schema = mongoose.Schema

const drinkTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  registeredDrinkList: [
    {
      type: Schema.Types.ObjectId,
      ref: 'RegisteredDrinkType',
    },
  ],
})

module.exports = mongoose.model('DrinkType', drinkTypeSchema)
