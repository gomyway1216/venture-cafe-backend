const mongoose = require('mongoose')

const Schema = mongoose.Schema

const drinkTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('DrinkType', drinkTypeSchema)
