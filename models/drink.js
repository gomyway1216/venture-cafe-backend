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
  count: [
    {
      createdAt: Date,
      user: {
        type: Schema.Types.ObjectId,
        ref: 'Attendee',
      },
    },
  ],
})

module.exports = mongoose.model('Drink', drinkSchema)
