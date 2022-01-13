const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const config = require('../config/auth');

const hashPassword = async (req, res, next) => {
    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(req.body.password, salt);
    req.password = hashedpass;
    return next();
}

function isAuth(req, res, next) {
    if (req.session.isAuth) {
        next()
    }
}

// const validatePassword = async (req, res, next) => {
//     const validate = await bcrypt.compare(req.body.password, user.password);
//     req.validate = validate;
//     next();
// }

function verifyToken(req, res, next) {
    // Get auth header value
    // const bearerHeader = req.headers['authorization'];
    // // Check if bearer is undefined
    // if (typeof bearerHeader !== 'undefined') {
    //     // Split at the space
    //     const bearer = bearerHeader.split(' ');
    //     // Get token from array
    //     const bearerToken = bearer[1];
    //     // Set the token
    //     req.token = bearerToken;
    //     // Next middleware
    //     next();
    // } else {
    //     // Forbidden
    //     res.sendStatus(403);
    // }

    const { TokenExpiredError } = jwt;

    const catchError = (err, res) => {
        if (err instanceof TokenExpiredError) {
            return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
        }

        return res.sendStatus(401).send({ message: "Unauthorized!" });
    }

    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    const decoded = jwt.verify(token, 'secret-key', (err) => {
        if (err) {
            return catchError(err, res);
        }
    });
    req.user = decoded;
    return next();
}

module.exports = { hashPassword, isAuth, verifyToken };
