const Drink = require('../../models/drink')
const DrinkType = require('../../models/drinkType')
const User = require('../../models/user')
const { transformDrink } = require('./merge')

module.exports = {
  drinks: async () => {
    try {
      const drinks = await Drink.find()

      return await drinks.map(drink => {
        return transformDrink(drink)
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  // drinksByType: async () => {
  //   try {
  //     const drinkTypes = await DrinkType.find()
  //       const drinks = await Drink.find()
  //       const updatedDrinks = await drinks.map(drink => transformDrink(drink))

  //   } catch (err) {
  //     console.log(err)
  //     throw err
  //   }
  // },

  addDrink: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!')
    }

    const drink = new Drink({
      name: args.addDrinkInput.name,
      drinkType: args.addDrinkInput.drinkTypeId,
    })

    let createdDrink
    try {
      const result = await drink.save()
      createdDrink = transformDrink(result)
      const drinkType = await DrinkType.findById(args.addDrinkInput.drinkTypeId)
      if (!drinkType) {
        throw new Error('DrinkType not found.')
      }
      drinkType.createdDrinks.push(drink)
      await drinkType.save()

      return createdDrink
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  deleteDrink: async (args, req) => {
    try {
      const deletingDrink = await Drink.findOne({ _id: args.id })
      await Drink.deleteOne({ _id: args.id })
      return deletingDrink
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  users: async (args, req) => {
    try {
      const allUsers = await User.find()
      return allUsers
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
