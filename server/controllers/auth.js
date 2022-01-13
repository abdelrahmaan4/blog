const UserData = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const { request } = require("express");
require('dotenv').config();


class authController {

    static async register(req, res) {

        const { username, email } = req.body;
        const newuser = new UserData({
            _id: new mongoose.Types.ObjectId,
            username: username,
            email: email,
            password: req.password,
        });

        const existingEmail = await UserData.findOne({ email }).exec();
        const existingUsername = await UserData.findOne({ username }).exec();

        if (existingEmail || existingUsername) {
            return res.status(409).send({
                message: "Info is already in use."
            });
        }
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const user = await newuser.save();
        const verificationToken = user.generateVerificationToken();
        const url = `http://localhost:5000/blog/verify/${verificationToken}`;
        transporter.sendMail({
            to: user.email,
            subject: 'Verify Account',
            html: `Click <a href = '${url}'>here</a> to confirm your email.`
        })

        return res.status(201).json(newuser);
    }

    static async login(req, res) {
        const user = await UserData.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json("Email doesn't exist");
        }

        const isvalidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isvalidPassword) {
            return res.status(401).json("Wrong data");
        }

        if (!user.verified) {
            return res.status(403).send({
                message: "Verify your Account."
            });
        }

        const accesstoken = jwt.sign({ user }, 'secret-key', {
            expiresIn: 60, //1m
        });

        const refreshtoken = jwt.sign({ user }, 'secret-key', {
            expiresIn: 86400, //6h
        });

        user.accessToken = accesstoken;
        user.refreshToken = refreshtoken;
        const { password, ...others } = user._doc;
        return res.status(201).json(others);
    }

    static async verify(req, res) {
        // console.log(req.params);
        const token = req.params.id;
        // Check we have an id
        if (!token) {
            return res.status(422).send({
                message: "Missing Token"
            });
        }
        // Step 1 -  Verify the token from the URL
        let payload = null
        try {
            payload = jwt.verify(
                token,
                process.env.USER_VERIFICATION_TOKEN_SECRET
            );
        } catch (err) {
            return res.status(400).send(err);
        }

        // Step 2 - Find user with matching ID
        const user = await UserData.findOne({ _id: payload.ID }).exec();
        if (!user) {
            return res.status(404).send({
                message: "User does not  exists"
            });
        }
        // Step 3 - Update user verification status to true
        user.verified = true;
        await user.save();
        // return res.status(200).send({
        //     message: "Account Verified"
        // });
        res.redirect('http://localhost:3000/login');



    }

    static async forgotPassword(req, res) {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const { email } = req.body;

        const user = await UserData.findOne({ email }).exec();

        if (!user) {
            return res.status(404).send({
                message: "Email doesn't exist."
            });
        }
        const verificationToken = user.generateVerificationToken();
        const url = `http://localhost:5000/blog/reset-password/${verificationToken}`;
        transporter.sendMail({
            to: email,
            subject: 'Reset Password',
            html: `Click <a href = '${url}'>here</a> to reset your password.`
        })

        res.status(200).json({
            message: "email sent",
            verificationToken
        })

    }

    static async verifyResetPassword(req, res) {
        // console.log(req.params);
        const token = req.params.id;
        // Check we have an id
        if (!token) {
            return res.status(422).send({
                message: "Missing Token"
            });
        }
        // Step 1 -  Verify the token from the URL
        let payload = null
        try {
            payload = jwt.verify(
                token,
                process.env.USER_VERIFICATION_TOKEN_SECRET
            );
        } catch (err) {
            return res.status(500).send(err);
        }
        try {
            // Step 2 - Find user with matching ID
            const user = await UserData.findOne({ email: payload.Email }).exec();
            if (!user) {
                return res.status(404).send({
                    message: "User does not  exists"
                });
            }
            // Step 3 - Update user verification status to true
            const { newPassword, confirmPassword } = req.body;
            if (!(newPassword == confirmPassword)) {
                return res.status(404).send({
                    message: "Passwords are not the same"
                });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedpass = await bcrypt.hash(newPassword, salt);
            user.password = hashedpass
            await user.save();
            return res.status(200).send({
                message: "password changed"
            });
            // res.redirect('http://localhost:3000/login');

        } catch (err) {
            return res.status(400).send(err);
        }

    }
}
module.exports = authController;