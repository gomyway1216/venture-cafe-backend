const CurrentDrink = require('../../models/currentDrink')
const { transformDrink } = require('./merge')

module.exports = {
  currentDrinks: async () => {
    try {
      const currentDrinks = await CurrentDrink.find()

      return currentDrinks.map(drink => {
        console.log('currentDrinks', drink)
        return transformDrink(drink)
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
