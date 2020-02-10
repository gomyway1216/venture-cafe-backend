const DailyDrinks = require('../../models/dailyDrinks')
const CurrentDrink = require('../../models/currentDrink')
const CurrentAttendee = require('../../models/currentAttendee')

module.exports = {
  saveAllCurrentDrinks: async (args, req) => {
    try {
      // frontend will send the list of currentDrinks
      const currentDrinks = await CurrentDrink.find()
      // date of the event
      const drinkGroupDate = args.date
      const drinkAndDate = []
      currentDrinks.map(currentDrink => {
        console.log('currentDrinks.drinkId', currentDrink.drinkId)
        // currentDrinks.count.map()
        currentDrink.count.map(drinkDate => {
          drinkAndDate.push({
            drink: currentDrink.drinkId,
            date: drinkDate,
          })
        })
      })

      console.log('drinkAndDate', drinkAndDate)

      const comparingDate = new Date(drinkGroupDate)
      const dailyDrinksList = await DailyDrinks.find()
      let foundDate
      for (let i = 0; i < dailyDrinksList.length; i++) {
        const currentDate = dailyDrinksList[i].date
        if (
          currentDate.getFullYear() === comparingDate.getFullYear() &&
          currentDate.getMonth() === comparingDate.getMonth() &&
          currentDate.getDate() === currentDate.getDate()
        ) {
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
          date: comparingDate,
          drinks: drinkAndDate,
        })
        await dailyDrinks.save()
        console.log('this is daily drinks', dailyDrinks)
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
}
