const xlsx = require('xlsx')

const { Products } = require('../../schemas')

const { getHeaderRow, renameKeys } = require('./utils')

const titles = {
    'RFID': 'rfid',
    'DESCRICAO': 'description',
    'QUANTIDADE': 'stock'
}

const plainsParser = async (file) => {
    console.log('Start Parser')

    let f = xlsx.readFile(file.path)
    let sheets = f.SheetNames

    if (!sheets || sheets.length === 0)
        throw new Error('ERRO - xlsx inválido. Crie uma planilha.')

    let page = xlsx.utils.sheet_to_json(f.Sheets[sheets[0]])
    if (page.length === 0)
        throw new Error('AVISO - Nenhum dado na planilha')

    let header = getHeaderRow(f.Sheets[sheets[0]])
    for (field in titles) {
        if (!header.find(e => { return field === e }))
            throw new Error('ERRO - Coluna ' + field + ' não encontrada.')
    }

    console.log('[PLAINS] Fields: \n\t' + header)

    let warnings = []
    let products = []

    for (let i = 0; i < page.length; i++) {
        let e = renameKeys(titles, page[i])

        if (!e.rfid)
            throw new Error('ERRO - Produto sem código de barras: ' + e.description)

        if (!e.description)
            throw new Error('ERRO - Produto sem descrição: ' + e.rfid)

        if (!e.stock) {
            delete e.stock
            warnings.push('AVISO - Produto com estoque inválido: ' + e.rfid + ' - ' + e.description)
        }

        products.push(e)
    }

    console.log('End Parser')

    return await fillDatabases(products, warnings)
}

const fillDatabases = async (products, warnings) => {
    let oks = {
        products: { modified: 0, inserted: 0 }
    }

    for (let i = 0; i < products.length; i++) {
        let e = products[i]

        let p = await Products.updateOne({ rfid: e.rfid }, e, { upsert: true })
            .catch(error => {
                console.log('[ERROR]', error)
                throw new Error('ERRO - Não foi possível inserir o produto: ' + e.rfid + '. Verifique se já existe o código de barras.')
            })

        if (typeof p === 'object' && 'upserted' in p)
            oks.products.inserted++
        else if (typeof p === 'object' && 'nModified' in p)
            oks.products.modified++
    }

    return { message: 'Inserido com sucesso', warnings: warnings, log: oks }
}

module.exports = plainsParser
