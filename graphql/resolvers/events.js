const Event = require('../../models/event')
const User = require('../../models/user')

const { transformEvent } = require('./merge')

module.exports = {
  events: async () => {
    try {
      const events = await Event.find()
      // console.log('events', events[0])
      // console.log('event 1', events[0]._doc)
      // console.log('event id', typeof events[0].id)
      // console.log('event _id', typeof events[0]._id)
      // console.log('event _doc._id', events[0]._doc._id)
      // console.log(events[0]._doc == events[0])
      const evs = events.map(event => {
        return transformEvent(event)
      })

      // console.log('eves', evs[0])
      // console.log(events[0] === evs[0])
      return evs
    } catch (err) {
      throw err
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!')
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId,
    })
    let createdEvent
    try {
      const result = await event.save()
      createdEvent = transformEvent(result)
      const creator = await User.findById(req.userId)

      if (!creator) {
        throw new Error('User not found.')
      }
      creator.createdEvents.push(event)
      await creator.save()

      return createdEvent
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
