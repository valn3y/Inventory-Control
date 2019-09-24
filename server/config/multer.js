const multer = require('multer')
const fs = require('fs-extra')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let name = file.originalname
        let path = `./uploads/${name}`
        if (!fs.existsSync('./uploads'))
            fs.mkdirSync('./uploads')
        if (!fs.existsSync(path))
            fs.mkdirSync(path)
        cb(null, path)
    },
    filename: (req, file, cb) => {
        cb(null, `${new Date()}-${file.originalname}`)
    }
})

const upload = multer({ storage })
module.exports = upload