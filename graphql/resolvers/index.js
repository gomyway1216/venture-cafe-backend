const authResolver = require('./auth')
const eventsResolver = require('./events')
const bookingResolver = require('./booking')
const attendeeResolver = require('./attendee')
const drinkTypeResolver = require('./drinkType')
const drinkResolver = require('./drink')

const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingResolver,
  ...attendeeResolver,
  ...drinkTypeResolver,
  ...drinkResolver,
}

module.exports = rootResolver
