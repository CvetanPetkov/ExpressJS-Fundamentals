const Plane = require('../models/Plane')

module.exports.addGet = (req, res) => {
  res.render('plane/add')
}

module.exports.addPost = (req, res) => {
  let planeObj = req.body
  planeObj.image = `/public/images/${req.file.filename}`

  Plane.create(planeObj)
    .then(() => {
      res.redirect('/')
    })
    .catch((err) => {
      console.log(err)
    })
}
