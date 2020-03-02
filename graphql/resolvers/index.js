const authResolver = require('./auth')
const attendeeResolver = require('./attendee')
const drinkTypeResolver = require('./drinkType')
const drinkResolver = require('./drink')
const currentDrinkResolver = require('./currentDrink')
const currentAttendee = require('./currentAttendee')
const dailyDrinks = require('./dailyDrinks')
const availableDrink = require('./availableDrink')

const rootResolver = {
  ...authResolver,
  ...attendeeResolver,
  ...drinkTypeResolver,
  ...drinkResolver,
  ...currentDrinkResolver,
  ...currentAttendee,
  ...dailyDrinks,
  ...availableDrink,
}

module.exports = rootResolver
