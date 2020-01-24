const authResolver = require("./auth");
const eventsResolver = require("./events");
const bookingResolver = require("./booking");
const attendeeResolver = require("./attendee");

const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingResolver,
  ...attendeeResolver
};

module.exports = rootResolver;
