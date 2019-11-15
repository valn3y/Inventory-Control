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
    let action = await Products.findOne({ barCode: req.body.barCode })

    if (action) {
        let storage = action.stock
        storage = storage - 1

        action['stock'] = storage

        await Products.updateOne({ barCode: action.barCode }, action)
        res.send({ message: 'Atualizado com sucesso' })
    } else {
        res.status(500).send({ message: 'Não foi possível localizar o produto' })
    }
}))

module.exports = router