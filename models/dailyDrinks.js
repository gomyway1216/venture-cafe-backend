const mongoose = require('mongoose')

const Schema = mongoose.Schema

const dailyDrinksSchema = new Schema({
  // group by the same date. But also saves the detailed time for each drink
  // in order to add slicing functionality by time
  date: {
    type: Date,
    required: true,
  },
  drinks: [
    {
      drink: {
        type: Schema.Types.ObjectId,
        ref: 'Drink',
      },
      date: {
        type: Date,
        required: true,
      },
    },
  ],
})

module.exports = mongoose.model('DailyDrinks', dailyDrinksSchema)
