const mongoose = require('mongoose')
const Car = mongoose.model('Car')
const Renting = mongoose.model('Renting')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  addGet: (req, res) => {
    res.render('cars/add')
  },
  addPost: (req, res) => {
    let carReq = req.body

    if (carReq.pricePerDay <= 0) {
      res.locals.globalError = 'Price per Day can not be less than 0'
      res.render('cars/add', carReq)
      return
    }

    Car
      .create({
        make: carReq.make,
        model: carReq.model,
        year: carReq.year,
        pricePerDay: carReq.pricePerDay,
        power: carReq.power,
        image: carReq.image
      })
      .then((car) => {
        res.redirect('/cars/all')
      })
      .catch((err) => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.render('cars/add', carReq)
      })
  },
  all: (req, res) => {
    let pageSize = 2  //  items per page
    let page = parseInt(req.query.page) || 1
    let search = req.query.search

    let query = Car.find({isRented: false}) // hides rented
    
    if (search) {
      query = query.where('make').regex(new RegExp(search, 'i'))  //  case insensitive search
    }

    query
      .sort('-createdOn') //  sorts by date newest first
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then((cars) => {
        res.render('cars/all', {
          cars: cars,
          hasPrevPage: page > 1,
          hasNextPage: cars.length > 0,
          prevPage: page - 1,
          nextPage: page + 1,
          search: search
        })
      })
  },
  rent: (req, res) => {
    let userId = req.user._id
    let carId = req.params.id  //  extracts the id from url
    let days = parseInt(req.body.days)

    Car
      .findById(carId)
      .then((car) => {
        if (car.isRented) {
          res.locals.globalError = 'Car is already rented!'
          res.render('cars/all')
          return
        }

        Renting
          .create({
            user: userId,
            car: carId,
            days: days,
            totalPrice: car.pricePerDay * days
          })
          .then((renting) => {
            car.isRented = true
            car
              .save()
              .then((car) => {
                res.redirect('/users/me')
              })
          })
          .catch((err) => {
            let message = errorHandler.handleMongooseError(err)
            res.locals.globalError = message
            res.render('cars/all')
          })  //  if error must delete current renting
      })
      .catch((err) => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.render('cars/all')
      })
  }
}
