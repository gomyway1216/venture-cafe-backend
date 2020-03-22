const EventType = require('../../../models/eventSchemas/eventType')
const AvailableDrink = require('../../../models/drinkSchemas/availableDrink')
const RegisteredDrink = require('../../../models/drinkSchemas/registeredDrink')
const User = require('../../../models/userSchemas/user')
const Attendee = require('../../../models/userSchemas/attendee')
const Event = require('../../../models/eventSchemas/event')
const DrinkType = require('../../../models/drinkSchemas/drinkType')

/**
 * Helper function to find availableDrink.
 *
 * @param {string} id id of the finding available drink
 * @return {boolean} true if the searched available drink is found
 * else, returns false
 */
const findAvailableDrinkHelper = async id => {
  try {
    const availableDrink = await AvailableDrink.findOne({
      _id: id,
    })

    if (availableDrink) {
      return true
    } else {
      return false
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

/**
 * Helper function to find registeredDrink.
 *
 * @param {string} id id of the finding registered drink
 * @return {boolean} true if the searched registered drink is found
 * else, returns false
 */
const findRegisteredDrinkHelper = async id => {
  try {
    const registeredDrink = await RegisteredDrink.findOne({
      _id: id,
    })

    if (registeredDrink) {
      return true
    } else {
      return false
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

/**
 * Helper function to find user.
 *
 * @param {string} id id of the finding user
 * @return {boolean} true if the searched user is found
 * else, returns false
 */
const findUserHelper = async id => {
  try {
    const user = await User.findOne({
      _id: id,
    })

    if (user) {
      return true
    } else {
      return false
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

/**
 * Helper function to find attendee.
 *
 * @param {string} id id of the finding attendee
 * @return {boolean} true if the searched attendee is found
 * else, returns false
 */
const findAttendeeHelper = async id => {
  try {
    const attendee = await Attendee.findOne({
      _id: id,
    })

    if (attendee) {
      return true
    } else {
      return false
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

/**
 * Helper function to find event.
 *
 * @param {string} id id of the finding event
 * @return {boolean} true if the searched event is found
 * else, returns false
 */
const findEventHelper = async id => {
  try {
    const event = await Event.findOne({
      _id: id,
    })

    if (event) {
      return true
    } else {
      return false
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

/**
 * Helper function to find event type.
 *
 * @param {string} id id of the finding event type
 * @return {boolean} true if the searched event type is found
 * else, returns false
 */
const findEventTypeHelper = async id => {
  try {
    const eventType = await EventType.findOne({
      _id: id,
    })

    if (eventType) {
      return true
    } else {
      return false
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

/**
 * Helper function to find drink type.
 *
 * @param {string} id id of the finding drink type
 * @return {boolean} true if the searched drink type is found
 * else, returns false
 */
const findDrinkTypeHelper = async id => {
  try {
    const drinkType = await DrinkType.findOne({
      _id: id,
    })

    if (drinkType) {
      return true
    } else {
      return false
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

const asyncForEach = async (array, callback) => {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array)
  }
}

// const addAvailableDrinkHelper = async id => {
//   try {
//     // check if the passed registered drink exists on the RegisteredDrink table
//     const registeredDrink = await RegisteredDrink.findOne({
//       _id: id,
//     })

//     // it is error because the method should not allow user to add drink
//     // which doesn't exist in the registered drink table
//     if (!registeredDrink) {
//       throw new Error('Passed id does not exist in the registered drink table.')
//     }

//     // safety search to check whether the adding available drink exists
//     // on available drink table
//     const foundAvailableDrink = await AvailableDrink.findOne({
//       drinkID: args.addAvailableDrinkInput.id,
//       event: mongoose.Types.ObjectId(args.addAvailableDrinkInput.eventID),
//     })
//     if (foundAvailableDrink) {
//       throw new Error('The adding available drink already exists.')
//     }

//     // check the adding the event that the available drink is registered exits or not
//     const event = await Event.findOne({
//       _id: args.addAvailableDrinkInput.eventID,
//     })

//     if (!event) {
//       throw new Error('The event the attendee is attending does not exist.')
//     }
//   } catch (err) {
//     console.log(err)
//     throw err
//   }
// }

exports.findAvailableDrinkHelper = findAvailableDrinkHelper
exports.findRegisteredDrinkHelper = findRegisteredDrinkHelper
exports.findUserHelper = findUserHelper
exports.findAttendeeHelper = findAttendeeHelper
exports.findEventHelper = findEventHelper
exports.findEventTypeHelper = findEventTypeHelper
exports.findDrinkTypeHelper = findDrinkTypeHelper
exports.asyncForEach = asyncForEach
