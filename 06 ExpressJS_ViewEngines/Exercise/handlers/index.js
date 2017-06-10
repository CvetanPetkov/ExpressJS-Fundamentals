const homeHandler = require('./home')
const planeHandler = require('./plane')
const rocketToPlaneHandler = require('./rocket-to-plane')
const rocketHandler = require('./rocket')

module.exports = {
  home: homeHandler,
  plane: planeHandler,
  rocketToPlane: rocketToPlaneHandler,
  rocket: rocketHandler
}
