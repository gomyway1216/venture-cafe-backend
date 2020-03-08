const RegisteredDrink = require('../../../models/drinkSchemas/registeredDrink')
const AvailableDrink = require('../../../models/drinkSchemas/availableDrink')
const Event = require('../../../models/eventSchemas/event')
const DrinkHistory = require('../../../models/drinkSchemas/drinkHistory')

module.exports = {
  // getDrinkHistoryList: () => {
  //   const result = await DrinkHistory.aggregate(
  //     [
  //       {
  //         "$lookup": {
  //           "from": "RegisteredDrink",
  //           "localField": "id",
  //           "foreignField"
  //         }
  //       }
  //     ]
  //   )
  // }

  addDrinkHistory: () => {
    try {
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
