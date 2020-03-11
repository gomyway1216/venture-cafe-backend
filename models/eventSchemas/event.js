const mongoose = require('mongoose')

const Schema = mongoose.Schema

// date is saved in moment js format
const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  eventType: {
    type: Schema.Types.ObjectId,
    ref: 'EventType',
  },
  date: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  drinkList: [
    {
      drink: {
        type: Schema.Types.ObjectId,
        ref: 'RegisteredDrink',
      },
      date: {
        type: String,
        required: true,
      },
    },
  ],
})

module.exports = mongoose.model('Event', eventSchema)
