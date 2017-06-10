const handlers = require('../handlers')
const multer = require('multer')

let upload = multer({dest: './public/images'})

module.exports = (app) => {
  app.get('/', handlers.home.index)
  app.get('/about', handlers.home.about)
  app.get('/contact-us', handlers.home.contactUs)

  app.get('/plane/add', handlers.plane.addGet)
  app.post('/plane/add', upload.single('image'), handlers.plane.addPost)

  app.get('/plane/add/rocket', handlers.rocketToPlane.addGet)
  app.post('/plane/add/rocket', handlers.rocketToPlane.addPost)

  app.get('/rocket/add', handlers.rocket.addGet)
  app.post('/rocket/add', handlers.rocket.addPost)
}
