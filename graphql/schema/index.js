const { buildSchema } = require('graphql')

module.exports = buildSchema(`
type DrinkType {
  _id: ID!
  name: String!
}

type RegisteredDrink {
  _id: ID!
  name: String!
  drinkType: DrinkType!
}

type AvailableDrink {
  _id: ID!
  name: String!
  drinkID: String!
  drinkType: DrinkType!
  consumedDateList: [String!]!
}

type EventType {
  _id: ID!
  name: String!
}

type DrinkAndDate {
  drink: RegisteredDrink!
  date: String!
}

type Event {
  _id: ID!
  name: String!
  eventType: EventType
  date: String
  location: String
  drinkList: [DrinkAndDate!]!
}

type User {
  _id: ID!
  firstName: String!
  lastName: String!
  email: String!
  password: String!
  signUpDate: String!
  lastSignInDate: String
  isAdmin: Boolean!
}

type AuthData {
  userID: ID!
  token: String!
  tokenExpiration: Int!
}

type Attendee {
  _id: ID!
  userID: ID!
  firstName: String!
  lastName: String!
  drinkList: [AvailableDrink!]!
}

input AddRegisteredDrinkInput {
  name: String!
  drinkTypeID: String!
}

input UpdateAvailableDrinkCountInput {
  id: ID!
  date: String!
}

input AddEventInput {
  name: String!
  drinkTypeID: ID!
  date: String!
  location: String!
}

input CreateAdminUserInput {
  firstName: String!
  lastName: String!
  email: String!
  password: String!
  signUpDate: String!
}

input LogInAdminUserInput {
  email: String!
  password: String!
  date: String!
}

input CreateUserInput {
  firstName: String!
  lastName: String!
  email: String!
  date: String!
}

input CheckInUserInput {
  id: ID!
  date: String!
}

input UpdateAttendeeDrinkListInput {
  id: ID!
  drinkID: ID!
  date: String!
}


type RootQuery {
    existDrinkType(id: ID!): Boolean!
    getDrinkType(id: ID!): DrinkType!
    getDrinkTypeList: [DrinkType!]!

    getRegisteredDrinkList: [RegisteredDrink!]!
    existRegisteredDrink: Boolean!
    getRegisteredDrink: RegisteredDrink!

    getAvailableDrinkList: [AvailableDrink!]!
    existAvailableDrink: Boolean!
    getAvailableDrink: AvailableDrink!


    existEventType(id: ID!): Boolean!
    getEventType(id: ID!): EventType!
    getEventTypeList: [EventType!]!

    existEvent(id: ID!): Boolean!
    getEvent(id: ID!): Event!
    getEventList: [Event!]!


    existUser(id: ID!): Boolean!
    getUser(id: ID!): User!

    existAttendee(id: ID!): Boolean!
    getAttendee(id: ID!): Attendee!
    getAttendeeList: [Attendee!]!
}

type RootMutation {
  addDrinkType(name: String!): DrinkType!
  deleteDrinkType(id: ID!): Boolean!

  addRegisteredDrink(addRegisteredDrinkInput: AddRegisteredDrinkInput): RegisteredDrink!
  deleteRegisteredDrink(id: ID!): Boolean!

  addAvailableDrink(id: ID!): AvailableDrink!
  deleteAvailableDrink(id: ID!): Boolean!
  updateAvailableDrinkCount(updateAvailableDrinkCountInput: UpdateAvailableDrinkCountInput!): AvailableDrink


  addEventType(name: String!): EventType!
  deleteEventType(id: ID!): Boolean!

  addEvent(addEventInput: AddEventInput): Event!
  deleteEvent(id: ID!): Boolean!


  createAdminUser(createAdminUserInput: CreateAdminUserInput): User!
  logInAdminUser(logInAdminUserInput: LogInAdminUserInput): AuthData!
  createUser(createUserInput: CreateUserInput): User!
  deleteUser(id: ID!): Boolean!

  checkInUser(checkInUserInput: CheckInUserInput): Attendee
  resetAttendeeDrinkList(id: ID!): Attendee
  updateAttendeeDrinkList(updateAttendeeDrinkListInput: UpdateAttendeeDrinkListInput): Attendee
  deleteAttendee(id: ID!): Boolean!
  deleteAttendees: Boolean
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)
