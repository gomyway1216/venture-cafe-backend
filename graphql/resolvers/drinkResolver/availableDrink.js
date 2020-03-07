const AvailableDrink = require('../../../models/drinkSchemas/availableDrink')
const RegisteredDrink = require('../../../models/drinkSchemas/registeredDrink')
// const { transformDrink } = require('../merge')
const { findAvailableDrinkHelper } = require('../helper/helper')

module.exports = {
  /**
   * Endpoint to return all available drinks.
   *
   * @return {Array<AvailableDrink>} all available Drinks
   */
  getAvailableDrinkList: async () => {
    try {
      const availableDrinkList = await AvailableDrink.find()
      return availableDrinkList
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
   * @param {string} id id of registeredDrink.
   * @return {AvailableDrink} created AvailableDrink
   */
  addAvailableDrink: async (args, req) => {
    try {
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
        drinkId: args.addAvailableDrinkInput.id,
      })
      if (foundAvailableDrink) {
        throw new Error('The adding drink already exists.')
      }

      const newAvailableDrink = new AvailableDrink({
        name: registeredDrink.name,
        drinkId: registeredDrink.id,
        drinkType: registeredDrink.drinkType,
        consumedDateList: [],
      })

      const result = await newAvailableDrink.save()

      // return the created drink
      return result
      // return transformDrink(result)
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to check the existence available drink by id
   *
   * @param {string} id id of the searching available drink
   * @return {boolean} returns true if the searching available drink is found,
   * otherwise returns false
   */
  existAvailableDrink: async (args, req) => {
    try {
      const availableDrinkFound = await findAvailableDrinkHelper(
        args.existAvailableDrinkInput.id
      )
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
   * @return {AvailableDrink} returns available drink object if found,
   * otherwise returns null
   */
  getAvailableDrink: async (args, req) => {
    try {
      const availableDrink = await AvailableDrink.findOne({
        _id: args.getAvailableDrinkInput.id,
      })

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
   * Endpoint to remove availableDrink.
   *
   * @param {string} id id of the removing available drink
   * @return {boolean} returns true if deletion is successful,
   * otherwise returns false
   */
  deleteAvailableDrink: async (args, req) => {
    try {
      const availableDrinkFound = await findAvailableDrinkHelper(
        args.deleteAvailableDrinkInput.id
      )
      if (!availableDrinkFound) {
        return false
      }

      await AvailableDrink.deleteOne({
        _id: args.deleteAvailableDrinkInput.id,
      })
      return true
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
