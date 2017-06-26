const home = require('./home-controller')
const users = require('./users-controller')
const thread = require('./thread-controller')
const message = require('./message-controller')

module.exports = {
  home: home,
  users: users,
  thread: thread,
  message: message
}
