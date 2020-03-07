const DrinkType = require('../../models/drinkSchemas/drinkType')

module.exports = {
  drinkTypes: async () => {
    try {
      const drinkTypes = await DrinkType.find()
        .populate('createdDrinks')
        .exec()
      return drinkTypes
    } catch (err) {
      throw err
    }
  },

  addDrinkType: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!')
    }

    const drinkType = new DrinkType({
      name: args.addDrinkTypeInput.name,
    })

    let createdDrinkType
    try {
      const result = await drinkType.save()
      createdDrinkType = transformDrinkType(result)
      return await createdDrinkType
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
