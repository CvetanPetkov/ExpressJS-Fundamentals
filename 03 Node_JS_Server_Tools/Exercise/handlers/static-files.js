const url = require('url')
const path = require('path')
const fs = require('fs')

module.exports = (req, res) => {
  req.pathname = req.pathname || path.normalize(url.parse(req.url).pathname)

  console.log(req.pathname + ' from static-files')

  if (req.pathname.startsWith('\\content\\') && req.method === 'GET') {

    let filePath = path.normalize(path.join(__dirname, `..${req.pathname}`))
    let fileType = getContentType(filePath)

    console.log('I am in static-files')
    console.log('is restricted: ' + isRestricted(fileType))

    fs.readFile(filePath, (err, data) => {
      if (err || isRestricted(fileType)) {
        if (isRestricted(fileType)) {
          res.writeHead(403, {
            'Content-Type': fileType
          })
          res.write('Error 403 - Forbidden!')
          res.end()
          return
        }

        res.writeHead(404, {
          'Content-Type': fileType
        })
        res.write('Resource not found!')
        res.end()
        return
      }

      res.writeHead(200, {
        'Content-Type': fileType
      })
      res.write(data)
      res.end()
    })
  } else {
    return true
  }
}

//  HELPER FUNCTIONS

function getContentType (filePath) {
  switch (path.extname(filePath)) {
    case '.css':
      return 'text/css'
    case '.ico':
      return 'image/x-icon'
    case '.html':
      return 'text/html'
    case '.jpg':
      return 'image/jpeg'
    case '.jpeg':
      return 'image/jpeg'
    case '.js':
      return 'application/javascript'
    default:
      return 'text/plain'
  }
}

function isRestricted (fileType) {
  switch (fileType) {
    case 'text/css':
      return false
    case 'image/x-icon':
      return false
    case 'text/html':
      return false
    case 'image/jpeg':
      return false
    case '.application/javascript':
      return false
    default:
      return true

      // if (fileType === 'text/plain') {
      //   return true
      // } else {
      //   return false
      // }
  }
}
