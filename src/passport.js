const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id).exec().then(user => done(null, user), err => done(err));
});

passport.use(
    new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password'
    },
    (email, password, done) => {
        User.findOne({ 'email': email }).exec()
            .then(user => {
                if (!user.validPassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                done(null, user);
            }, err => {
                done(null, false, err);
            });
    }));

module.exports = passport;

