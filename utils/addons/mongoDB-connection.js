const mongoose = require('mongoose')
const { dbConnection, dbLink } = require(`../../config/config.json`) 

module.exports = async (client) => {
    if(!dbConnection) return
    await mongoose.connect(`${dbLink}`, {
        keepAlive: true
    }).catch(err => {
         return console.log(`Mongoose unable to connect to MongoDB: ${err}`)
    }).finally(() => console.log(`Connected to MongoDB`))
}