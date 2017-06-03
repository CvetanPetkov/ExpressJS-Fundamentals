const url = require('url')
const fs = require('fs')
const path = require('path')
const database = require('../database/database')
const formidable = require('formidable')
const shortId = require('shortid')

module.exports = (req, res) => {
  req.pathname = req.pathname || path.normalize(url.parse(req.url).pathname)

  console.log(req.pathname + ' from images')

  if (req.pathname === '\\' && req.method === 'POST') {
    let form = new formidable.IncomingForm()

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err)
        return
      }

      console.log('Fields: ')
      console.log(fields['name'])
      console.log('Files: ')
      console.log(files['img'])

      let name = fields['name']
      let file = files['img']

      if (!name || !file) {
        res.writeHead(400, {
          'Content-Type': 'text/plain'
        })
        res.write('Error 400 - Bad Request!')
        res.end()
      } else {
        let currId = shortId.generate()
        let newDir = './content/images/' + currId + '/'
        fs.mkdirSync(newDir)

        let readStream = fs.createReadStream(file.path)
        let writeStream = fs.createWriteStream(newDir + file.name)

        readStream.on('data', (data) => {
          writeStream.write(data)
        })

        readStream.on('end', () => {
          let databaseData = {
            name: name,
            img: '.' + newDir + file.name
          }
          database.add(databaseData)

          console.log('WriteStream Ended!')
        })

        res.writeHead(302, {
          'Location': '/'
        })
        res.end()
      }
    })
  }
  else {
    return true
  }
}
