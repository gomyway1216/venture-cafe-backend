const mongoose = require('mongoose')

const Schema = mongoose.Schema

const attendeeSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  drinkCounter: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  drinks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Drink',
    },
  ],
})

module.exports = mongoose.model('Attendee', attendeeSchema)
