const controllers = require('../controllers')
const auth = require('./auth')
const multer = require('multer')

let upload = multer({dest: './public/icons'})

module.exports = (app) => {
  app.get('/', controllers.home.indexGet)

  app.get('/message/like/:message/:reqUser', auth.isAuthenticated, controllers.message.likeGet)
  app.get('/message/dislike/:message/:reqUser', auth.isAuthenticated, controllers.message.dislikeGet)

  app.get('/thread/', auth.isAuthenticated, controllers.thread.searchPost)
  app.get('/thread/:reqUser', auth.isAuthenticated, controllers.thread.searchPost)
  app.post('/thread/message/:threadId/:reqUserId', auth.isAuthenticated, controllers.thread.sendMessage)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register',upload.single('avatar'), controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)
  app.get('/users/unblock/:userId', controllers.users.unblockUser)
  app.get('/users/block/:userId', controllers.users.blockUser)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
