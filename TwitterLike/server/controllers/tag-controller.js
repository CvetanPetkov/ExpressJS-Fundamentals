const mongoose = require('mongoose')
const Tag = mongoose.model('Tag')
const Tweet = mongoose.model('Tweet')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  tagGet: (req, res) => {
    let tagName = req.query.tagName

    Tag  //  add sorting by newest tweets
      .findOne({tagName: tagName})
      .populate('tweetMsg')
      .then((tagTweets) => {

        tagTweets.tweetMsg.reverse()//must be done with sort

        Tag
          .find()
          .then((tags) => {
            res.render('home/index', {
              tags: tags,
              tagTweets: tagTweets
            })
          })
          .catch((err) => {
            let message = errorHandler.handleMongooseError(err)
            res.locals.globalError = message
            res.redirect('/')
          })
      })
      .catch((err) => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.redirect('/')
      })
  },
  tagPost: (req, res) => {

  },
  all: (req, res) => {

  }
}
