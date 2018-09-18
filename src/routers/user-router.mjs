import * as express from 'express';

import passport from '../passport';
import { generalMessages, userMessages } from '../messages';
import User from '../models/user';
import { getErr, isAuthenticated, reqRequire, serverLog } from './common';

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
*/

const router = express.Router();

router.post('/login',
  passport.authenticate('local'),
  (req, res) => {
      res.status(200).send(generalMessages.success);
  });

router.get('/logout',
  reqRequire.session,
  (req, res) => {
      req.logout();
      req.session.destroy((err) => {
          if (err) {
              serverLog(`Session destroy error: ${err}`);
              res.status(500).send(generalMessages.internalError);
          }
          res.status(200).send(generalMessages.success);
      });
  });

router.get('/user',
  isAuthenticated,
  (req, res) => {
      getErr(User.m.findById(req.session.passport.user).exec())
        .then((user) => res.send(user),
          () => res.status(404).send(userMessages.userNotFound),
        );
  });

router.post('/user',
  reqRequire.body(['email', 'password']),
  (req, res) => {
      const user = new User();
      getErr(user.add(req.body.email, req.body.password))
        .then(() => res.status(201).send(generalMessages.success),
          (err) => res.status(400).send(err),
        );
  });

router.get('/user/activate/:token',
  (req, res) => {
      getErr(User.activateUser(req.params.token))
        .then(() => res.status(200).send(generalMessages.success),
          (err) => res.status(401).send(err),
        );
  });

router.get('/user/reactivate/:email',
  (req, res) => {
      getErr(User.generateActivationRequest(req.params.email))
        .then(() => res.status(200).send(generalMessages.success),
          (err) => res.status(401).send(err),
        );
  });

router.post('/user/change-password',
  isAuthenticated,
  reqRequire.body(['oldPassword', 'newPassword']),
  reqRequire.session,
  (req, res) => {
      getErr(User.m.findById(req.session.passport.user).exec()
        .then((userInstance) => {
            if (!userInstance) {
                return Promise.reject(userMessages.userNotFound);
            }
            return new User(userInstance).changePassword(req.body.oldPassword, req.body.newPassword);
        }))
        .then(() => res.status(200).send(generalMessages.success),
          (err) => res.status(401).send(err),
        );
  });

router.get('/user/reset-password/:email',
  (req, res) => {
      getErr(User.generateResetPasswordRequest(req.params.email))
        .then(() => res.status(200).send(generalMessages.success),
          (err) => res.status(401).send(err),
        );
  });

router.post('/user/reset-password',
  reqRequire.body(['token', 'newPassword']),
  (req, res) => {
      getErr(User.resetPassword(req.body.token, req.body.newPassword))
        .then(() => res.status(200).send(generalMessages.success),
          (err) => res.status(401).send(err),
        );
  });

router.get('/user/messages', (req, res) => {
    res.send(userMessages);
});

export {
    router,
};
