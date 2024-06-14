const express = require('express');
const { signup, login, upgradeUser } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/upgrade/:email', upgradeUser);

module.exports = router;
