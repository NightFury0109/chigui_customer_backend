const express = require('express');

const router = express.Router();

const isAuth = require('../middlewares/isAuth');

const usersController = require('../controllers/users');

router.get('/auth', isAuth, usersController.loadUser);

router.post('/signup', usersController.signup);

router.post('/signin', usersController.signin);

module.exports = router;