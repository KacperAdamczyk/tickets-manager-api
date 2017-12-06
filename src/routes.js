/* Dependencies */
const path = require('path');
const express = require('express');

/* Models */
const User = require('./models/user');

/* Variables */
const router = new express.Router();
const indexUrl = '../dist/index.html';

/* Defining routes */

router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, indexUrl));
});

module.exports = router;