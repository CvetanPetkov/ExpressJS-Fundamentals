const mongoose = require('mongoose')
const User = mongoose.model('User')
const Tweet = mongoose.model('Tweet')
const Tag = mongoose.model('Tag')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  tweetGet: (req, res) => {

    Tag.find()
      .then((tags) => {
        res.render('tweet/add', {tags: tags})
      })
      .catch((err) => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.redirect('tweet/add')
      })
  },
  tweetPost: (req, res) => {
    let tweetReq = req.body

    let message = tweetReq.message
    let creator = req.user._id

    Tweet.create({
        message: message,
        creator: creator
      })
      .then((tweet) => {
        let parsedMessage = message.split(/\s|\.|,|!|\?/)

        for (let word of parsedMessage) {
          if (word.startsWith('#')) {
            let tagName = word.slice(1, word.length)
            let tweetMsg = tweet._id

            Tag.findOne({tagName: tagName})
              .then((tag) => {
                if (!tag) {
                  Tag
                    .create({
                      tagName: tagName,
                      tweetMsg: tweetMsg
                    })
                    .then((newTag) => {
                      newTag.tweetMsg.push(tweet)
                    })
                    .catch((err) => {
                      let message = errorHandler.handleMongooseError(err)
                      res.locals.globalError = message
                      res.redirect('tweet/add', tweetReq)
                    })
                } else {
                  tag.tweetMsg.push(tweet)
                  tag.save()
                }
              })
              .catch((err) => {
                let message = errorHandler.handleMongooseError(err)
                res.locals.globalError = message
                res.redirect('tweet/add', tweetReq)
              })
          }
        }

        User.findById(creator)
          .then((user) => {
            user.tweets.push(tweet)
            user.save()
          })
          .catch((err) => {
            let message = errorHandler.handleMongooseError(err)
            res.locals.globalError = message
            res.redirect('tweet/add', tweetReq)
          })

        res.redirect('/')
      })
      .catch((err) => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.redirect('tweet/add', tweetReq)
      })

  },
  tweetDel: (req, res) => {
    let tweetName = req.params.tagName //extract from direct url

  }
}
