import passport from 'passport';
import localStrategy from 'passport-local';

import { User } from '../modules/user/user.model';
import { InternalError } from '../helpers/InternalError';
import { userErrors } from '../modules/user/user.messages';
import { log } from '../helpers/log';

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser((id, done) => User.findById(id)
    .then(user => done(null, user), done));

passport.use(
    new localStrategy.Strategy({
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });

                if (!user && await user.comparePassword(password)) {
                    throw new InternalError(userErrors.invalidEmailAndOrPassword);
                }

                const tokens = user.tokens;
                if (tokens && tokens.activation.length) {
                    throw new InternalError(userErrors.notActivated);
                }

                done(null, user);
            } catch (error) {
                log.errorObj(error);

                return done(null, false, { message: error.message });
            }
        }
    )
);
