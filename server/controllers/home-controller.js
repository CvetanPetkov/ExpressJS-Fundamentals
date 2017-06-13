const mongoose = require('mongoose')
const Tweet = mongoose.model('Tweet')
const Tag = mongoose.model('Tag')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  index: (req, res) => {

    Tweet
      .find()
      .then((tweets) => {
        if (tweets) {
          tweets.reverse()  //must be done with sort

          Tag
            .find()
            .then((tag) => {
              res.render('home/index', {
                tags: tag,
                tweets: tweets
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
      })
      .catch((err) => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.redirect('/')
      })
  }
}
