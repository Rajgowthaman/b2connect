const express = require('express');
const router = express.Router();
const userApi = require('../api/userApi');
const authenticator = require('../middleware/authenticator');
const coreApi = require('../api/coreApi');

// Home page route.
router.post('/login', userApi.login);
router.post('/signup', userApi.signup);
router.post('/iplookup', authenticator.authenticateJWT, coreApi.ipLookup);

module.exports = router;