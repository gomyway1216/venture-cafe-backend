const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

type Event {
  _id: ID!
  title: String!
  description: String!
  price: Float!
  date: String!
  creator: User!
}

type User {
  _id: ID!
  email: String!
  password: String
  createdEvents: [Event!]
}

type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}

type Attendee {
  _id: ID!
  userId: String!
  name: String!
  drinkCounter: Int!
  date: String!
  drinks: [Drink!]!
}

type DrinkType {
  _id: ID!
  name: String!
}

type Drink {
  _id: ID!
  name: String!
  drinkTypeId: ID!
}

input AddDrinkTypeInput {
  name: String!
}

input AddDrinkInput {
  name: String!
  drinkTypeId: ID!
}

input DrinkCounterUpdateInput {
  userId: String!
  drinkCounter: Int!
  drinkId: ID!
}

input AttendeeInput {
  userId: String!
  name: String!
  drinkCounter: Int!
  date: String!
}

input EventInput {
  title: String!
  description: String!
  price: Float!
  date: String!
}

input UserInput {
  email: String!
  password: String!
}

type RootQuery {
    events: [Event!]!
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthData!
    attendees: [Attendee!]!
    drinkTypes: [DrinkType!]!
    drinks: [Drink!]!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
    checkInAttendee(attendeeInput: AttendeeInput): Attendee
    updateDrinkCounter(drinkCounterUpdateInput: DrinkCounterUpdateInput): Attendee
    addDrinkType(addDrinkTypeInput: AddDrinkTypeInput): DrinkType
    addDrink(addDrinkInput: AddDrinkInput): Drink
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
