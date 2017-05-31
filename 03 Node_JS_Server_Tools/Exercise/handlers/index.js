const filesHandler = require('./static-files')
const homeView = require('./home-view')
const images = require('./images')
const details = require('./details-handler')

module.exports = [homeView, images, details, filesHandler]

//  the order in the array is important filesHandler must be last to return error 404 if the searched item is not found
