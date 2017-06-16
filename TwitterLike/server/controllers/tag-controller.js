const mongoose = require('mongoose')
const Tag = mongoose.model('Tag')
const Tweet = mongoose.model('Tweet')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  tagGet: (req, res) => {
    let tagName = ''
    if (req.query.tagName) {
      tagName = req.query.tagName  // extract from select
    } else {
      tagName = req.params.tagName //extract from direct url
    }

    Tag  //  add sorting by newest tweets and limit .limit()
      .findOne({tagName: tagName})
      .populate('tweetMsg')
      .then((tag) => {
        tag.tweetMsg.sort((tweet) => tweet.createdOn)

        Tag
          .find()
          .then((tags) => {
            res.render('home/index', {
              tags: tags,
              tagTweets: tag
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
