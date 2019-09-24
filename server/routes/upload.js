const express = require('express')
const router = express.Router()

const { getLatestDate, listDir } = require('../utils')

const { upload } = require('../config')
const { wrapAsync } = require('../utils/wrappers')

const plainsParser = require('../utils/parser')

router.post('/', upload.single('file'), wrapAsync(async (req, res, next) => {
    let name = req.file.originalname
    const files = await listDir(`/uploads/${name}/`)

    const f = getLatestDate(files)
    f.path = f.path.substring(1)

    switch (name) {
        case 'plains.xlsx':
            let result = await plainsParser(f)
            return res.send(result)
        default:
            throw new Error('ERRO - Arquivo inválido. Verifique o nome do arquivo.')
    }
}))

module.exports = router