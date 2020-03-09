const authResolver = require('./auth')
// const attendeeResolver = require('./userResolver/attendee')
// const drinkTypeResolver = require('./drinkType')
// const drinkResolver = require('./drink')
// const currentDrinkResolver = require('./currentDrink')
// const currentAttendee = require('./userResolver/currentAttendee')
// const dailyDrinks = require('./dailyDrinks')

// for drinkResolvers
const drinkTypeResolver = require('./drinkResolver/drinkType')
const registeredDrinkResolver = require('./drinkResolver/registeredDrink')
const availableDrinkResolver = require('./drinkResolver/availableDrink')
const drinkHistoryResolver = require('./drinkResolver/drinkHistory')

// for eventResolvers
const eventTypeResolver = require('./eventResolver/eventType')
const eventResolver = require('./eventResolver/event')

// for userResolvers
const userResolver = require('./userResolver/userNew')
const attendeeResolver = require('./userResolver/attendeeNew')

const rootResolver = {
  ...authResolver,
  // ...attendeeResolver,
  // ...drinkTypeResolver,
  // ...drinkResolver,
  // ...currentDrinkResolver,
  // ...currentAttendee,
  // ...dailyDrinks,

  ...drinkTypeResolver,
  ...registeredDrinkResolver,
  ...availableDrinkResolver,
  ...drinkHistoryResolver,

  ...eventTypeResolver,
  ...eventResolver,

  ...userResolver,
  ...attendeeResolver,
}

module.exports = rootResolver
