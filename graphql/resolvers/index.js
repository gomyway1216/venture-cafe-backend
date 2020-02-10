const authResolver = require('./auth')
const eventsResolver = require('./events')
const bookingResolver = require('./booking')
const attendeeResolver = require('./attendee')
const drinkTypeResolver = require('./drinkType')
const drinkResolver = require('./drink')
const currentDrinkResolver = require('./currentDrink')
const currentAttendee = require('./currentAttendee')
const dailyDrinks = require('./dailyDrinks')

const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingResolver,
  ...attendeeResolver,
  ...drinkTypeResolver,
  ...drinkResolver,
  ...currentDrinkResolver,
  ...currentAttendee,
  ...dailyDrinks,
}

module.exports = rootResolver
