const home = require('./home-controller')
const users = require('./users-controller')
const tweet = require('./tweet-controller')
const tag = require('./tag-controller')

module.exports = {
  home: home,
  users: users,
  tweet: tweet,
  tag: tag
}
