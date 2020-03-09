const RegisteredDrink = require('../../../models/drinkSchemas/registeredDrink')
const AvailableDrink = require('../../../models/drinkSchemas/availableDrink')
const Event = require('../../../models/eventSchemas/event')
const DrinkHistory = require('../../../models/drinkSchemas/drinkHistory')

module.exports = {
  /**
   * Endpoint to add registeredDrink. This method has a bug.
   *
   * @return {Array<DrinkHistory>} returns true for success in insertion, otherwise, throw error
   */
  getDrinkHistoryList: async (args, req) => {
    try {
      const result = await DrinkHistory.aggregate([
        {
          $lookup: {
            from: RegisteredDrink.collection.name,
            localField: 'registeredDrink',
            foreignField: '_id',
            as: 'resultRegisteredDrink',
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
      ])

      console.log('result', result)

      const resultString = JSON.stringify(result, null, 2)
      console.log(resultString)
      // return JSON.parse(resultString)

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
      // traverse through the available drinks
      // eahc drink has date list
      const drinkHistoryList = []
      const availableDrinkList = await AvailableDrink.find()
      availableDrinkList.map(availableDrink => {
        availableDrink.consumedDateList.map(drinkDate => [
          drinkHistoryList.push({
            date: drinkDate,
            registeredDrink: availableDrink.drinkID,
            event: args.eventID,
          }),
        ])
      })

      DrinkHistory.collection.insert(drinkHistoryList, function(err, docs) {
        if (err) {
          throw new Error(
            'Having error inserting documents into DrinkHistory table'
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
