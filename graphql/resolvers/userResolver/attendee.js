const Attendee = require('../../../models/userSchemas/user')
const CurrentAttendee = require('../../../models/currentAttendee')
const { transformAttendee } = require('../merge')
const moment = require('moment')

module.exports = {
  attendees: async () => {
    try {
      const attendees = await Attendee.find()
      return await attendees.map(attendee => {
        return transformAttendee(attendee)
      })
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

      return await attendees.map(attendee => {
        return transformAttendee(attendee)
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  signUpAttendee: async (args, req) => {
    const attendee = new Attendee({
      firstName: args.signUpAttendeeInput.firstName,
      lastName: args.signUpAttendeeInput.lastName,
      email: args.signUpAttendeeInput.email,
      signUpDate: args.signUpAttendeeInput.date,
    })
    // it is skipping lastSignInDate for now

    let createdAttendee
    try {
      const result = await attendee.save()
      createdAttendee = await transformAttendee(result)
      return createdAttendee
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  signInAttendee: async (args, req) => {
    try {
      // to prevent creating two same users -> it was happening
      const tempCurrentAttendee = await CurrentAttendee.findOne({
        attendeeId: args.signInAttendeeInput._id,
      })

      if (tempCurrentAttendee) {
        const tempCreatedAttendee = await transformAttendee(tempCurrentAttendee)
        return tempCreatedAttendee
      }

      const attendee = await Attendee.findById(args.signInAttendeeInput._id)
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
          lastSignInDate: args.signInAttendeeInput.date,
        })
      }

      const result = await currentAttendee.save()
      const createdAttendee = await transformAttendee(result)
      return createdAttendee
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  resetAttendeeDrinks: async (args, req) => {
    await CurrentAttendee.updateMany({}, { $set: { drinks: [] } })
  },
}
