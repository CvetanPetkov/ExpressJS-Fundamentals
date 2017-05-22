const fs = require('fs')
const path = require('path')
const dbPath = path.join(__dirname, '/database.json')

let products = []
let count = 1

module.exports.products = {}

module.exports.products.getAll = getProducts

module.exports.products.add = (product) => {
  let products = getProducts()
  product.id = products.length + 1
  products.push(product)

  saveProducts(products)
}

module.exports.products.findByName = (name) => {
  return getProducts().filter(p => p.name.toLowerCase().includes(name))

  // let productsFiltered = []
  // for (let product of products) {
  //   if (product.name === name) {
  //     productsFiltered.push(product)
  //   }
  // }
  //
  // return productsFiltered
}

//  HELPERS FUNCTIONS

function getProducts () {
  if (!fs.existsSync(dbPath)) {
    fs.writeFile(dbPath, '[]', (err) => {
      if (err) {
        throw new Error(err)
      }

      return []
    })
  }

  let json = fs.readFileSync(dbPath).toString() || '[]'
  let products = JSON.parse(json)
  return products
}

function saveProducts (products) {
  //  console.log(products)
  let json = JSON.stringify(products)
  fs.writeFileSync(dbPath, json)
}
