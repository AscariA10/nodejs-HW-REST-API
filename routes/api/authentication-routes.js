const multer = require('multer');
const path = require('path');
const express = require('express');

const router = express.Router();

const authController = require('../../controllers/authenticate-controllers');

const authenticate = require('../../middlewares/authenticate');

const upload = require('../../middlewares/upload');

router.post('/register', authController.register);

router.get('/verify/:verificationToken', authController.verify);

router.post('verify', authController.resendVerify);

router.post('/login', authController.login);

router.get('/current', authenticate, authController.current);

router.post('/logout', authenticate, authController.logout);

router.patch('/avatars', authenticate, upload.single('avatar'), authController.changeAvatar);

module.exports = router;
