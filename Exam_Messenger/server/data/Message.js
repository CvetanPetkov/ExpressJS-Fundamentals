const mongoose = require('mongoose')
const types = mongoose.Schema.Types
const encryption = require('../utilities/encryption')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let messageSchema = new mongoose.Schema({
  message: {
    type: types.String,
    required: REQUIRED_VALIDATION_MESSAGE,
    minlength: 1,
    maxlength: 1000
  },
  creator: {
    type: types.ObjectId,
    ref: 'User'
  },
  recipient: {
    type: types.ObjectId,
    ref: 'User'
  },
  likes: [{
    type: types.ObjectId,
    ref: 'User'
  }],
  thread: {
    type: types.ObjectId,
    ref: 'Thread'
  }
}, {timestamps: true})

//  STATICS ARE CUSTOM METHODS FOR EVERY INSTANCE OF THIS MODEL

messageSchema.statics.createMessage = function (message, creatorId, recipientId, threadId) {
  return this.create({
      message: message,
      creator: creatorId,
      recipient: recipientId,
      thread: threadId
    })
}

let Message = mongoose.model('Message', messageSchema)

module.exports = Message
