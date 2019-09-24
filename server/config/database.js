const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', e => console.error.bind(console, 'connection error'))
db.once('open', ok => console.log('[MONGODB] Connected'))

module.exports = db