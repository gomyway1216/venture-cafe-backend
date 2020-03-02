const RegisteredDrink = require('../../models/drink')
const DrinkType = require('../../models/drinkType')
const { transformDrink } = require('./merge')

module.exports = {
  /**
   * Endpoint to return all registered drinks.
   *
   * @return {Array<RegisteredDrink>} all registered Drinks
   */
  registeredDrinkList: async () => {
    try {
      const registeredDrinkList = await RegisteredDrink.find()

      return await registeredDrinkList.map(drink => transformDrink(drink))
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to add registeredDrink.
   *
   * @param {String} name name of the registering drink
   * @param {String} drinkTypeId id of the drink type of the registering drink
   * @return {RegisteredDrink} created RegisteredDrink
   */
  addRegisteredDrink: async (args, req) => {
    try {
      const drinkType = await DrinkType.findOne({
        _id: args.addRegisteredDrink.drinkTypeId,
      })
      //safety checking
      if (!drinkType) {
        throw new Error('The specified DrinkType does not exist.')
      }

      // safety checking
      const foundRegisteredDrink = await RegisteredDrink.findOne({
        _id: args.addRegisteredDrink.id,
      })
      if (foundRegisteredDrink) {
        throw new Error('The registering drink already exists.')
      }

      const newRegisteredDrink = new RegisteredDrink({
        name: args.addRegisteredDrink.name,
        drinkType: args.addRegisteredDrink.drinkTypeId,
      })

      // also adds to the registeredDrinkList of drinkType
      const result = await newRegisteredDrink.save()
      drinkType.registeredDrinkList.push(newRegisteredDrink)
      await drinkType.save()

      // return the created drink
      return transformDrink(result)
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  deleteRegisteredDrink: async (args, req) => {
    try {
      const deletingRegisteredDrink = await RegisteredDrink.findOne({
        _id: args.deleteRegisteredDrink.id,
      })
      await RegisteredDrink.deleteOne({ _id: args.deleteRegisteredDrink.id })
      return deletingRegisteredDrink
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
