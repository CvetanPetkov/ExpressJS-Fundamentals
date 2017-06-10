const Plane = require('../models/Plane')
const Rocket = require('../models/Rocket')

module.exports.addGet = (req, res) => {
  Rocket.find().then((rockets) => {
    Plane.find().then((planes) => {
      res.render('plane/add-rocket', {rockets: rockets, planes: planes})
    })
  })
}

module.exports.addPost = (req, res) => {
  let data = req.body
  console.log(data)

  Plane.findById(data.planeId).then((plane) => {
    Rocket.findById(data.rocketId).then((rocket) => {
      plane.rockets.push(rocket._id)
      rocket.planes.push(plane._id)

      plane.save()
      rocket.save()

      res.redirect('/')
    })
  })
}
