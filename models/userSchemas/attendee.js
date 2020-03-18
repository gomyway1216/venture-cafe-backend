const mongoose = require('mongoose')

const Schema = mongoose.Schema

const attendeeSchema = new Schema({
  userID: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
  },
  drinkList: [
    {
      type: Schema.Types.ObjectId,
      ref: 'AvailableDrink',
    },
  ],
})

module.exports = mongoose.model('Attendee', attendeeSchema)
