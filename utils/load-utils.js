const path = require('path')
const fs = require('fs')

module.exports = (client) => {

  const readUtils = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir))
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file))
      if (stat.isDirectory()) {
        readUtils(path.join(dir, file))
      } else if (file !== 'load-utils.js') {
        const utils = require(path.join(__dirname, dir, file))
          utils(client)
      }
    }
  }

  readUtils('.')
}
