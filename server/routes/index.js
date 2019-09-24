const express = require('express')
const router = express.Router()

//Rota de servicoes do meu sistema
router.use('/upload', require('./upload'))
router.use('/products', require('./products'))

module.exports = router