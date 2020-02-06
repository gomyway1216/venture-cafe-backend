const CurrentAttendee = require('../../models/currentAttendee')

const { transformAttendee } = require('./merge')

module.exports = {
  deleteAllCurrentAttendees: async () => {
    try {
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
