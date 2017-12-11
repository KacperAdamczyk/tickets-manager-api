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
        if (!req.session.passport) {
            return res.status(404).send('You are not logged in');
        }
        User.findById(req.session.passport.user).exec().then(user => res.send(user), () => res.status(404).send('User not found'));
    });

    router.post('/user/create', (req, res) => {
        if (!req.body.email || !req.body.password) {
            res.status(404).send('Provide email and password');
        }
        let user = new User();
        user.add(req.body.email, req.body.password)
            .then(() => res.status(200).send(),
                    err => res.status(404).send(err));
    });

    router.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, indexUrl));
    });

    return router;
};



