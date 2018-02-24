import * as passport from 'passport';
import * as local from 'passport-local';
import {IVerifyOptions} from 'passport-local';
import User from './models/user';

const LocalStrategy = local.Strategy;

passport.serializeUser((user: any, done): void => {
    done(null, user.id);
});

passport.deserializeUser((id: string, done): void => {
    User.m.findById(id).then((user) => done(null, user ? user : undefined), (err) => done(err));
});

passport.use(
    new LocalStrategy({
            passwordField: 'password',
            usernameField: 'email',
        },
        (email: string, password: string, done) => {
            User.m.findOne({email})
                .then((userInstance) => {
                    if (!userInstance) {
                        return done(null, false, <IVerifyOptions> {success: false, message: 'User not found'});
                    }
                    const user = new User(userInstance);
                    if (!user.validatePassword(password)) {
                        return done(null, false, <IVerifyOptions> {success: false, message: 'Incorrect password'});
                    }
                    if (user.i.tokens && user.i.tokens.activationToken) {
                        return done(null, false, <IVerifyOptions> {success: false, message: 'User is not activated'});
                    }
                    done(null, userInstance);
                }, (err) => {
                    done(err);
                });
        }));

export default passport;
