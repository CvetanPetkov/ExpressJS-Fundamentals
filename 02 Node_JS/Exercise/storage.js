const fs = require('fs')

let data = {}

let put = (key, value) => {
  isString(key)
  if (data.hasOwnProperty(key)) {
    throw new Error('Key already exists!')
  } else {
    data[key] = value
  }
}

let get = (key) => {
  isString(key)
  isPresent(key)
  return data[key]
}

let update = (key, value) => {
  isString(key)
  isPresent(key)
  data[key] = value
}

let deleteItem = (key) => {
  isString(key)
  isPresent(key)

  delete data[key]
  //console.log(data)
}

let clear = () => {
  data = {}
  //console.log(data)
}

let save = () => {
  return new Promise((resolve, reject) => {

    let dataStringifyed = JSON.stringify(data)
    fs.writeFile('./storage.dat', dataStringifyed, (err) => {
      if (err) {
        reject(err)
        return
      }

      resolve('file saved')
    })
  })
}

let load = () => {
  return new Promise((resolve, reject) => {

    fs.readFile('./storage.dat', 'utf8', (err, fileData) => {
      if (err) {
        reject(err)
        return
      }

      data = JSON.parse(fileData)

      resolve(data)
    })
  })
}

//  HELPER FUNCTIONS

function isString (key) {
  if (typeof key !== 'string') {
    throw new Error('Key must be a String!')
  }
}

function isPresent (key) {
  if (!data.hasOwnProperty(key)) {
    throw new Error('the key does not exists!')
  }
}

module.exports = {
  put: put,
  get: get,
  update: update,
  deleteItem: deleteItem,
  clear: clear,
  save: save,
  load: load
}
