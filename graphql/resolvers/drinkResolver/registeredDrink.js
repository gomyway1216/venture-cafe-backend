const RegisteredDrink = require('../../../models/drinkSchemas/registeredDrink')
const DrinkType = require('../../../models/drinkSchemas/drinkType')
const { transformDrink } = require('../merge')
const { findRegisteredDrinkHelper } = require('../helper/helper')

module.exports = {
  /**
   * Endpoint to return all registered drinks.
   *
   * @return {Array<RegisteredDrink>} all registered Drinks
   */
  getRegisteredDrinkList: async () => {
    try {
      const registeredDrinkList = await RegisteredDrink.find()
      return registeredDrinkList
      // return await registeredDrinkList.map(drink => transformDrink(drink))
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to add registeredDrink.
   *
   * @param {string} name name of the registering drink
   * @param {string} drinkTypeId id of the drink type of the registering drink
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
      // drinkType.registeredDrinkList.push(newRegisteredDrink)
      // await drinkType.save()

      // return the created drink
      return result
      // return transformDrink(result)
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to check the existence registered drink by id
   *
   * @param {string} id id of the searching registered drink
   * @return {boolean} returns true if the searching registered drink is found,
   * otherwise returns false
   */
  existRegisteredDrink: async (args, req) => {
    try {
      const registeredDrinkFound = await findRegisteredDrinkHelper(
        args.existRegisteredDrinkInput.id
      )
      if (registeredDrinkFound) {
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
   * Endpoint to return registered drink with passed id
   *
   * @param {string} id id of the searching registered drink
   * @return {RegisteredDrink} returns registered drink object if found,
   * otherwise returns null
   */
  getRegisteredDrink: async (args, req) => {
    try {
      const registeredDrink = await RegisteredDrink.findOne({
        _id: args.getRegisteredDrinkInput.id,
      })

      // if available drink is not found, return null explicitly
      if (!registeredDrink) {
        return null
      }
      return registeredDrink
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to remove registeredDrink.
   *
   * @param {string} id id of the removing registered drink
   * @return {boolean} returns true if deletion is successful,
   * otherwise returns false
   */
  deleteAvailableDrink: async (args, req) => {
    try {
      const registeredDrinkFound = await findRegisteredDrinkHelper(
        args.deleteRegisteredDrinkInput.id
      )
      if (!registeredDrinkFound) {
        return false
      }

      await RegisteredDrink.deleteOne({
        _id: args.deleteRegisteredDrinkInput.id,
      })
      return true
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
