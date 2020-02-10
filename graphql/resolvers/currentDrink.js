const CurrentDrink = require('../../models/currentDrink')
const { transformDrink } = require('./merge')

module.exports = {
  currentDrinks: async () => {
    try {
      const currentDrinks = await CurrentDrink.find()

      return await currentDrinks.map(drink => {
        // console.log('currentDrinks', drink)
        return transformDrink(drink)
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  deleteAllCurrentDrinks: async (args, req) => {
    try {
      await CurrentDrink.updateMany({}, { $set: { count: [] } }, async function(
        err,
        data
      ) {
        if (!err) {
          console.log('modification is successful')
        }
      })
      return true
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
