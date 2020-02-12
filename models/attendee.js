const mongoose = require('mongoose')

const Schema = mongoose.Schema

const attendeeSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  signUpDate: {
    type: String,
    required: true,
  },
  lastSignInDate: {
    type: String,
  },
  drinks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Drink',
    },
  ],
})

module.exports = mongoose.model('Attendee', attendeeSchema)
