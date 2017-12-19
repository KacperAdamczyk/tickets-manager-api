/* Dependencies */
import * as express from 'express';
import * as passport from 'passport';
import * as path from 'path';
/* Models */
import { User } from '../models/user';

/* Defining routes */

export default (passportInstance: passport.PassportStatic): express.Router => {

    /* --- User API ---
    * METHOD     URL                                               MIDDLEWARE
    *  POST    /login (email, password)
    *  GET     /logout
    *  GET     /user                                             isAuthenticated
    *  POST    /user/create
    *  GET     /user/verify/:token
    *  POST    /user/change (oldPassword, newPassword)           isAuthenticated
    *  GET     /user/reset/:email
    *  POST    /user/reset (token, oldPassword, newPassword)
    * --- Error object ---
    * success: Boolean - Indicates success of operation
    * message: String  - If failed provides description of the error */

    const router: express.Router = express.Router();

    router.post('/login', passportInstance.authenticate('local'), (req: express.Request, res: express.Response) => {
        res.status(200).send({ success: true });
    });

    router.get('/logout', (req: express.Request, res: express.Response) => {
        if (!req.session) {
            return res.status(401).send( {success: false} );
        }
        req.logout();
        req.session.destroy(err => {
            if (err) {
                console.log(`Session destroy error: ${err}`);
                res.status(500).send({ success: false, message: err });
            }
        });
        res.status(200).send({ success: true });
    });

    router.get('/user', isAuthenticated, (req: express.Request, res: express.Response) => {
        if (!req.session) {
            return res.status(401).send( {success: false} );
        }
        User.findById(req.session.passport.user)
            .then((user: User) => res.send(user),
                () => res.status(404).send({ success: false, message: 'User not found' })
            );
    });

    router.post('/user/create', (req: express.Request, res: express.Response) => {
        if (!req.body.email || !req.body.password) {
            res.status(400).send({ success: false, message: 'Provide valid email and password' });
        }
        const user = new User();
        user.add(req.body.email, req.body.password)
            .then(() => res.status(201).send({ success: true }),
                (err: any) => res.status(400).send({ success: false, message: err })
            );
    });

    router.get('/user/activate/:token', (req: express.Request, res: express.Response) => {
        User.activateUser(req.params.token)
            .then(() => res.status(200).send({ success: true }),
                err => res.status(401).send({ success: false, message: err })
            );
    });

    router.post('/user/change', isAuthenticated, (req: express.Request, res: express.Response) => {
        if (!req.body.oldPassword || !req.body.newPassword) {
            res.status(400).send({ success: false, message: 'Provide old and new password' });
        }
        User.findById((<any>req).session.passport.user)
            .then(user => {
                return user.changePassword(req.body.oldPassword, req.body.newPassword)
            })
            .then(() => res.status(200).send({ success: true }),
                err => res.status(401).send({ success: false, message: err })
            );
    });

    router.get('/user/reset/:email', (req: express.Request, res: express.Response) => {
        User.generateResetPasswordRequest(req.params.email)
           .then(() => res.status(200).send({ success: true }),
               err => res.status(401).send({ success: false, message: err })
           );
    });

    router.post('/user/reset', (req: express.Request, res: express.Response) => {
        if (!req.body.token || !req.body.newPassword) {
            res.status(400).send({ success: false, message: 'Provide token and old password' });
        }
        User.resetPassword(req.body.token, req.body.newPassword)
            .then(() => res.status(200).send({ success: true }),
                err => res.status(401).send({ success: false, message: err })
            );
    });

    /* Middleware */

    function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (!req.session || !req.session.passport) {
            res.status(401).send({ success: false, message: 'User not authenticated' });
        } else {
            next();
        }
    }

    return router;
};



