const AvailableDrink = require('../../../models/drinkSchemas/availableDrink')
const RegisteredDrink = require('../../../models/drinkSchemas/registeredDrink')

  /**
   * Helper function to find availableDrink.
   *
   * @param {string} id id of the finding available drink
   * @return {boolean} true if the searched available drink is found
   */
  const findAvailableDrinkHelper = async id => {
    try {
      const availableDrink = await AvailableDrink.findOne({
        _id: id,
      })
    
      if (availableDrink) {
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
   * Helper function to find registeredDrink.
   *
   * @param {string} id id of the finding registered drink
   * @return {boolean} true if the searched registered drink is found
   */
  const findRegisteredDrinkHelper = async id => {
    try {
      const registeredDrink = await RegisteredDrink.findOne({
        _id: id,
      })
    
      if (registeredDrink) {
        return true
      } else {
        return false
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  exports.findAvailableDrinkHelper = findAvailableDrinkHelper
  exports.findRegisteredDrinkHelper = findRegisteredDrinkHelper

