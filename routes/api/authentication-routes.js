const express = require('express');

const router = express.Router();

const authController = require('../../controllers/authenticate-controllers');

const authenticate = require('../../middlewares/authenticate');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/current', authenticate, authController.current);

router.post('/logout', authenticate, authController.logout);

module.exports = router;
