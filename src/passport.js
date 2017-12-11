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
                if (!user.validPassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                done(null, user);
            }, err => {
                done(err);
            });
    }));

module.exports = passport;

