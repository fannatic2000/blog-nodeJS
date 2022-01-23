var express = require('express');
var router = express.Router();

const authMiddleware = require('../app/middlewares/authMiddlware');
const accountController = require('../app/controllers/AccountController');

router.get('/register', accountController.registerForm);
router.post('/register', accountController.register);
router.get('/is-available', accountController.checkUsernameRegister);
router.get('/login', accountController.login);
router.post('/login', accountController.checkUserLogin);
router.post('/logout', accountController.logout);
router.get('/profile', authMiddleware, accountController.showProfile);

module.exports = router;
