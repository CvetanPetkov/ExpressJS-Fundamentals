const mongoose = require('mongoose')
const User = mongoose.model('User')
const Message = mongoose.model('Message')
const Thread = mongoose.model('Thread')

const errorHandler = require('../utilities/error-handler')

module.exports = {
  indexGet: (req, res) => {
    let user = req.user

    //  console.log('indexGet controller')

    if (user) {
      let userId = req.user._id

      Thread.find().findThisUser(userId)
        .select('_id createdAt openedBy participant')
        .sort({createdAt: -1})
        .lean()
        .then((threads) => {

          //  console.log(threads)
          //  console.log(threads[0])
          //  console.log(threads[0].createdAt.toISOString())

          threads.map((thread) => {
            if (thread.openedBy._id.toString() === userId.toString()) {
              thread.isCurrUserOwned = true
            }
          })

          res.render('home/index', {
            user: user,
            threads: threads
          })
        })
        .catch((err) => {
          let message = errorHandler.handleMongooseError(err)
          res.locals.globalError = message
          res.redirect('/')
        })
    } else {
      res.render('home/index')
    }
  }
}
