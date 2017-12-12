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

    /* --- User API ---
    * POST /login
    * GET  /logout
    * GET  /user
    * POST /user/create
    * --- Error object ---
    * success: Boolean - Indicates success of operation
    * message: String  - If failed provides description of the error */

    router.post('/login', passport.authenticate('local'), (req, res) => {
        res.status(200).send({ success: true });
    });

    router.get('/logout', (req, res) => {
        req.logout();
        req.session.destroy(err => {
            if(err) {
                console.log(`Session destroy error: ${err}`);
                res.status(500).send({ success: false, message: err });
            }
        });
        res.status(200).send({ success: true });
    });

    router.get('/user', isAuthenticated, (req, res) => {
        User.findById(req.session.passport.user).exec()
            .then(user => res.send(user),
                () => res.status(404).send({ success: false, message: 'User not found' })
            );
    });

    router.post('/user/create', (req, res) => {
        if (!req.body.email || !req.body.password) {
            res.status(400).send({ success: false, message: 'Provide valid email and password' });
        }
        let user = new User();
        user.add(req.body.email, req.body.password)
            .then(() => res.status(201).send({ success: true }),
                    err => res.status(400).send({ success: false, message: err })
            );
    });

    router.get('/user/verify/:token', (req, res) => {
        User.activateUser(req.params.token)
            .then(() => res.status(200).send({ success: true }),
                err => res.status(401).send({ success: false, message: err })
            );
    });

    router.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, indexUrl));
    });

    /* Middleware */

    function isAuthenticated(req, res, next) {
        if (!req.session.passport) {
            res.status(401).send({ success: false, message: 'User not authenticated' });
        } else {
            next();
        }
    }

    return router;
};



