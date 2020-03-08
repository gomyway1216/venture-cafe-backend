const EventType = require('../../../models/eventSchemas/eventType')
const { findEventTypeHelper } = require('../helper/helper')

module.exports = {
  /**
   * Endpoint to check the existence of event type by id
   *
   * @param {string} id id of the searching event type
   * @return {boolean} returns true if the searching event type is found,
   * otherwise returns false
   */
  existEventType: async (args, req) => {
    try {
      const eventTypeFound = await findEventTypeHelper(args.id)
      if (eventTypeFound) {
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
   * Endpoint to return event type with passed id
   *
   * @param {string} id id of the searching event type
   * @return {EventType|null} returns event type object if found,
   * otherwise returns null
   */
  getEventType: async (args, req) => {
    try {
      const eventType = await EventType.findOne({
        _id: args.id,
      })

      if (!eventType) {
        return null
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to return all event types.
   *
   * @return {Array<EventType>} array of all event types.
   */
  getEventTypeList: async (args, req) => {
    try {
      return EventType.find()
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to add event type.
   *
   * @param {string} name name of the registering event type
   * @return {DrinkType} created EventType
   */
  addEventType: async (args, req) => {
    try {
      // check if the adding drink type already exists in drink type table
      const foundEventType = await EventType.findOne({
        name: args.name,
      })

      if (foundEventType) {
        throw new Error('Adding drink type already exists on table.')
      }

      const newEventType = new EventType({
        name: args.name,
      })

      return newEventType.save()
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to remove event type.
   *
   * @param {string} id id of the removing event type
   * @return {boolean} returns true if deletion is successful,
   * otherwise returns false
   */
  deleteEventType: async (args, req) => {
    try {
      const eventTypeFound = await findEventTypeHelper(args.id)
      if (!eventTypeFound) {
        return false
      }

      await EventType.deleteOne({
        _id: args.id,
      })
      return true
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
