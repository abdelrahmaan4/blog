const express = require('express');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const { verifyToken, hashPassword } = require('../midware/authMidWare');
const { userValidationRules, validate } = require('../midware/userValidation')
const router = express.Router();

const use = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post('/register', userValidationRules(), validate, hashPassword, use(authController.register));
router.post('/login', use(authController.login));
router.delete('/users/:id', verifyToken, use(userController.deleteUser));
router.put('/users/:id', verifyToken, use(userController.updateUser));
router.get('/users/:id', use(userController.getUser));
router.get('/verify/:id', use(authController.verify));
router.post('/forgot-password', use(authController.forgotPassword));
router.get('/reset-password/:id', use(authController.verifyResetPassword));


module.exports = router;