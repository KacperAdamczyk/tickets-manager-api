/* Dependencies */
import * as express from 'express';
import * as passport from 'passport';

import { getErr, isAuthenticated } from '../common';
import User from '../models/user';

/* --- User API ---
* -METHOD-         -URL-                                            -MIDDLEWARE-
*   POST        /login (email, password)
*   GET         /logout
*   GET         /user                                             isAuthenticated
*   POST        /user/create
*   GET         /user/verify/:token
*   POST        /user/change (oldPassword, newPassword)           isAuthenticated
*   GET         /user/reset/:email
*   POST        /user/reset (token, oldPassword, newPassword)
* --- Error object ---
* success: Boolean - Indicates success of operation
* message: String  - If failed provides description of the error
*/

interface IMessage {
    success: boolean;
    message?: string;
    code?: number;
}

const messages = {
    success: {
        success: true,
    },
    fail: {
        success: false,
    },
    internalError: {
        success: false,
        message: 'Internal server error',
        code: 0,
    },
    userNotAuthenticated: {
        success: false,
        message: 'User not authenticated',
        code: 1,
    },
    userNotFound: {
        success: false,
        message: 'User not found',
        code: 2,
    },
    invalidEmailAndOrPassword: {
        success: false,
        message: 'Invalid e-mail address and/or password',
        code: 3,
    },
    invalidOldAndOrNewPassword: {
        success: false,
        message: 'Invalid old password and/or new password',
        code: 4,
    },
    invalidTokenAndOrOldPassword: {
        success: false,
        message: 'Invalid token and/or old password',
        code: 5,
    },
    invalidToken: {
        success: false,
        message: 'Invalid token',
        code: 6,
    },
    isNotValidEmail(email: string) {
        return {
        success: false,
        message: `${email} is not valid e-mail address`,
        code: 7,
        };
    },
    invalidOldPassword: {
        success: false,
        message: 'Invalid old password',
        code: 8,
    },
    alreadyActivated: {
        success: false,
        message: 'User already activated',
        code: 9,
    },
};

export default (passportInstance: passport.PassportStatic): express.Router => {
    const router: express.Router = express.Router();

    router.post('/login', passportInstance.authenticate('local'), (req, res) => {
        res.status(200).send(messages.success);
    });

    router.get('/logout', (req, res) => {
        if (!req.session) {
            return res.status(401).send(messages.userNotAuthenticated);
        }
        req.logout();
        req.session.destroy((err) => {
            if (err) {
                console.log(`Session destroy error: ${err}`);
                res.status(500).send(messages.internalError);
            }
        });
        res.status(200).send(messages.success);
    });

    router.get('/user', isAuthenticated, (req, res) => {
        if (!req.session) {
            return res.status(401).send(messages.userNotAuthenticated);
        }
        getErr(User.findById(req.session.passport.user).exec())
            .then((user) => res.send(user),
                () => res.status(404).send(messages.userNotFound),
            );
    });

    router.post('/user', (req, res) => {
        if (!req.body.email || !req.body.password) {
            res.status(400).send(messages.invalidEmailAndOrPassword);
        }
        const user = new User();
        getErr(user.add(req.body.email, req.body.password))
            .then(() => res.status(201).send(messages.success),
                (err) => res.status(400).send(err),
            );
    });

    router.get('/user/activate/:token', (req, res) => {
        getErr(User.activateUser(req.params.token))
            .then(() => res.status(200).send(messages.success),
                (err) => res.status(401).send(err),
            );
    });

    router.get('/user/reactivate/:email', (req, res) => {
        getErr(User.generateActivationRequest(req.params.email))
            .then(() => res.status(200).send(messages.success),
                (err) => res.status(401).send(err),
            );
    });

    router.post('/user/change-password', isAuthenticated, (req, res) => {
        if (!req.body.oldPassword || !req.body.newPassword ) {
            res.status(400).send(messages.invalidOldAndOrNewPassword);
        }
        if (!req.session) {
            return void res.status(400).send(messages.userNotAuthenticated);
        }
        getErr(User.findById(req.session.passport.user).exec()
            .then((user) => {
                if (!user) {
                    return Promise.reject(messages.userNotFound);
                }
                return user.changePassword(req.body.oldPassword, req.body.newPassword);
            }))
            .then(() => res.status(200).send(messages.success),
                (err) => res.status(401).send(err),
            );
    });

    router.get('/user/reset-password/:email', (req, res) => {
        getErr(User.generateResetPasswordRequest(req.params.email))
           .then(() => res.status(200).send(messages.success),
               (err) => res.status(401).send(err),
           );
    });

    router.post('/user/reset-password', (req, res) => {
        if (!req.body.token || !req.body.newPassword) {
            res.status(400).send(messages.invalidTokenAndOrOldPassword);
        }
        getErr(User.resetPassword(req.body.token, req.body.newPassword))
            .then(() => res.status(200).send(messages.success),
                (err) => res.status(401).send(err),
            );
    });

    router.get('/user/messages', (req, res) => {
        res.send(messages);
    });

    return router;
};

export { messages };
