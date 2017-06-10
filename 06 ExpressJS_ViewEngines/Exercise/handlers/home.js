const Plane = require('../models/Plane')

module.exports.index = (req, res) => {
  Plane
    .find()
    .populate('rockets')
    .then((planes) => {
      res.render('home/index', {planes: planes})
    })
}

module.exports.about = (req, res) => {
  res.render('home/about')
}

module.exports.contactUs = (req, res) => {
  res.render('home/contact-us')
}
