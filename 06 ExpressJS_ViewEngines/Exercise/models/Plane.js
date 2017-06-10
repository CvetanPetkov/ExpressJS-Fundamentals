const mongoose = require('mongoose')

let planeSchema = mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true
  },
  description: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  price: {
    type: mongoose.Schema.Types.Number,
    required: true
  },
  image: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  rockets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rocket'
  }]
})

let Plane = mongoose.model('Plane', planeSchema)

module.exports = Plane
