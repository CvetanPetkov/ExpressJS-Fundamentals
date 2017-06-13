const mongoose = require('mongoose')
const types = mongoose.Schema.Types


const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'
// const MIN_LENGTH_VALIDATION_MESSAGE = [1, '{PATH} must be more than {MINLENGTH} symbol long']
// const MAX_LENGTH_VALIDATION_MESSAGE = [140, '{PATH} must be less than {MAXLENGTH} symbols long']

let tweetSchema = new mongoose.Schema({
  message: {
    type: types.String,
    required: REQUIRED_VALIDATION_MESSAGE,
    minlength: 1,
    maxlength: 140
  },
  creator: {
    type: types.ObjectId,
    ref: 'User'
  },
  createdOn: {
    type: Date,
    default: Date.now()
  }
})

let Tweet = mongoose.model('Tweet', tweetSchema)

module.exports = Tweet
