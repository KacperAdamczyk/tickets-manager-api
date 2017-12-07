/* Dependencies */
const path = require('path');
const express = require('express');

/* Models */
const User = require('./models/user');

/* Variables */
const router = new express.Router();
const indexUrl = '../dist/index.html';

/* Defining routes */

module.exports = passport => {

    router.post('/login', passport.authenticate('local'));
    router.get('/user', (req, res) => {
        User.findById(req.session.passport.user).exec()
            .then(user => {
                    console.log(user);
                },
                    err => console.log(err));

        res.send('');
    });

    router.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, indexUrl));
    });

    return router;
};



