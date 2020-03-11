const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')

const graphQlSchema = require('./graphql/schema/index')
const graphQlResolvers = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')
// const Drink = require('./models/drink')
// const CurrentAttendee = require('./models/currentAttendee')
// const CurrentDrink = require('./models/currentDrink')
const DailyDrinks = require('./models/dailyDrinks')
const moment = require('moment')

require('dotenv').config({
  path: `.env`,
})

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use(isAuth)

// app.use("/", (req, res) => res.send("Welcome~!"))

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
)

const PORT = process.env.PORT || 5000

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@venturecafenamelist-bcflp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(PORT)
    console.log('connected to db!')
    // this is one of the example that explains how to modify mongoDB
    // renameFields()
  })
  .catch(err => {
    console.log(err)
  })

// // this the temporary function to modify mongodb schema
// // this is working!
// function renameFields() {
//   console.log('renameFields is called')
//   // for more details, check the mongoDB documentation
//   // https://docs.mongodb.com/manual/reference/operator/update/
//   Drink.updateMany({}, { $set: { count: [] } }, function(err, data) {
//     if (!err) {
//       console.log('modification is successful')
//     }
//   })
// }

// function resetAttendeeDrinks() {
//   CurrentAttendee.updateMany({}, { $set: { drinks: [] } }, function(err, data) {
//     if (!err) {
//       console.log('CurrentAttendee modification is successful')
//     }
//   })
// }

// function deleteAllCurrentDrinks() {
//   CurrentDrink.deleteMany({}, function(err, data) {
//     if (!err) {
//       console.log('Deleting all currentDrinks is successful.')
//     }
//   })
// }
