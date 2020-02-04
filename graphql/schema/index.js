const { buildSchema } = require('graphql')

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
  firstName: String!
  lastName: String!
  email: String!
  signUpDate: String!
  lastSignInDate: String
  drinks: [Drink!]!
}

type CurrentAttendee {
  _id: ID!
  attendeeId: String!
  firstName: String!
  lastName: String!
  email: String!
  signUpDate: String!
  lastSignInDate: String!
  drinks: [Drink!]!
}

type DrinkType {
  _id: ID!
  name: String!
  createdDrinks: [Drink!]!
}

type Count {
  createdAt: String!
  user: Attendee
}

type Drink {
  _id: ID!
  name: String!
  drinkType: DrinkType!
  count: [Count!]!
}

input AddDrinkTypeInput {
  name: String!
}

input AddDrinkInput {
  name: String!
  drinkTypeId: String!
}

input DrinkCounterUpdateInput {
  userId: String!
  drinkCounter: Int!
  drinkId: ID!
  date: String!
}

input AttendeeInput {
  userId: String!
  name: String!
  drinkCounter: Int!
  date: String!
}

input SignUpAttendeeInput {
  firstName: String!
  lastName: String!
  email: String!
  date: String!
}

input SignInAttendeeInput {
  _id: String!
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

input UpdateAttendeeDrinksInput {
  _id: String!
  drinkId: String!
  date: String!
}

type RootQuery {
    events: [Event!]!
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthData!
    attendees: [Attendee!]!
    currentAttendees: [CurrentAttendee!]!
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
    deleteDrink(id: ID!): Drink
    signInAttendee(signInAttendeeInput: SignInAttendeeInput): CurrentAttendee
    signUpAttendee(signUpAttendeeInput: SignUpAttendeeInput): Attendee
    updateAttendeeDrinks(updateAttendeeDrinksInput: UpdateAttendeeDrinksInput): CurrentAttendee
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)
