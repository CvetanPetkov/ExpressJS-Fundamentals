const port = 27017
const dbName = 'exercise_05'
const prodDbName = 'prodDb'

module.exports = {
  development: {
    connectionString: `mongodb://localhost:${port}/${dbName}`
  },
  production: {
    connectionString: `mongodb://localhost:${port}/${prodDbName}`
  },
  port: `${port}`
}
