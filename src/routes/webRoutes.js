const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const Ideas = mongoose.model('Idea');

const authenticator = require('../middleware/authenticator');

router.get('/home', authenticator.authenticateJWT,(req, res) => {
    res.render('home');
});
router.get('/login', /*authenticator.authenticateJWT,*/(req, res) => {
    res.render('login');
});
router.get('/charts', authenticator.authenticateJWT,(req, res) => {
    res.render('charts');
});

module.exports = router