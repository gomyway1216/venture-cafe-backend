const AvailableDrink = require('../../../models/drinkSchemas/availableDrink')
const RegisteredDrink = require('../../../models/drinkSchemas/registeredDrink')
// const { transformDrink } = require('../merge')
const { findAvailableDrinkHelper } = require('../helper/helper')

module.exports = {
  /**
   * Endpoint to check the existence of available drink by id
   *
   * @param {string} id id of the searching available drink
   * @return {boolean} returns true if the searching available drink is found,
   * otherwise returns false
   */
  existAvailableDrink: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      const availableDrinkFound = await findAvailableDrinkHelper(args.id)
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
   * @return {AvailableDrink|null} returns available drink object if found,
   * otherwise returns null
   */
  getAvailableDrink: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      const availableDrink = await AvailableDrink.findOne({
        _id: args.id,
      }).populate('drinkType')

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
   * Endpoint to return all available drinks.
   *
   * @return {Array<AvailableDrink>} all available Drinks
   */
  getAvailableDrinkList: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      return AvailableDrink.find()
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
   * @param {string} id id of registeredDrink that the available drink is trying to use.
   * @return {AvailableDrink} created AvailableDrink
   */
  addAvailableDrink: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      // check if the passed registered drink exists on the RegisteredDrink table
      const registeredDrink = await RegisteredDrink.findOne({
        _id: args.id,
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
        drinkID: args.id,
      })
      if (foundAvailableDrink) {
        throw new Error('The adding available drink already exists.')
      }

      const newAvailableDrink = new AvailableDrink({
        name: registeredDrink.name,
        drinkID: registeredDrink.id,
        drinkType: registeredDrink.drinkType,
        consumedDateList: [],
      })

      // return the created available drink
      return newAvailableDrink
        .save()
        .then(newAvailableDrink =>
          newAvailableDrink.populate('drinkType').execPopulate()
        )
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to update availableDrink date list.
   *
   * @param {string} id id of the available drink that the count is changing
   * @param {string} date date of the available drink is consumed
   * @return {AvailableDrink} returns availableDrink if successful
   */
  updateAvailableDrinkCount: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      const availableDrink = await AvailableDrink.findOne({
        _id: args.updateAvailableDrinkCountInput.id,
      })

      // safety check
      if (!availableDrink) {
        throw new Error("The available drink user chose doesn't exist")
      }

      // add the date to drink
      availableDrink.consumedDateList.push(
        args.updateAvailableDrinkCountInput.date
      )
      const result = await availableDrink.save()

      // it also have to need to add user's drink list

      return availableDrink
        .save()
        .then(availableDrink =>
          availableDrink.populate('drinkType').execPopulate()
        )
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
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      const availableDrinkFound = await findAvailableDrinkHelper(args.id)
      if (!availableDrinkFound) {
        return false
      }

      await AvailableDrink.deleteOne({
        _id: args.id,
      })
      return true
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to remove all availableDrinks.
   *
   * @return {boolean} returns true if deletion is successful,
   * otherwise returns false
   */
  deleteAvailableDrinks: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      await AvailableDrink.deleteMany({}, function(err, data) {
        if (err) {
          throw new Error('Deleting all available drinks has some issues.')
          return false
        }
      })
      return true
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
