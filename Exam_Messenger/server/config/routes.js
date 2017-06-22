const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.home.indexGet)

  app.get('/thread/', auth.isAuthenticated, controllers.thread.searchPost)
  app.post('/thread/message/:threadId/:reqUserId', auth.isAuthenticated, controllers.thread.sendMessage)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)
//  app.get('/users/unblock/', controllers.users.unblockUser)
  app.get('/users/block/:userId', controllers.users.blockUser)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
