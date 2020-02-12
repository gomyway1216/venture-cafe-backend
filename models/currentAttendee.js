const mongoose = require('mongoose')

const Schema = mongoose.Schema

const currentAttendeeSchema = new Schema({
  attendeeId: {
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
  lastSignInDate: {
    type: String,
    required: true,
  },
  drinks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Drink',
    },
  ],
})

module.exports = mongoose.model('CurrentAttendee', currentAttendeeSchema)
