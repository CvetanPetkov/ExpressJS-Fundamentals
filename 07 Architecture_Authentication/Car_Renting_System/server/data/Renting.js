const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

let rentingSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  car: {
    type: ObjectId,
    ref: 'Car',
    required: true
  },
  rentedOn: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  },
  days: {
    type: mongoose.Schema.Types.Number,
    required: true
  },
  totalPrice: {
    type: mongoose.Schema.Types.Number,
    required: true
  }
})

let Renting = mongoose.model('Renting', rentingSchema)

module.exports = Renting
