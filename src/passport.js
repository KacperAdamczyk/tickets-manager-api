const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id).exec().then(user => done(null, user), err => done(err));
});

passport.use(
    new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
    },
    (email, password, done) => {
        User.findOne({ 'email': email }).exec()
            .then(user => {
                if (!user) {
                    return done(null, false, { success: false, message: 'User not found.' });
                }
                if (!user.validatePassword(password)) {
                    return done(null, false, { success: false, message: 'Incorrect password.' });
                }
                if (user.tokens.activationToken !== null) {
                    return done(null, false, { success: false, message: 'User is not activated' });
                }
                done(null, user);
            }, err => {
                done(err);
            });
    }));

module.exports = passport;

