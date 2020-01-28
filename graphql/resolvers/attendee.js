const Attendee = require("../../models/attendee");

const { transformAttendee } = require("./merge");

module.exports = {
  attendees: async () => {
    try {
      const attendees = await Attendee.find();
      // Not sure whether I need to transform
      return attendees.map(attendee => {
        console.log(attendee);
        return transformAttendee(attendee);
      });
      // return attendees;
    } catch (err) {
      throw err;
    }
  },

  // create ne Attendee
  checkInAttendee: async (args, req) => {
    // I may uncomment this out later.
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!");
    // }

    const attendee = new Attendee({
      userId: args.attendeeInput.userId,
      name: args.attendeeInput.name,
      drinkCounter: +args.attendeeInput.drinkCounter,
      date: args.attendeeInput.date
    });

    let createdAttendee;
    try {
      console.log("newAttendee", attendee);
      const result = await attendee.save();
      createdAttendee = transformAttendee(result);
      return createdAttendee;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  //drinkCounterUpdateInput
  updateDrinkCounter: async (args, req) => {
    try {
      const attendee = await Attendee.findOneAndUpdate(
        { userId: args.drinkCounterUpdateInput.userId },
        { drinkCounter: args.drinkCounterUpdateInput.drinkCounter },
        { new: true }
      );
      return attendee;
    } catch (err) {
      throw err;
    }
  }
};

// type Attendee {
//   _id: ID!
//   userId: String!
//   name: String!
//   drinkCounter: Int!
//   date: String!
// }

// input AttendeeInput {
//   userId: String!
//   name: String!
//   drinkCounter: Int!
//   date: String!
// }
