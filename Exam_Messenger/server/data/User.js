const mongoose = require('mongoose')
const types = mongoose.Schema.Types
const encryption = require('../utilities/encryption')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let userSchema = new mongoose.Schema({
  username: {
    type: types.String,
    required: REQUIRED_VALIDATION_MESSAGE,
    unique: true
  },
  firstName: {
    type: types.String,
    required: REQUIRED_VALIDATION_MESSAGE
  },
  lastName: {
    type: types.String,
    required: REQUIRED_VALIDATION_MESSAGE
  },
  blockedUsers: [{
    type: [types.ObjectId],
    ref: 'User'
  }],
  avatar: {
    type: types.String,
    default: '/icons/avatar-default1.png'
  },
  salt: types.String,
  hashedPass: types.String,
  roles: [types.String]
})

userSchema.method({
  authenticate: function (password) {
    return encryption.generateHashedPassword(this.salt, password) === this.hashedPass
  }
})

userSchema.query.findByUsername = function (username) {
  return this.findOne({username: username})
    .populate({
      path: 'blockedUsers',
      model: 'User'
    })
}

let User = mongoose.model('User', userSchema)

module.exports = User

module.exports.seedAdminUser = () => {
  User.find({}).then(users => {
    if (users.length > 0) return

    let salt = encryption.generateSalt()
    let hashedPass = encryption.generateHashedPassword(salt, '11')

    User.create({
      username: 'Admin',
      firstName: 'Admin',
      lastName: 'Admin',
      salt: salt,
      hashedPass: hashedPass,
      roles: ['Admin']
    })
  })
}
