const CurrentAttendee = require('../../models/currentAttendee')
const Drink = require('../../models/drink')
const CurrentDrink = require('../../models/currentDrink')
const { transformAttendee } = require('./merge')
const moment = require('moment')

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

      // console.log('this is drink', drink)
      // It is attending the current attendee instead of currentAttendee
      // CurrentAttendee is just the temporary and the value would be merged
      // into Attendee once the client side confirms it.
      // this should happen when the front-end code choose to push all the data
      // drink.count.push(new Date(args.updateAttendeeDrinksInput.date))

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
        // console.log('is if statement called?', currentDrink)
      }

      currentAttendee.drinks.push(drink)

      // console.log('this is the date', args.updateAttendeeDrinksInput.date)
      // const tempDate = new Date(args.updateAttendeeDrinksInput.date)
      // console.log('this is the date object', tempDate)
      // console.log('this is the date object', tempDate.toString())
      // console.log('date: ', tempDate.getDate())
      // console.log('hours: ', tempDate.getHours())
      // console.log(moment(args.updateAttendeeDrinksInput.date))

      currentDrink.count.push(args.updateAttendeeDrinksInput.date)

      // CurrentAttendee.updateOne(
      //   { attendeeId: args.updateAttendeeDrinksInput._id },
      //   { $set: { drinks: currentAttendee.drinks } }
      // )
      const result = await currentAttendee.save()
      await currentDrink.save()

      // console.log('this is currentDrink', currentDrink)
      // await drink.save()

      // console.log('currentAttendee.drinks', currentAttendee.drinks)

      const currentAttendee2 = await CurrentAttendee.findOne({
        attendeeId: args.updateAttendeeDrinksInput._id,
      })

      // console.log('currentAttendee is updated? ', currentAttendee2)

      // Drink.updateOne(
      //   { _id: args.updateAttendeeDrinksInput.drinkId },
      //   { $set: { count: drink.count } }
      // )
      // console.log('this is result', result)
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
