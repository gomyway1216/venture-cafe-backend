// for drinkResolvers
const drinkTypeResolver = require('./drinkResolver/drinkType')
const registeredDrinkResolver = require('./drinkResolver/registeredDrink')
const availableDrinkResolver = require('./drinkResolver/availableDrink')
const drinkHistoryResolver = require('./drinkResolver/drinkHistory')

// for eventResolvers
const eventTypeResolver = require('./eventResolver/eventType')
const eventResolver = require('./eventResolver/event')

// for userResolvers
const userResolver = require('./userResolver/user')
const attendeeResolver = require('./userResolver/attendee')

const rootResolver = {
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
