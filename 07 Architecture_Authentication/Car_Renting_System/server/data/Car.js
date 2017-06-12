const mongoose = require('mongoose')

let carSchema = new mongoose.Schema({
  make: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  model: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  year: {
    type: mongoose.Schema.Types.Number,
    required: true
  },
  pricePerDay: {
    type: mongoose.Schema.Types.Number,
    required: true
  },
  power: {
    type: mongoose.Schema.Types.String
  },
  createdOn: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  },
  image: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  isRented: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  }
})

let Car = mongoose.model('Car', carSchema)

module.exports = Car
