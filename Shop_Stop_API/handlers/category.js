const Category = require('../models/Category')

module.exports.addGet = (req, res) => {
  Category.find().then((categories) => {
    res.render('category/add', {categories: categories})
  })
}

module.exports.addPost = (req, res) => {
  console.log(req.body)

  let category = req.body

  Category
    .create(category)
    .then(() => {
      res.redirect('/')
    })
    .catch((err) => {
      console.log(err)
    })
}

module.exports.productByCategory = (req, res) => {
  let categoryName = req.params.category

  Category
    .findOne({name: categoryName})
    .populate('products')
    .then((category) => {
      if (!category) {
        res.sendStatus(404)
        return
      }

      res.render('category/products', {category: category})
    })
}
