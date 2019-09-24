const { db } = require('../../config')
const allConstraints = require('../../routes/constraints')
const validate = require('validate.js')

constraintsMiddleware = (req, res, next) => {
    const constraints = allConstraints[req.url]
    if (!constraints) {
        console.log("[CONSTRAINTS] No constraints, next.")
        return next()
    }
    const errors = validate(req.body, constraints)

    if (errors) {
        console.log("[CONSTRAINTS] Constraint error.")
        var errs = []
        for (var key in errors) {
            errors[key].forEach(el => {
                errs.push(el)
            });
        }
        return res.status(500).send(errs)
    }
    else {
        console.log("[CONSTRAINTS] Good to go. ")
        return next()
    }
}

errorMiddleware = (err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var errors = []
        for (var key in err.errors)
            errors.push(err.errors[key].message + ' -  ' + err.errors[key].value)
        return res.status(500).json(errors)
    }

    console.log("[ERROR HANDLER]  -  " + err.message)
    res.status(500).json([err.message])

}

databaseMidleware = (req, res, next) => {
    if (!db || db.readyState !== 1) {
        console.log('[DATABASE] Not Connected.')
        next(new Error('Banco de dados não esta conectado. Por favor contate a Cassiana'))
    } else {
        next()
    }
}

module.exports = {
    databaseMidleware,
    errorMiddleware,
    constraintsMiddleware
}