const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  signUpDate: {
    type: String,
    required: true,
  },
  lastSignInDate: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
})

module.exports = mongoose.model('User', userSchema)
