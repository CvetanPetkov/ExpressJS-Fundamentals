const url = require('url')
const path = require('path')
const database = require('../database/database')

module.exports = (req, res) => {
  req.pathname = req.pathname || path.normalize(url.parse(req.url).pathname)

  console.log(req.pathname + ' from details-handler')

  if (req.pathname.startsWith('\\details\\') && req.method === 'GET') {
    let index = req.pathname.charAt(req.pathname.length - 1)

    let dataFromBase = database.get()
    let content = `<div class="item-block">
    <img src="${dataFromBase[index - 1].img}">
    <h2>${dataFromBase[index - 1].name}</h2>
    <a href="/">Back</a>
</div>
`

    res.writeHead(201, {
      'Content-Type': 'text/html'
    })
    res.write(content)
    res.end()

  } else {
    return true
  }
}
