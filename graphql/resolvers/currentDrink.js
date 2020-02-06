const CurrentDrink = require('../../models/currentDrink')
const { transformDrink } = require('./merge')

module.exports = {
  currentDrinks: async () => {
    try {
      const currentDrinks = await CurrentDrink.find()

      return currentDrinks.map(drink => {
        // console.log('currentDrinks', drink)
        return transformDrink(drink)
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  deleteAllCurrentDrinks: async (args, req) => {
    try {
      // CurrentDrink.deleteMany({}, function(err, data) {
      //   if (!err) {
      //     console.log('Deleting all currentDrinks is successful.')
      //     return true
      //   }
      // })

      // await CurrentDrink.find({}, [
      //   async (err, drinks) => {
      //     if (err) {
      //       console.log('there is err while iterating')
      //     }

      //     drinks.map(async drink => {
      //       // console.log(drink.name)
      //       drink.count = []
      //       await drink.save()
      //     })

      //     // console.log('drinks', drinks)
      //   },
      //   async () => {
      //     const currentDrinks = await CurrentDrink.find()
      //     console.log('currentDrinks', currentDrinks)
      //   },
      // ])

      await CurrentDrink.updateMany({}, { $set: { count: [] } }, async function(
        err,
        data
      ) {
        if (!err) {
          console.log('modification is successful')

          //   // const currentDrinks = await CurrentDrink.find()
          //   // console.log('inside then part', currentDrinks)

          //   result = data.map(async drink => {
          //     // console.log('currentDrinks', drink)
          //     return await transformDrink(drink)
          //   })

          //   return result
        }
      })

      // await setTimeout(() => {
      //   console.log('World!')
      // }, 500)

      // return await result

      // const currentDrinks = await CurrentDrink.find()

      // return currentDrinks.map(drink => {
      //   console.log('currentDrinks', drink)
      //   return transformDrink(drink)
      // })
      return true
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
