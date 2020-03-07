const AvailableDrink = require('../../../models/drinkSchemas/availableDrink')
const RegisteredDrink = require('../../../models/drinkSchemas/registeredDrink')
const { transformDrink } = require('../merge')

module.exports = {
  /**
   * Endpoint to return all available drinks.
   *
   * @return {Array<AvailableDrink>} all available Drinks
   */
  availableDrinkList: async () => {
    try {
      const availableDrinkList = await AvailableDrink.find()

      return await availableDrinkList.map(drink => {
        return transformDrink(drink)
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to add available drink by using existing registeredDrink id
   *
   * @param {String} id id of registeredDrink.
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

      const availableDrink = new AvailableDrink({
        name: registeredDrink.name,
        drinkId: registeredDrink.id,
        drinkType: registeredDrink.drinkType,
        consumedDateList: [],
      })

      const result = await availableDrink.save()

      // return the created drink
      return transformDrink(result)
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to remove availableDrink.
   *
   * @param {String} id id of the removing available drink
   * @return {AvailableDrink} deleted AvailableDrink
   */
  deleteAvailableDrink: async (args, req) => {
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
