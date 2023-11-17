const db = require('./postgres')
db.database.sync()
    .then(() => { console.log("Connected DB") })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message)
    })