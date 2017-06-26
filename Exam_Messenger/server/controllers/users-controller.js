const encryption = require('../utilities/encryption')
const mongoose = require('mongoose')
const fs = require('fs')
const User = mongoose.model('User')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  registerGet: (req, res) => {
    res.render('users/register')
  },
  registerPost: (req, res) => {
    let reqUser = req.body

    let salt = encryption.generateSalt()
    let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password)

    let userObj = {
      username: reqUser.username,
      firstName: reqUser.firstName,
      lastName: reqUser.lastName,
      salt: salt,
      hashedPass: hashedPassword
    }

    if (req.file) {
      userObj.avatar = `/icons/${req.file.filename}`
    }

    User.create(userObj)
      .then((user) => {
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

    User.findOne({username: reqUser.username})
      .then((user) => {
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

        req.logIn(user, (err, user) => {
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
  blockUser: (req, res) => {
    let currUser = req.user
    let reqUser = req.params.userId

    User.findById(currUser)
      .then((user) => {
        user.blockedUsers.push(reqUser)
        user.save()

        User.findById(reqUser)
          .then((reqUser) => {
            res.redirect(`/thread/?username=${reqUser.username}`)
          })
      })
      .catch((err) => {
        console.log(err)
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.redirect('/')
      })
  },
  unblockUser: (req, res) => {
    let currUser = req.user
    let reqUser = req.params.userId

    User.findById(currUser)
      .populate('blockedUsers')
      .then((user) => {
        let blockedUserIndex = null

        user.blockedUsers.map((blockedUser, index) => {
          // console.log(index)
          // console.log(blockedUser)

          if (blockedUser._id.toString() === reqUser.toString()) {
            blockedUserIndex = index
          }
        })

        // console.log(blockedUserIndex)

        user.blockedUsers.splice(blockedUserIndex, 1)
        user.save()

        User.findById(reqUser)
          .then((reqUser) => {
            res.redirect(`/thread/?username=${reqUser.username}`)
          })
      })
      .catch((err) => {
        console.log(err)
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.redirect('/')
      })
  }
}
