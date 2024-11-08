const express = require('express');
const router = express.Router();
const {
    registerController,
    loginController,
    tokenController,
} = require('../controllers/authController');
const { validateRegistration } = require('../middleware/auth');

router.post('/register', validateRegistration, registerController);
router.post('/login', loginController);
router.post('/token', tokenController);

module.exports = router;
