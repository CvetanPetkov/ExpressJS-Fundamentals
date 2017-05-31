const url = require('url')
const fs = require('fs')
const path = require('path')
const qs = require('querystring')
const database = require('../database/database')

module.exports = (req, res) => {
  req.pathname = req.pathname || path.normalize(url.parse(req.url).pathname)

  console.log(req.pathname + ' from images')

  if (req.pathname === '\\' && req.method === 'POST') {
    let item = ''

    req.on('err', (err) => {
      console.log(err)

      res.writeHead(40, {
        'Content-Type': 'text/plain'
      })
      res.write('Error 400 - Bad request!')
      res.end()
    })

    req.on('data', (data) => {
      item += data
      console.log('Item as a String: ' + item)
    })

    req.on('end', () => {
      let itemData = qs.parse(item)

      console.log('Item as an Object:')
      console.log(itemData)

      if (!itemData.name || !itemData.img) {
        console.log(itemData)
        res.writeHead(400, {
          'Content-Type': 'text/plain'
        })
        res.write('Error 400 - Bad Request!')
        res.end()
      }

      database.add(itemData)

      res.writeHead(302, {
        'Location': '/'
      })
      res.end()
    })
  }
  else {
    return true
  }
}
