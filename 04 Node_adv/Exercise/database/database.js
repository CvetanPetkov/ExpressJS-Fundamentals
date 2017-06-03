const fs = require('fs')
const path = require('path')
const dbPath = path.join(__dirname, './database.json')

//  let items = []

module.exports = {
  add: (itemData) => {
    let items = getAllItems()
    items.push(itemData)
    saveItems(items)
  },

  get: () => {
    let items = getAllItems()
    return items
  }
}

//  HELPER FUNCTIONS

function getAllItems () {
  if (!fs.existsSync(dbPath)) {
    fs.writeFile(dbPath, '[]', (err) => {
      if (err) {
        console.log(err)
      }

      return []
    })
  } else {
    let json = fs.readFileSync(dbPath).toString() || '[]'
    let jsonParsed = JSON.parse(json)

    return jsonParsed
  }
}

function saveItems (items) {
  let json = JSON.stringify(items)
  fs.writeFile(dbPath, json, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('New Item saved successfully!')
    }
  })
}
