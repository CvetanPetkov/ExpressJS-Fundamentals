const mongoose = require('mongoose')
const Message = mongoose.model('Message')
const User = mongoose.model('User')

const errorHandler = require('../utilities/error-handler')

module.exports = {
  likeGet: (req, res) => {
    let currUser = req.user
    let messageId = req.params.message
    let reqUser = req.params.reqUser

    // console.log(messageId)
    // console.log(reqUser)

    Message.findById(messageId)
      .populate('likes')
      .then((msg) => {
        msg.likes.push(currUser._id)
        msg.save()
          .then((msg) => {
            User.findById(reqUser)
              .then((reqUser) => {
                res.redirect(`/thread/${reqUser.username}`)
              })
          })
      })
      .catch((err) => {
        console.log(err)
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.redirect('/')
      })
  },
  dislikeGet: (req, res) => {
    let currUser = req.user
    let messageId = req.params.message
    let reqUser = req.params.reqUser

    Message.findById(messageId)
      .populate('likes')
      .then((msg) => {
        msg.likes.pop(currUser._id)
        msg.save()
          .then((msg) => {
            User.findById(reqUser)
              .then((reqUser) => {
                res.redirect(`/thread/${reqUser.username}`)
              })
          })
      })
      .catch((err) => {
        console.log(err)
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.redirect('/')
      })
  }
}
