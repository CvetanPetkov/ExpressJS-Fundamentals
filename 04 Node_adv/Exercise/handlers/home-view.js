const url = require('url')
const path = require('path')
const fs = require('fs')
const readDb = require('./readDatabase')

module.exports = (req, res) => {
  req.pathname = req.pathname || path.normalize(url.parse(req.url).pathname)

  console.log(req.pathname + ' from home-view')

  if (req.pathname === '\\' && req.method === 'GET') {
    let filePath = path.normalize(path.join(__dirname, '../index.html'))

    console.log('I am in home-view')

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, {
          'Content-Type': 'text/plain'
        })
        res.write('Error 404 - not found!')
        res.end()
        return
      }

      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      //  res.write(data)
      res.write(readDb.readDatabase(data))
      res.end()
    })
  } else {
    return true
  }
}
