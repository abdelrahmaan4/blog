const { body, validationResult } = require('express-validator')
const bcrypt = require("bcrypt");


const userValidationRules = () => {
    return [
        // username must be an email
        body('username', 'username must have at least 3 characters')
            .exists()
            .isLength({ "min": 3 }),
        // password must be at least 5 chars long
        body('email', "Email is not valid")
            .exists()
            .isEmail()
            .normalizeEmail(),
        body('password', "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long")
            .exists()
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),

    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(422).json({
        errors: extractedErrors,
    })
}

// const hashPassword = async (req, res, next) => {
//     const salt = await bcrypt.genSalt(10);
//     const hashedpass = await bcrypt.hash(req.body.password, salt);
//     req.password = hashedpass;
//     return next();
// }

module.exports = {
    userValidationRules,
    validate,
}
