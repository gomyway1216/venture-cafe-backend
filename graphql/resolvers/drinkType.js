const DrinkType = require('../../models/drinkType')

module.exports = {
  drinkTypes: async () => {
    try {
      const drinkTypes = await DrinkType.find()
        .populate('createdDrinks')
        .exec()
      //   return drinkTypes.map(drinkType => {
      //     return transformDrinkType(drinkType)
      //   })
      // console.log(drinkTypes)
      return drinkTypes
    } catch (err) {
      throw err
    }
  },

  addDrinkType: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error('Unauthenticated!')
    // }

    const drinkType = new DrinkType({
      name: args.addDrinkTypeInput.name,
    })

    let createdDrinkType
    try {
      const result = await drinkType.save()
      createdDrinkType = transformDrinkType(result)
      return createdDrinkType
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
