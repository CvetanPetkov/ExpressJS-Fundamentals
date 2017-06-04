const database = require('./config/database-config')
const envConfig = require('./config/environment-config')
const instanodedb = require('./instanode-db')

let localEnv = 'development'

let environment = process.env.NODE_ENV || localEnv

database(envConfig[environment], envConfig.port)
  .then(() => {
    // instanodedb.saveImage({
    //   url: 'https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg',
    //   description: 'such cat much wow',
    //   tags: ['cat', 'kitty', 'cute', 'catstagram']
    // })

    //  instanodedb.findByTag('cat')

    instanodedb
      .filter(null, null, 3)
      .then((images) => {
        images.forEach(i => console.log(i))
      })

    // instanodedb.filter()
  })


