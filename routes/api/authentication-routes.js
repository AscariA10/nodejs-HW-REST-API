const multer = require('multer');
const path = require('path');

const express = require('express');

const router = express.Router();

const authController = require('../../controllers/authenticate-controllers');

const authenticate = require('../../middlewares/authenticate');

const tempDir = path.join(__dirname, '../../temp');
const multerConfig = multer.diskStorage({ destination: tempDir });

const upload = multer({ storage: multerConfig });

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/current', authenticate, authController.current);

router.post('/logout', authenticate, authController.logout);

router.patch('/avatar', upload.single('avatar'), authController.changeAvatar);

module.exports = router;
