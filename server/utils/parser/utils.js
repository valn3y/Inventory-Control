const xlsx = require('xlsx')

getHeaderRow = (sheet) => {
    var headers = [];
    var range = xlsx.utils.decode_range(sheet['!ref'])
    var C, R = range.s.r
    for (C = range.s.c; C <= range.e.c; ++C) {
        var cell = sheet[xlsx.utils.encode_cell({ c: C, r: R })]

        var hdr = "UNKNOWN " + C
        if (cell && cell.t) hdr = xlsx.utils.format_cell(cell)

        headers.push(hdr)
    }
    return headers
}

renameKeys = (keysMap, obj) => Object.keys(obj).reduce((acc, key) => ({ ...acc, ...{ [keysMap[key] || key]: obj[key] } }), {})

module.exports = {
    getHeaderRow,
    renameKeys
}