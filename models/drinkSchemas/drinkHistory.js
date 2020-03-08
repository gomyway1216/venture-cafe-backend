const mongoose = require('mongoose')

const Schema = mongoose.Schema

const drinkHistorySchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  registeredDrink: {
    type: Schema.Types.ObjectId,
    ref: 'RegisteredDrink',
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
  },
})

module.exports = mongoose.model('DrinkHistory', drinkHistorySchema)
