const DataLoader = require('dataloader')
const DrinkType = require('../../models/drinkSchemas/drinkType')
const Drink = require('../../models/drink')

const drinkTypeLoader = new DataLoader(drinkTypeIds => {
  return DrinkType.find({ _id: { $in: drinkTypeIds } })
})

const drinkLoader = new DataLoader(drinkIds => {
  return drinks(drinkIds)
})

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

// since _id returns object and id is string,
// _id: attendee.id is to make _id to use string
const transformAttendee = attendee => {
  return {
    ...attendee._doc,
    _id: attendee.id,
  }
}

// I guess it won't matter whether drink._doc.drinkType or drink.drinkType
const transformDrink = drink => {
  return {
    ...drink._doc,
    _id: drink.id,
    drinkType: drinkType.bind(this, drink.drinkType),
  }
}

const transformDailyDrinks = dailyDrinks => {
  return {
    ...dailyDrinks._doc,
    _id: dailyDrinks.id,
  }
}

exports.transformAttendee = transformAttendee
exports.transformDrink = transformDrink
exports.transformDailyDrinks = transformDailyDrinks
