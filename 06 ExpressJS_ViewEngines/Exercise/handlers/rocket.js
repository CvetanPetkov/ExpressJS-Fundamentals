const Rocket = require('../models/Rocket')

module.exports.addGet = (req, res) => {
  res.render('rocket/add')
}

module.exports.addPost = (req, res) => {
  let rocketObj = req.body
  console.log(rocketObj)
  Rocket.create(rocketObj).then(() => {
    res.redirect('/')
  })
    .catch((err) => {
      console.log(err)
    })
}
