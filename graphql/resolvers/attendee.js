const Attendee = require('../../models/attendee')
const CurrentAttendee = require('../../models/currentAttendee')
const Drink = require('../../models/drink')
const CurrentDrink = require('../../models/currentDrink')

const { transformAttendee } = require('./merge')

module.exports = {
  attendees: async () => {
    try {
      const attendees = await Attendee.find()
      // Not sure whether I need to transform
      return await attendees.map(attendee => {
        // console.log(attendee)
        return transformAttendee(attendee)
      })
      // return attendees;
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  currentAttendees: async () => {
    try {
      const attendees = await CurrentAttendee.find()
        .populate('drinks')
        .exec()

      // for (let i = 0; i < attendees.length; i++) {
      //   console.log('attendees', attendees[i].drinks)
      // }

      return await attendees.map(attendee => {
        // console.log(attendee)
        return transformAttendee(attendee)
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  // // create ne Attendee
  // checkInAttendee: async (args, req) => {
  //   // I may uncomment this out later.
  //   if (!req.isAuth) {
  //     throw new Error('Unauthenticated!')
  //   }

  //   const attendee = new Attendee({
  //     userId: args.attendeeInput.userId,
  //     name: args.attendeeInput.name,
  //     drinkCounter: +args.attendeeInput.drinkCounter,
  //     date: new Date(args.attendeeInput.date),
  //   })

  //   let createdAttendee
  //   try {
  //     // console.log('newAttendee', attendee)
  //     const result = await attendee.save()
  //     createdAttendee = transformAttendee(result)
  //     return createdAttendee
  //   } catch (err) {
  //     console.log(err)
  //     throw err
  //   }
  // },

  //drinkCounterUpdateInput
  // updateDrinkCounter: async (args, req) => {
  //   try {
  //     // const attendee = await Attendee.findOneAndUpdate(
  //     //   { userId: args.drinkCounterUpdateInput.userId },
  //     //   { drinkCounter: args.drinkCounterUpdateInput.drinkCounter },
  //     //   { new: true }
  //     // )
  //     const attendee = await Attendee.findOne({
  //       userId: args.drinkCounterUpdateInput.userId,
  //     })
  //     // console.log('attendee', attendee)
  //     // console.log(args.drinkCounterUpdateInput.drinkCounter)
  //     attendee.drinkCounter = args.drinkCounterUpdateInput.drinkCounter
  //     const drink = await Drink.findOne({
  //       _id: args.drinkCounterUpdateInput.drinkId,
  //     })
  //     // push the drink to the attendee's drink list
  //     attendee.drinks.push(drink)

  //     // update the drink
  //     // const drinkCount = {
  //     //   createdAt: new Date(args.drinkCounterUpdateInput.date),
  //     //   user: attendee.id,
  //     // }
  //     drink.count.push(new Date(args.drinkCounterUpdateInput.date))

  //     return attendee
  //   } catch (err) {
  //     console.log(err)
  //     throw err
  //   }
  // },

  updateAttendeeDrinks: async (args, req) => {
    try {
      // console.log('updateAttendeeDrinks is called!')
      // console.log('current attendeeId', args.updateAttendeeDrinksInput._id)
      const currentAttendee = await CurrentAttendee.findOne({
        attendeeId: args.updateAttendeeDrinksInput._id,
      })
        .populate('drinks')
        .exec()

      // console.log('drinkId', args.updateAttendeeDrinksInput.drinkId)
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

      // console.log('this is drink', drink)
      // console.log('this is currentDrink', currentDrink)
      currentAttendee.drinks.push(drink)
      currentDrink.count.push(new Date(args.updateAttendeeDrinksInput.date))

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

  signUpAttendee: async (args, req) => {
    // I may uncomment this out later.
    // if (!req.isAuth) {
    //   throw new Error('Unauthenticated!')
    // }

    // const attendee = new Attendee({
    //   userId: args.attendeeInput.userId,
    //   name: args.attendeeInput.name,
    //   drinkCounter: +args.attendeeInput.drinkCounter,
    //   date: new Date(args.attendeeInput.date),
    // })

    const attendee = new Attendee({
      firstName: args.signUpAttendeeInput.firstName,
      lastName: args.signUpAttendeeInput.lastName,
      email: args.signUpAttendeeInput.email,
      signUpDate: new Date(args.signUpAttendeeInput.date),
    })
    // it is skipping lastSignInDate for now

    let createdAttendee
    try {
      // console.log('newAttendee', attendee)
      const result = await attendee.save()
      createdAttendee = await transformAttendee(result)
      return createdAttendee
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  // alter the frontend to access to this method and display currentAttendee
  // instead of showing all the users.
  signInAttendee: async (args, req) => {
    try {
      // to prevent creating two same users -> it was happening
      console.log('before finding tempCurrentAttendee')
      const tempCurrentAttendee = await CurrentAttendee.findOne({
        attendeeId: args.signInAttendeeInput._id,
      })

      console.log('tempCurrentAttendee', tempCurrentAttendee)
      if (tempCurrentAttendee) {
        console.log('the attendee already existed!')
        const tempCreatedAttendee = await transformAttendee(tempCurrentAttendee)
        return tempCreatedAttendee
      }

      const attendee = await Attendee.findById(args.signInAttendeeInput._id)
      // console.log('have we find the id?', attendee)
      if (!attendee) {
        throw err
      }

      // it is possible that a user is created and existed in Attendee table,
      // and the user is also in the currentAttendee table, but somehow,
      // the frontend query the attendee. If so, instead of creating the new currentAttendee,
      // search the currentAttendee table and return the the found currentAttendee
      let currentAttendee = await CurrentAttendee.findOne({
        attendeeId: args.signInAttendeeInput._id,
      })

      if (!currentAttendee) {
        currentAttendee = new CurrentAttendee({
          attendeeId: attendee.id,
          firstName: attendee.firstName,
          lastName: attendee.lastName,
          lastSignInDate: new Date(args.signInAttendeeInput.date),
        })
      }

      // instead of creating a new user like this, I need to search the attendee table

      // console.log('attendee id', attendee.id)
      // console.log('current attendee id', currentAttendee.id)

      // console.log('currentAttendee', currentAttendee)
      const result = await currentAttendee.save()
      // console.log(result)
      // return the already existing user (this contains more information)
      const createdAttendee = await transformAttendee(result)
      // console.log('this is createdAttendee', createdAttendee)
      return createdAttendee
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  uploadCurrentTransactions: async (args, req) => {
    try {
      console.log('uploadCurrentTransactions is called')
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  resetAttendeeDrinks: async (args, req) => {
    await CurrentAttendee.updateMany({}, { $set: { drinks: [] } })
  },
}
