const mongoose = require('mongoose')
const User = mongoose.model('User')
const Message = mongoose.model('Message')
const Thread = mongoose.model('Thread')

const serveData = require('../utilities/serveData')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  searchPost: (req, res) => {
    let currUser = req.user
    let reqUser = req.query.username || req.params.reqUser

    //  console.log(req.user.blockedUsers)
    //  console.log(req.params)

    if (currUser.username === reqUser) {
      let message = 'You can not send message to yourself!'
      res.locals.globalError = message
      res.redirect('/')
    } else {

      User.find().findByUsername(reqUser)
        .then((reqUser) => {
          if (reqUser) {

            Thread.findOne().findBothUsers(currUser._id, reqUser._id)
              .lean()  //  converts the received model to modifiable object - plain JS object
              .then((thread) => {

                //  console.log(thread)
                //  console.log(thread[0].messages[0].creator._id)
                //  console.log(currUser._id)

                if (thread.length > 0) {

                  currUser.blockedUsers.map((blockedUser) => {
                    if (blockedUser.toString() === reqUser._id.toString()) {
                      thread[0].isBlockedFromMe = true
                    }
                  })

                  reqUser.blockedUsers.map((blockedUser) => {
                    if (blockedUser._id.toString() === currUser._id.toString()) {
                      thread[0].isBlockedFromOther = true
                    }
                  })

                  thread[0].messages.map((msg) => {
                    if (msg.creator._id.toString() === currUser._id.toString()) {
                      msg.isCurrUserOwned = true
                    }

                    switch (serveData.hyperlinksChecker(msg)) {
                      case 'isHyperLink':
                        msg.isHyperLink = true
                        break
                      case 'isImage':
                        msg.isImage = true
                        break
                      default:
                        break
                    }
                  })

                  thread[0].messages.sort((msg1, msg2) => {
                    return msg1.createdAt - msg2.createdAt
                  })

                  //  console.log(thread[0].messages[0].isCurrUserOwned)
                  //  for (let msg of thread[0].messages) {
                  //    console.log(msg.isHyperLink)
                  //    console.log(msg.isImage)
                  //  }
                  //  console.log(thread[0].isBlockedFromOther)
                  //  console.log(thread[0].isBlockedFromMe)

                  res.render('thread/talk', {thread: thread[0], reqUser: reqUser})
                } else {
                  res.render('thread/talk', {newThread: 'newThread', reqUser: reqUser})
                }
              })
              .catch((err) => {
                console.log(err)
                let message = errorHandler.handleMongooseError(err)
                res.locals.globalError = message
                res.redirect('/')
              })
          } else {
            res.locals.globalError = 'No such user!'
            return res.redirect('/')
          }
        })
        .catch((err) => {
          console.log(err)
          let message = errorHandler.handleMongooseError(err)
          res.locals.globalError = message
          res.redirect('/')
        })

    }
  },
  sendMessage: (req, res) => {
    let currUserId = req.user._id
    let reqUserId = req.params.reqUserId
    let reqThreadId = req.params.threadId
    let reqMessage = req.body.message

    //  console.log(currUser)
    //  console.log(reqUserId)
    //  console.log(reqThreadId)
    //  console.log(reqMessage)

    let createAddMessage = function (reqMessage, currUserId, reqUserId, reqThreadId) {
      Message.createMessage(reqMessage, currUserId, reqUserId, reqThreadId)
        .then((newMessage) => {

          //  console.log(newMessage)

          Thread.findById(reqThreadId)
            .then((thread) => {
              thread.messages.push(newMessage._id)
              thread.save().then(() => {
                User.findById(reqUserId)
                  .then((user) => {
                    res.redirect(`/thread/?username=${user.username}`)
                  })
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

    if (reqThreadId === 'newThread') {

      //  console.log(reqThreadId)

      Thread.create({
        openedBy: currUserId,
        participant: reqUserId
      })
        .then((newThread) => {
          let reqThreadId = newThread._id

          createAddMessage(reqMessage, currUserId, reqUserId, reqThreadId)
        })
        .catch((err) => {
          console.log(err)
          let message = errorHandler.handleMongooseError(err)
          res.locals.globalError = message
          res.redirect('/')
        })
    } else {
      createAddMessage(reqMessage, currUserId, reqUserId, reqThreadId)
    }
  }
}
