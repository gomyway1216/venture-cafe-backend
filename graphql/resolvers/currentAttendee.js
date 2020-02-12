const CurrentAttendee = require('../../models/currentAttendee')
const Drink = require('../../models/drink')
const CurrentDrink = require('../../models/currentDrink')
const { transformAttendee } = require('./merge')

module.exports = {
  updateAttendeeDrinks: async (args, req) => {
    try {
      const currentAttendee = await CurrentAttendee.findOne({
        attendeeId: args.updateAttendeeDrinksInput._id,
      })
        .populate('drinks')
        .exec()

      // find the drink
      const drink = await Drink.findOne({
        _id: args.updateAttendeeDrinksInput.drinkId,
      })

      let currentDrink = await CurrentDrink.findOne({
        drinkId: args.updateAttendeeDrinksInput.drinkId,
      })

      // in the beginning, the drink is not in the table, so add the drink to the table
      if (!currentDrink) {
        currentDrink = new CurrentDrink({
          name: drink.name,
          drinkId: drink.id,
          drinkType: drink.drinkType,
          count: [],
        })
      }

      currentAttendee.drinks.push(drink)
      currentDrink.count.push(args.updateAttendeeDrinksInput.date)

      const result = await currentAttendee.save()
      await currentDrink.save()

      const currentAttendee2 = await CurrentAttendee.findOne({
        attendeeId: args.updateAttendeeDrinksInput._id,
      })

      return await transformAttendee(result)
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  deleteAllCurrentAttendees: async () => {
    try {
      await CurrentAttendee.deleteMany({}, function(err, data) {
        if (!err) {
          console.log('Deleting all currentAttendees is successful.')
          return true
        }
      })
      return true
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
