const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pp: {
        type: String,
        default: ""
    },
    accessToken: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    }
});

userSchema.methods.generateVerificationToken = function () {
    const user = this;
    const verificationToken = jwt.sign(
        {
            ID: user._id,
            Email: user.email
        },
        process.env.USER_VERIFICATION_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
    return verificationToken;
};

const user = mongoose.model('user', userSchema);

module.exports = user;
