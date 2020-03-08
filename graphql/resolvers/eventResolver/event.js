const Event = require('../../../models/eventSchemas/event')
const EventType = require('../../../models/eventSchemas/eventType')
const { findEventHelper } = require('../helper/helper')

module.exports = {
  /**
   * Endpoint to check the existence of event by id
   *
   * @param {string} id id of the searching event
   * @return {boolean} returns true if the searching event is found,
   * otherwise returns false
   */
  existEvent: async (args, req) => {
    try {
      const eventFound = await findEventHelper(args.id)
      if (eventFound) {
        return true
      } else {
        return false
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to return event with passed id
   *
   * @param {string} id id of the searching event
   * @return {Event|null} returns event object if found,
   * otherwise returns null
   */
  getEvent: async (args, req) => {
    try {
      const event = await Event.findOne({
        _id: args.id,
      })

      // if registered drink is not found, return null explicitly
      if (!event) {
        return null
      }
      return event
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to return all events.
   *
   * @return {Array<Event>} all events
   */
  getEventList: async () => {
    try {
      return Event.find()
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to add event.
   *
   * @param {string} name name of the adding event
   * @param {string} drinkTypeID id of the drink type of the registering drink
   * @param {string} date date of the adding event
   * @param {string} location location of the drink type of the registering drink,
   * @return {Event} created RegisteredDrink
   */
  addEvent: async (args, req) => {
    try {
      const eventType = await EventType.findOne({
        _id: args.addEventInput.eventTypeID,
      })

      if (!eventType) {
        throw new Error('The specified EventType does not exist.')
      }

      // safety checking
      const foundEvent = await Event.findOne({
        name: args.addEventInput.name,
        eventType: args.addEventInput.eventTypeID,
        date: args.addEventInput.date,
        location: args.addEventInput.location,
      })

      if (foundEvent) {
        throw new Error('Adding event already exists.')
      }

      const newEvent = new Event({
        name: args.addEventInput.name,
        eventType: args.addEventInput.eventTypeID,
        date: args.addEventInput.date,
        location: args.addEventInput.location,
        drinkList: [],
      })

      // return the created event object
      return newEvent
        .save()
        .then(newEvent => newEvent.populate('eventType').execPopulate())
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to remove event.
   *
   * @param {string} id id of the removing event
   * @return {boolean} returns true if deletion is successful,
   * otherwise returns false
   */
  deleteEvent: async (args, req) => {
    try {
      const eventFound = await findEventHelper(args.id)
      if (!eventFound) {
        return false
      }

      await Event.deleteOne({
        _id: args.id,
      })
      return true
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
