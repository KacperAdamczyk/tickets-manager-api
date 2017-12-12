const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailValidator = require('email-validator');
const chalk = require('chalk');

const config = require('../config.js');

/* Schema */
const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: {
        activationToken: {
            type: String,
            required: true
        },
        resetToken: String
    },
    details: {
        firstName: String,
        lastName: String
    }
});

/* Validators */
userSchema.path('email').validate(email => emailValidator.validate(email), '{VALUE} is not a valid e-mail address.');

/* Class */
class UserClass {
    async add(email, password) {
            this.email = email;
            this.password = UserClass.hashPassword(password);
            this.tokens.activationToken = this.generateActivationToken();
            console.log(chalk.blue(`Attempting to create new user: ${this.email}`));
            try {
                await this.save();
            } catch (err) {
                console.log(chalk.red(err.message));
                throw err.message;
            }
            console.log(chalk.green('Success'));
    }
    validatePassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
    static hashPassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    }
    generateActivationToken() {
        return jwt.sign(this.id, config.tokenSecret);
    }
    static async activateUser(token) {
            let userId = jwt.verify(token, config.tokenSecret);
        console.log('userID', userId);
            try {
                await this.findByIdAndUpdate(userId, { $set: { tokens: { activationToken: null }}}).exec();
            } catch (err) {
                console.log(chalk.red(err));
                throw err;
            }
    }
}

userSchema.loadClass(UserClass);

module.exports = mongoose.model('User', userSchema);
