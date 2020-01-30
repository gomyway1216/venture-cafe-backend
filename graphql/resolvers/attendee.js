const Attendee = require('../../models/attendee')
const Drink = require('../../models/drink')

const { transformAttendee } = require('./merge')

module.exports = {
  attendees: async () => {
    try {
      const attendees = await Attendee.find()
      // Not sure whether I need to transform
      return attendees.map(attendee => {
        console.log(attendee)
        return transformAttendee(attendee)
      })
      // return attendees;
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  // create ne Attendee
  checkInAttendee: async (args, req) => {
    // I may uncomment this out later.
    if (!req.isAuth) {
      throw new Error('Unauthenticated!')
    }

    const attendee = new Attendee({
      userId: args.attendeeInput.userId,
      name: args.attendeeInput.name,
      drinkCounter: +args.attendeeInput.drinkCounter,
      date: new Date(args.attendeeInput.date),
    })

    let createdAttendee
    try {
      console.log('newAttendee', attendee)
      const result = await attendee.save()
      createdAttendee = transformAttendee(result)
      return createdAttendee
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  //drinkCounterUpdateInput
  updateDrinkCounter: async (args, req) => {
    try {
      // const attendee = await Attendee.findOneAndUpdate(
      //   { userId: args.drinkCounterUpdateInput.userId },
      //   { drinkCounter: args.drinkCounterUpdateInput.drinkCounter },
      //   { new: true }
      // )
      const attendee = await Attendee.findOne({
        userId: args.drinkCounterUpdateInput.userId,
      })
      console.log('attendee', attendee)
      console.log(args.drinkCounterUpdateInput.drinkCounter)
      attendee.drinkCounter = args.drinkCounterUpdateInput.drinkCounter
      const drink = await Drink.findOne({
        _id: args.drinkCounterUpdateInput.drinkId,
      })
      // push the drink to the attendee's drink list
      attendee.drinks.push(drink)

      // update the drink
      const drinkCount = {
        createdAt: new Date(args.drinkCounterUpdateInput.date),
        user: attendee.id,
      }
      drink.count.push(drinkCount)

      return attendee
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
