const mongoose = require('mongoose')

let rocketSchema = mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true
  },
  planes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plane'
  }]
})

let Rocket = mongoose.model('Rocket', rocketSchema)

module.exports = Rocket
