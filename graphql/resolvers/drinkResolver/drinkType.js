const DrinkType = require('../../../models/drinkSchemas/drinkType')
const { findDrinkTypeHelper } = require('../helper/helper')

module.exports = {
  /**
   * Endpoint to check the existence of drink type by id
   *
   * @param {string} id id of the searching drink type
   * @return {boolean} returns true if the searching drink type is found,
   * otherwise returns false
   */
  existDrinkType: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      const drinkTypeFound = await findDrinkTypeHelper(args.id)
      if (drinkTypeFound) {
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
   * Endpoint to return drink type with passed id
   *
   * @param {string} id id of the searching drink type
   * @return {DrinkType|null} returns drink type object if found,
   * otherwise returns null
   */
  getDrinkType: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      const drinkType = await DrinkType.findOne({
        _id: args.id,
      })

      if (!drinkType) {
        return null
      }

      return drinkType
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to return all available drink types.
   *
   * @return {Array<DrinkType>} all available drink types.
   */
  getDrinkTypeList: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      return DrinkType.find()
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to add drink type.
   *
   * @param {string} name name of the registering drink type
   * @return {DrinkType} created DrinkType
   */
  addDrinkType: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      // check if the adding drink type already exists in drink type table
      const foundDrinkType = await DrinkType.findOne({
        name: args.name,
      })

      if (foundDrinkType) {
        throw new Error('Adding drink type already exists on table.')
      }

      const newDrinkType = new DrinkType({
        name: args.name,
      })

      return newDrinkType.save()
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to remove drink type.
   *
   * @param {string} id id of the removing drink type
   * @return {boolean} returns true if deletion is successful,
   * otherwise returns false
   */
  deleteDrinkType: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      const drinkTypeFound = await findDrinkTypeHelper(args.id)
      if (!drinkTypeFound) {
        return false
      }

      await DrinkType.deleteOne({
        _id: args.id,
      })
      return true
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
