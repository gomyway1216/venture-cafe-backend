const DataLoader = require('dataloader')

const Event = require('../../models/event')
const User = require('../../models/user')
const Attendee = require('../../models/attendee')
const DrinkType = require('../../models/drinkType')
const Drink = require('../../models/drink')
const { dateToString } = require('../../helpers/date')

const eventLoader = new DataLoader(eventIds => {
  return events(eventIds)
})

const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } })
})

const drinkTypeLoader = new DataLoader(drinkTypeIds => {
  return DrinkType.find({ _id: { $in: drinkTypeIds } })
})

const drinkLoader = new DataLoader(drinkIds => {
  return drinks(drinkIds)
})

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } })
    // why does this need to be sorted?
    events.sort((a, b) => {
      return (
        eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
      )
    })
    return events.map(event => {
      return transformEvent(event)
    })
  } catch (err) {
    throw err
  }
}

const drinks = async drinkIds => {
  try {
    const drinks = await Drink.find({ _id: { $in: drinkIds } })
    return drinks.map(drink => {
      return transformDrink(drink)
    })
  } catch (err) {
    throw err
  }
}

const singleEvent = async eventId => {
  try {
    const event = await eventLoader.load(eventId.toString())
    return event
  } catch (err) {
    throw err
  }
}

const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString())
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
    }
  } catch (err) {
    throw err
  }
}

const drinkType = async drinkTypeId => {
  try {
    const drinkType = await drinkTypeLoader.load(drinkTypeId.toString())
    return {
      ...drinkType._doc,
      _id: drinkType.id,
      createdDrinks: () => drinkLoader.loadMany(drinkType._doc.createdDrinks),
    }
  } catch (err) {
    throw err
  }
}

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator),
  }
}

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  }
}

// since _id returns object and id is string,
// _id: attendee.id is to make _id to use string
const transformAttendee = attendee => {
  return {
    ...attendee._doc,
    _id: attendee.id,
  }
}

// const transformDrinkType = drinkType => {
//   return {
//     ...drinkType._doc,
//     _id: drinkType.id,
//   }
// }

// I guess it won't matter whether drink._doc.drinkType or drink.drinkType
const transformDrink = drink => {
  return {
    ...drink._doc,
    _id: drink.id,
    drinkType: drinkType.bind(this, drink.drinkType),
  }
}

exports.transformEvent = transformEvent
exports.transformBooking = transformBooking
exports.transformAttendee = transformAttendee
// exports.transformDrinkType = transformDrinkType
exports.transformDrink = transformDrink

// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;
