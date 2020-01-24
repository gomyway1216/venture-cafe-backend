const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const attendeeSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  drinkCounter: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Attendee", attendeeSchema);
