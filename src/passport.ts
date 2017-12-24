import * as passport from 'passport';
import * as local from 'passport-local';

import { IVerifyOptions } from 'passport-local';
import User from './models/user';

const LocalStrategy = local.Strategy;

passport.serializeUser((user: any, done): void => {
    done(null, user.id);
});

passport.deserializeUser((id: string, done): void => {
    User.findById(id).then((user) => done(null, user ? user : undefined), (err) => done(err));
});

passport.use(
    new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
    },
    (email: string, password: string, done) => {
        User.findOne({ email })
            .then((user) => {
                if (!user) {
                    return done(null, false, <IVerifyOptions> { success: false, message: 'User not found' });
                }
                if (!user.validatePassword(password)) {
                    return done(null, false, <IVerifyOptions> { success: false, message: 'Incorrect password' });
                }
                if (user.tokens && user.tokens.activationToken) {
                    return done(null, false, <IVerifyOptions> { success: false, message: 'User is not activated' });
                }
                done(null, user);
            }, (err) => {
                done(err);
            });
    }));

export default passport;
