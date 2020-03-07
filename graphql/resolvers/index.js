const authResolver = require('./auth')
const attendeeResolver = require('./userResolver/attendee')
const drinkTypeResolver = require('./drinkType')
const drinkResolver = require('./drink')
const currentDrinkResolver = require('./currentDrink')
const currentAttendee = require('./userResolver/currentAttendee')
const dailyDrinks = require('./dailyDrinks')
const registeredDrink = require('./drinkResolver/registeredDrink')
const availableDrink = require('./drinkResolver/availableDrink')

const rootResolver = {
  ...authResolver,
  ...attendeeResolver,
  ...drinkTypeResolver,
  ...drinkResolver,
  ...currentDrinkResolver,
  ...currentAttendee,
  ...dailyDrinks,
  ...registeredDrink,
  ...availableDrink,
}

module.exports = rootResolver
