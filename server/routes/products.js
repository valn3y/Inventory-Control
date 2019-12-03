const express = require('express')
const router = express.Router()
const { Products } = require('../schemas')
const { wrapAsync } = require('../utils/wrappers')

router.post('/', wrapAsync(async (req, res, next) => {
    await Products.find()
        .then(product => {
            res.send(product)
        })
}))

router.post('/updateArduino', wrapAsync(async (req, res, next) => {
    console.log(req)
    let action = await Products.findOne({ rfid: req.body.rfid })
    let modified = await Products.findOne({ update: 'modified' })

    if (modified) {
        let change = 'noModified'
        modified['update'] = change
        await Products.updateOne({ rfid: modified.rfid }, modified)
    }

    if (action) {
        let storage = action.stock
        storage = storage - 1

        action['stock'] = storage
        action['update'] = 'modified'

        await Products.updateOne({ rfid: action.rfid }, action)

        res.send({ message: 'Atualizado com sucesso' })
    } else {
        res.status(500).send({ message: 'Não foi possível localizar o produto' })
    }
}))

module.exports = router