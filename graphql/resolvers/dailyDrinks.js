const DailyDrinks = require('../../models/dailyDrinks')
const CurrentDrink = require('../../models/currentDrink')
const CurrentAttendee = require('../../models/currentAttendee')
const { transformDailyDrinks } = require('./merge')
const moment = require('moment')

module.exports = {
  saveAllCurrentDrinks: async (args, req) => {
    try {
      // frontend will send the list of currentDrinks
      const currentDrinks = await CurrentDrink.find()
      // date of the event
      const drinkGroupDate = args.date
      const drinkAndDate = []
      currentDrinks.map(currentDrink => {
        currentDrink.count.map(drinkDate => {
          drinkAndDate.push({
            drink: currentDrink.drinkId,
            date: drinkDate,
          })
        })
      })

      const comparingDate = moment(drinkGroupDate)
      const dailyDrinksList = await DailyDrinks.find()
      let foundDate
      for (let i = 0; i < dailyDrinksList.length; i++) {
        // const currentDate = moment(dailyDrinksList[i].date)
        if (comparingDate.isSame(dailyDrinksList[i].date, 'day')) {
          console.log('drinkGroupDate', drinkGroupDate)
          console.log('dailyDrinksList[i].date', dailyDrinksList[i].date)
          console.log(comparingDate.isSame(dailyDrinksList[i].date, 'day'))
          foundDate = dailyDrinksList[i]
          break
        }
      }

      // if the grouping date already existed, append the days into existing one
      if (foundDate) {
        foundDate.drinks = foundDate.drinks.concat(drinkAndDate)
        await foundDate.save()
      } else {
        const dailyDrinks = new DailyDrinks({
          date: drinkGroupDate,
          drinks: drinkAndDate,
        })
        await dailyDrinks.save()
      }

      // clean up the current drinks after saving all the data
      await CurrentDrink.updateMany({}, { $set: { count: [] } }, async function(
        err,
        data
      ) {
        if (!err) {
          console.log('modification is successful')
        }
      })

      // clean up all the currentAttendee after saving drink data to dailyDrinks table
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

  dailyDrinksList: async (args, req) => {
    try {
      const savedDailyDrinksList = await DailyDrinks.find().populate({
        path: 'drinks.drink',
        model: 'Drink',
        populate: [
          {
            path: 'drinkType',
            model: 'DrinkType',
          },
        ],
      })

      const convertedList = savedDailyDrinksList.map(sds =>
        transformDailyDrinks(sds)
      )

      const resultString = JSON.stringify(convertedList, null, 2)
      return JSON.parse(resultString)
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
