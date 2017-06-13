const mongoose = require('mongoose')
const types = mongoose.Schema.Types

let tagSchema = new mongoose.Schema({
  tagName: {
    type: types.String
  },
  tweetMsg: [{
    type: types.ObjectId,
    ref: 'Tweet'
  }],
  createdOn: {
    type: Date,
    default: Date.now()
  }
})

let Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag
