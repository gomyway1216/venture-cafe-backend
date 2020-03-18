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
  event: Event!
  consumedDateList: [String!]!
}

type DrinkHistory {
  _id: ID!
  date: String!
  registeredDrink: RegisteredDrink!
  event: Event!
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
  password: String
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
  event: Event!
  drinkList: [AvailableDrink!]!
}


input AddRegisteredDrinkInput {
  name: String!
  drinkTypeID: String!
}

input AddAvailableDrinkInput {
  id: ID!
  eventID: ID!
}

input UpdateAvailableDrinkCountInput {
  id: ID!
  date: String!
}

input AddEventInput {
  name: String!
  eventTypeID: ID!
  date: String!
  location: String!
}

input CreateAdminUserInput {
  firstName: String!
  lastName: String!
  email: String!
  password: String!
  date: String!
  adminCreateKey: String!
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
  eventID: ID!
}

input UpdateAttendeeDrinkListInput {
  id: ID!
  availableDrinkID: ID!
  date: String!
}


type RootQuery {
    existDrinkType(id: ID!): Boolean!
    getDrinkType(id: ID!): DrinkType
    getDrinkTypeList: [DrinkType!]!

    existRegisteredDrink(id: ID!): Boolean!
    getRegisteredDrink(id: ID!): RegisteredDrink
    getRegisteredDrinkList: [RegisteredDrink!]!

    existAvailableDrink(id: ID!): Boolean!
    getAvailableDrink(id: ID!): AvailableDrink
    getAvailableDrinkList(eventID: ID!): [AvailableDrink!]!

    getDrinkHistoryList: [DrinkHistory!]!

    existEventType(id: ID!): Boolean!
    getEventType(id: ID!): EventType
    getEventTypeList: [EventType!]!

    existEvent(id: ID!): Boolean!
    getEvent(id: ID!): Event
    getEventList: [Event!]!


    existUser(id: ID!): Boolean!
    getUser(id: ID!): User

    existAttendee(id: ID!): Boolean!
    getAttendee(id: ID!): Attendee
    getAttendeeList: [Attendee!]!
}

type RootMutation {
  addDrinkType(name: String!): DrinkType!
  deleteDrinkType(id: ID!): Boolean!

  addRegisteredDrink(addRegisteredDrinkInput: AddRegisteredDrinkInput): RegisteredDrink!
  deleteRegisteredDrink(id: ID!): Boolean!

  addAvailableDrink(addAvailableDrinkInput: AddAvailableDrinkInput): AvailableDrink!
  deleteAvailableDrink(id: ID!): Boolean!
  updateAvailableDrinkCount(updateAvailableDrinkCountInput: UpdateAvailableDrinkCountInput!): AvailableDrink
  deleteAvailableDrinks: Boolean!

  addDrinkHistoryList(eventID: ID!): Boolean!


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
