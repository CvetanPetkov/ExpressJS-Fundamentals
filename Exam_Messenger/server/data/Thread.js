const mongoose = require('mongoose')
const types = mongoose.Schema.Types
const encryption = require('../utilities/encryption')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let threadSchema = new mongoose.Schema({
  messages: [{
    type: types.ObjectId,
    ref: 'Message'
  }],
  openedBy: {
    type: types.ObjectId,
    ref: 'User'
  },
  participant: {
    type: types.ObjectId,
    ref: 'User'
  }
}, {timestamps: true})

//  QUERY HELPERS AVAILABLE FOR EVERY INSTANCE OF THE MODEL

threadSchema.query.findThisUser = function (userId) {
  return this.find({
    $or: [{
      openedBy: userId
    },
      {
        participant: userId
      }
    ]
  })
    .populate([{
      path: 'messages',
      model: 'Message',
      populate: [{
        path: 'creator',
        model: 'User'
      },
        {
          path: 'recipient',
          model: 'User'
        }]
    },
      {
        path: 'openedBy',
        model: 'User'
      },
      {
        path: 'participant',
        model: 'User'
      }])
}
threadSchema.query.findBothUsers = function (currUserId, reqUserId) {
  return this.find({
    $or: [{
      openedBy: currUserId,
      participant: reqUserId
    },
      {
        openedBy: reqUserId,
        participant: currUserId
      }
    ]
  })
    .populate([{
      path: 'messages',
      model: 'Message',
      populate: [{
        path: 'creator',
        model: 'User'
      },
        {
          path: 'recipient',
          model: 'User'
        }]
    },
      {
        path: 'openedBy',
        model: 'User'
      },
      {
        path: 'participant',
        model: 'User'
      }])
}

let Thread = mongoose.model('Thread', threadSchema)

module.exports = Thread
