const mongoose = require('mongoose')
const User = mongoose.model('User')
const Tweet = mongoose.model('Tweet')
const Tag = mongoose.model('Tag')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  tweetGet: (req, res) => {

    Tag.find()
      .sort('-createdOn')
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
    let tags = []
    let newTagsId = []
    let newTweetId = ''

    let parsedMessage = message.split(/\s|\.|,|!|\?/)

    for (let word of parsedMessage) {
      if (word.startsWith('#')) {
        let tagName = word.slice(1, word.length).toLowerCase()
        tags.push(tagName)
      }
    }

    Tweet.create({
      message: message,
      creator: creator
    })
      .then((tweet) => {
        newTweetId = tweet._id

        let updateTags = tags.map((tag) => {
          return Tag.findOneAndUpdate(
            {tagName: tag},
            {$push: {'tweetMsg': newTweetId}},
            {upsert: true, new: true})
        })

        Promise.all(updateTags)
          .then((tags) => {
            newTagsId = extractTags(tags)

            newTagsId.forEach((t) => {
              tweet.tags.addToSet(t)  //  can't use .push(t)
              tweet.save()
            })

            res.redirect('/')
          })
          .catch((err) => {
            let message = errorHandler.handleMongooseError(err)
            res.locals.globalError = message
            res.redirect('tweet/add', tweetReq)
          })

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

//  HELPERS

function extractTags (tagsObj) {
  let tags = []

  for (let tag of tagsObj) {
    tags.push(tag._id)
  }

  return tags
}