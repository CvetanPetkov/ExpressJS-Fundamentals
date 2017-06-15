const encryption = require('../utilities/encryption')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Tag = mongoose.model('Tag')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  registerGet: (req, res) => {
    res.render('users/register')
  },
  registerPost: (req, res) => {
    let reqUser = req.body
    // Add validations!

    let salt = encryption.generateSalt()
    let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password)

    User.create({
      username: reqUser.username,
      firstName: reqUser.firstName,
      lastName: reqUser.lastName,
      salt: salt,
      hashedPass: hashedPassword
    }).then(user => {
      req.logIn(user, (err, user) => {
        if (err) {
          res.locals.globalError = err
          res.render('users/register', user)
        }

        res.redirect('/')
      })
    })
      .catch((err) => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.redirect('users/register', user)
      })
  },
  loginGet: (req, res) => {
    res.render('users/login')
  },
  loginPost: (req, res) => {
    let reqUser = req.body
    User
      .findOne({username: reqUser.username}).then(user => {
      if (!user) {
        res.locals.globalError = 'Invalid user data'
        res.render('users/login')
        return
      }

      if (!user.authenticate(reqUser.password)) {
        res.locals.globalError = 'Invalid user data'
        res.render('users/login')
        return
      }

      req.logIn(user, (err, user) => { //  emitting user
        if (err) {
          res.locals.globalError = err
          res.render('users/login')
        }

        res.redirect('/')
      })
    })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },
  profile: (req, res) => {
    let userId = req.body._id

    User  //  add sorting by newest tweets
      .findOne({user: userId})
      .populate('tweets')    //  emit all tweets from user
      .then((tweets) => {
        Tag.find()
          .then((tags) => {
            let userTweets = tweets.tweets
            let allTags = tags

            userTweets.reverse()//must be done with sort

            res.render('users/profile', {
              tweets: userTweets,
              tags: allTags
            })
          })
          .catch((err) => {
            let message = errorHandler.handleMongooseError(err)
            res.locals.globalError = message
            res.redirect('user/profile', userId)
          })
      })
      .catch((err) => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.redirect('user/profile', userId)
      })
  }
}
