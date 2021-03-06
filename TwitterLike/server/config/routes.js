const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)

  app.get('/profile/:username', auth.isAuthenticated, controllers.users.profile)

  app.get('/admins/all', auth.isInRole('Admin'), controllers.users.adminsAll)
  app.get('/admins/add', auth.isInRole('Admin'), controllers.users.adminsAddGet)
  app.post('/admins/add', auth.isInRole('Admin'), controllers.users.adminsAddPost)

  app.get('/tweet', auth.isAuthenticated, controllers.tweet.tweetGet)
  app.post('/tweet', auth.isAuthenticated, controllers.tweet.tweetPost)
  app.get('/tweet/delete/:tweetId', auth.isInRole, controllers.tweet.tweetDel)

  app.get('/tag/', auth.isAuthenticated, controllers.tag.tagGet)
  app.get('/tag/:tagName', auth.isAuthenticated, controllers.tag.tagGet)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
