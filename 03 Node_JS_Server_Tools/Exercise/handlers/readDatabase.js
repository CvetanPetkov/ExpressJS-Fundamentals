const database = require('../database/database')

module.exports = {
  readDatabase: (data) => {
    let imagesFromBase = database.get()
    let content = ''

    for (let i = 0; i < imagesFromBase.length; i++) {
      content += `<div class="item-block">
    <img src="${imagesFromBase[i].img}">
    <h2>${imagesFromBase[i].name}</h2>
    <a href="/details/${i + 1}">Details</a>
</div>
`
    }

    let html = data.toString().replace('{content}', content)
    return html
  }
}
