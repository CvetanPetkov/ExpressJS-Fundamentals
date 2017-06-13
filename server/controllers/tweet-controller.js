const mongoose = require('mongoose')
const Tweet = mongoose.model('Tweet')
const Tag = mongoose.model('Tag')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  tweetGet: (req, res) => {
    res.render('tweet/add')
  },
  tweetPost: (req, res) => {
    let tweetReq = req.body

    let message = tweetReq.message
    let creator = req.user._id

    Tweet
      .create({
        message: message,
        creator: creator
      })
      .then((tweet) => {
        let parsedMessage = message.split(/\s|\.|,|!|\?/)

        for (let word of parsedMessage) {
          if (word.startsWith('#')) {
            let tagName = word.slice(1, word.length)
            let tweetMsg = tweet._id

            Tag
              .findOne({tagName: tagName})
              .then((tag) => {
                if (!tag) {
                  Tag
                    .create({
                      tagName: tagName,
                      tweetMsg: tweetMsg
                    })
                    .then((tag) => {
                      console.log('Tag created - ' + tag.tagName)
                    })
                    .catch((err) => {
                      let message = errorHandler.handleMongooseError(err)
                      res.locals.globalError = message
                      res.redirect('tweet/add', tweetReq)
                    })
                }

                Tag
                  .findOne({tagName: tagName})
                  .then((tag) => {
                    tag.tweetMsg.push(tweet)
                    tag.save()
                  })
                  .catch((err) => {
                    let message = errorHandler.handleMongooseError(err)
                    res.locals.globalError = message
                    res.redirect('tweet/add', tweetReq)
                  })
              })
              .catch((err) => {
                let message = errorHandler.handleMongooseError(err)
                res.locals.globalError = message
                res.redirect('tweet/add', tweetReq)
              })
          }
        }

        res.redirect('/')
      })
      .catch((err) => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.redirect('tweet/add', tweetReq)
      })
  },
  all: (req, res) => {

  }
}
