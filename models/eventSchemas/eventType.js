const mongoose = require('mongoose')

const Schema = mongoose.Schema

const eventTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('EventType', eventTypeSchema)
