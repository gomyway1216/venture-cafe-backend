const RegisteredDrink = require('../../../models/drinkSchemas/registeredDrink')
const AvailableDrink = require('../../../models/drinkSchemas/availableDrink')
const Event = require('../../../models/eventSchemas/event')
const DrinkHistory = require('../../../models/drinkSchemas/drinkHistory')
const mongoose = require('mongoose')

module.exports = {
  /**
   * Endpoint to add registeredDrink. This method has a bug.
   *
   * @return {Array<DrinkHistory>} returns true for success in insertion, otherwise, throw error
   */
  getDrinkHistoryList: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      const result = await DrinkHistory.aggregate([
        {
          $lookup: {
            from: 'registereddrinks',
            localField: 'registeredDrink',
            foreignField: '_id',
            as: 'registeredDrink',
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
          $project: {
            date: 1,
            registeredDrink: { $arrayElemAt: ['$registeredDrink', 0] },
            event: { $arrayElemAt: ['$event', 0] },
          },
        },
      ])

      return result
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to add registeredDrink.
   *
   * @param {string} eventID eventID of the saving list
   * @return {boolean} returns true for success in insertion, otherwise, throw error
   */
  addDrinkHistoryList: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      // traverse through the available drinks
      // eahc drink has date list
      let drinkHistoryList = []
      const availableDrinkList = await AvailableDrink.find()

      availableDrinkList.map(availableDrink => {
        availableDrink.consumedDateList.map(drinkDate => {
          drinkHistoryList.push({
            date: drinkDate,
            registeredDrink: mongoose.Types.ObjectId(availableDrink.drinkID),
            event: mongoose.Types.ObjectId(args.eventID),
          })
        })
      })

      DrinkHistory.collection.insert(drinkHistoryList, function(err, docs) {
        if (err) {
          throw new Error(
            `Having error inserting documents into DrinkHistory table ${err}`
          )
        } else {
          console.log('Insertion into DrinkHistory table is successful')
        }
      })
      return true
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
