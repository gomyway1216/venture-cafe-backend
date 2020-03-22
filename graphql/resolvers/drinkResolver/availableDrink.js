const AvailableDrink = require('../../../models/drinkSchemas/availableDrink')
const RegisteredDrink = require('../../../models/drinkSchemas/registeredDrink')
const Event = require('../../../models/eventSchemas/event')
const { findAvailableDrinkHelper, asyncForEach } = require('../helper/helper')
const mongoose = require('mongoose')

module.exports = {
  /**
   * Endpoint to check the existence of available drink by id
   *
   * @param {string} id id of the searching available drink
   * @return {boolean} returns true if the searching available drink is found,
   * otherwise returns false
   */
  existAvailableDrink: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      const availableDrinkFound = await findAvailableDrinkHelper(args.id)
      if (availableDrinkFound) {
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
   * Endpoint to return available drink with passed id
   *
   * @param {string} id id of the searching available drink
   * @return {AvailableDrink|null} returns available drink object if found,
   * otherwise returns null
   */
  getAvailableDrink: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      const availableDrink = await AvailableDrink.findOne({
        _id: args.id,
      }).populate('event drinkType')

      // if available drink is not found, return null explicitly
      if (!availableDrink) {
        return null
      }
      return availableDrink
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to return all available drinks.
   * @param {string} eventID id of event
   * @return {Array<AvailableDrink>} all available Drinks
   */
  getAvailableDrinkList: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      const result = await AvailableDrink.aggregate([
        {
          $match: {
            event: mongoose.Types.ObjectId(args.eventID),
          },
        },
        {
          $lookup: {
            from: 'events',
            localField: 'event',
            foreignField: '_id',
            as: 'event',
          },
        },
        {
          $lookup: {
            from: 'drinktypes',
            localField: 'drinkType',
            foreignField: '_id',
            as: 'drinkType',
          },
        },
        {
          $project: {
            name: 1,
            drinkID: 1,
            drinkType: { $arrayElemAt: ['$drinkType', 0] },
            event: { $arrayElemAt: ['$event', 0] },
            consumedDateList: 1,
          },
        },
      ])

      return result
      // return AvailableDrink.find().populate('drinkType')
      // return await availableDrinkList.map(drink => {
      //   return transformDrink(drink)
      // })
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to add available drink by using existing registeredDrink id
   *
   * @param {string} id id of registeredDrink that the available drink is trying to use.
   * @param {string} eventID id of the event the drink is used
   * @return {AvailableDrink} created AvailableDrink
   */
  addAvailableDrink: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      // check if the passed registered drink exists on the RegisteredDrink table
      const registeredDrink = await RegisteredDrink.findOne({
        _id: args.addAvailableDrinkInput.id,
      })

      // it is error because the method should not allow user to add drink
      // which doesn't exist in the registered drink table
      if (!registeredDrink) {
        throw new Error(
          'Passed id does not exist in the registered drink table.'
        )
      }

      // safety search to check whether the adding available drink exists
      // on available drink table
      const foundAvailableDrink = await AvailableDrink.findOne({
        drinkID: args.addAvailableDrinkInput.id,
        event: mongoose.Types.ObjectId(args.addAvailableDrinkInput.eventID),
      })
      if (foundAvailableDrink) {
        throw new Error('The adding available drink already exists.')
      }

      // check the adding the event that the available drink is registered exits or not
      const event = await Event.findOne({
        _id: args.addAvailableDrinkInput.eventID,
      })

      if (!event) {
        throw new Error('The event the attendee is attending does not exist.')
      }

      const newAvailableDrink = new AvailableDrink({
        name: registeredDrink.name,
        drinkID: registeredDrink.id,
        drinkType: registeredDrink.drinkType,
        event: mongoose.Types.ObjectId(args.addAvailableDrinkInput.eventID),
        consumedDateList: [],
      })

      // return the created available drink
      return newAvailableDrink
        .save()
        .then(newAvailableDrink =>
          newAvailableDrink.populate('event drinkType').execPopulate()
        )
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to update availableDrink date list.
   *
   * @param {string} id id of the available drink that the count is changing
   * @param {string} date date of the available drink is consumed
   * @return {AvailableDrink} returns availableDrink if successful
   */
  updateAvailableDrinkCount: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      const availableDrink = await AvailableDrink.findOne({
        _id: args.updateAvailableDrinkCountInput.id,
      })

      // safety check
      if (!availableDrink) {
        throw new Error("The available drink user chose doesn't exist")
      }

      // add the date to drink
      availableDrink.consumedDateList.push(
        args.updateAvailableDrinkCountInput.date
      )
      const result = await availableDrink.save()

      // it also have to need to add user's drink list

      return availableDrink
        .save()
        .then(availableDrink =>
          availableDrink.populate('event drinkType').execPopulate()
        )
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  updateAvailableDrinkList: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      await asyncForEach(
        args.updateAvailableDrinkListInput.compositeDrinkList,
        async compositeDrink => {
          // check if the passed registered drink exists on the RegisteredDrink table
          const registeredDrink = await RegisteredDrink.findOne({
            _id: compositeDrink.drinkID,
          })

          // it is error because the method should not allow user to add drink
          // which doesn't exist in the registered drink table
          if (!registeredDrink) {
            throw new Error(
              'Passed id does not exist in the registered drink table.'
            )
          }

          // mongoose.Types.ObjectId() is optional for using query with mongoose
          const availableDrink = await AvailableDrink.findOne({
            drinkID: compositeDrink.drinkID,
            event: mongoose.Types.ObjectId(
              args.updateAvailableDrinkListInput.eventID
            ),
          })

          if (compositeDrink.included && !availableDrink) {
            const newAvailableDrink = new AvailableDrink({
              name: registeredDrink.name,
              drinkID: registeredDrink.id,
              drinkType: registeredDrink.drinkType,
              event: args.updateAvailableDrinkListInput.eventID,
              consumedDateList: [],
            })
            await newAvailableDrink.save()
          } else if (!compositeDrink.included && availableDrink) {
            await AvailableDrink.deleteOne({
              drinkID: compositeDrink.drinkID,
              event: args.updateAvailableDrinkListInput.eventID,
            })
          }
        }
      )

      return true
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to remove availableDrink.
   *
   * @param {string} id id of the removing available drink
   * @return {boolean} returns true if deletion is successful,
   * otherwise returns false
   */
  deleteAvailableDrink: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      const availableDrinkFound = await findAvailableDrinkHelper(args.id)
      if (!availableDrinkFound) {
        return false
      }

      await AvailableDrink.deleteOne({
        _id: args.id,
      })
      return true
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to remove all availableDrinks.
   *
   * @return {boolean} returns true if deletion is successful,
   * otherwise returns false
   */
  deleteAvailableDrinks: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      await AvailableDrink.deleteMany(
        { event: mongoose.Types.ObjectId(args.eventID) },
        function(err, data) {
          if (err) {
            throw new Error('Deleting all available drinks has some issues.')
            return false
          }
        }
      )
      return true
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
