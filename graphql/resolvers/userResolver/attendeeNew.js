const User = require('../../../models/userSchemas/user')
const Attendee = require('../../../models/userSchemas/attendee')
const AvailableDrink = require('../../../models/drinkSchemas/availableDrink')
const { findAttendeeHelper } = require('../helper/helper')

module.exports = {
  /**
   * Endpoint to check the existence of attendee by id
   *
   * @param {string} id id of the searching attendee
   * @return {boolean} returns true if the searching attendee is found,
   * otherwise returns false
   */
  existAttendee: async (args, req) => {
    try {
      const attendeeFound = await findAttendeeHelper(args.id)
      if (attendeeFound) {
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
   * Endpoint to return Attendee passed id
   *
   * @param {string} id id of the searching attendee
   * @return {Attendee|null} returns available attendee object if found,
   * otherwise returns null
   */
  getAttendee: async (args, req) => {
    try {
      const foundAttendee = await Attendee.findOne({
        _id: args.id,
      }).populate('drinkList')

      if (!foundAttendee) {
        return null
      }
      return foundAttendee
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to return all attendees.
   *
   * @return {Array<Attendee>} returns all available attendees
   */
  getAttendeeList: async (args, req) => {
    try {
      return await Attendee.find().populate('drinkList')
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to return Attendee checking in
   *
   * @param {string} id id of the checkIn user
   * @param {string} date date of the check in
   * @return {Attendee} returns the object of the user checked in
   */
  checkInUser: async (args, req) => {
    try {
      //  check if the check in user has signed up
      const foundUser = await User.findOne({
        _id: args.checkInUserInput.id,
      })

      if (!foundUser) {
        throw new Error('The check in attendee has not signed up yet.')
      }

      // check if the user already checked in to the event
      const foundAttendee = await Attendee.findOne({
        userID: args.checkInUserInput.id,
      })

      if (foundAttendee) {
        throw new Error('The check in user has already checked in')
      }

      foundUser.lastSignInDate = args.checkInUserInput.date
      await foundUser.save()

      const attendee = new Attendee({
        userID: foundUser.id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        drinkList: [],
      })

      return attendee.save()
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to return Reset the drinkList of an attendee with passed id
   *
   * @param {string} id id of the attendee
   * @return {Attendee} returns updated Attendee object
   */
  resetAttendeeDrinkList: async (args, req) => {
    try {
      const foundAttendee = await Attendee.findOne({
        _id: args.id,
      })

      if (!foundAttendee) {
        throw new Error(
          'The attendee that trying to reset drink list does not exist'
        )
      }

      foundAttendee.drinkList = []

      return foundAttendee
        .save()
        .then(foundAttendee =>
          foundAttendee.populate('drinkList').execPopulate()
        )
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to update the attendee's drinkList
   *
   * @param {string} id id of the attendee
   * @param {string} availableDrinkID drinkID of the drink that the attendee consumed
   * @param {string} date date of the drink consumed
   * @return {Attendee} returns updated Attendee object
   */
  updateAttendeeDrinkList: async (args, req) => {
    try {
      const foundAttendee = await Attendee.findOne({
        _id: args.updateAttendeeDrinkListInput.id,
      })

      if (!foundAttendee) {
        throw new Error('The updating attendee does not exist.')
      }

      const foundAvailableDrink = await AvailableDrink.findOne({
        _id: args.updateAttendeeDrinkListInput.availableDrinkID,
      })

      if (!foundAvailableDrink) {
        throw new Error('The updating drink of the attendee does not exist.')
      }

      // reflecting the change from the attendee to the available drink count
      foundAttendee.drinkList.push(foundAvailableDrink.id)
      foundAvailableDrink.consumedDateList.push(
        args.updateAttendeeDrinkListInput.date
      )

      await foundAvailableDrink.save()
      return foundAttendee
        .save()
        .then(foundAttendee =>
          foundAttendee.populate('drinkList').execPopulate()
        )
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to remove attendee.
   *
   * @param {string} id id of the removing attendee
   * @return {boolean} returns true if deletion is successful,
   * otherwise returns false
   */
  deleteAttendee: async (args, req) => {
    try {
      const attendee = await findAttendeeHelper(args.id)

      if (!attendee) {
        return false
      }

      await Attendee.deleteOne({
        _id: args.id,
      })
      return true
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to remove all attendees.
   *
   * @return {boolean} returns true if deletion is successful,
   * otherwise returns false
   */
  deleteAttendees: async (args, req) => {
    try {
      await Attendee.deleteMany({}, function(err, data) {
        if (err) {
          throw new Error('Deleting all attendees has some issues.')
          return false
        }
      })
      return true
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
