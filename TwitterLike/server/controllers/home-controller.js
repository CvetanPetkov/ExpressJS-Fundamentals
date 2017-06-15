const mongoose = require('mongoose')
const Tweet = mongoose.model('Tweet')
const Tag = mongoose.model('Tag')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  index: (req, res) => {
    // let role = ''
    //
    // if (req.user) {
    //   if (req.user.roles.indexOf('Admin') >= 0) {
    //     role = 'isAdmin'
    //   }
    // }

    Tweet
      .find()
      .then((tweets) => {
        if (tweets) {
          tweets.sort((tweet) => tweet.createdOn)

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
