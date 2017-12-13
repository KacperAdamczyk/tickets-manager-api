const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailValidator = require('email-validator');
const chalk = require('chalk');
const mail = require('../nodemailer');

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
    admin: {
        type: Boolean,
        default: false
    },
    tokens: {
        activationToken: String,
        resetToken: String
    },
    details: {
        firstName: String,
        lastName: String
    }
});

let tokenPurposes = {
    userActivation: 'user-activation',
    passwordReset: 'password-reset'
}

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
            mail.sendActivation(this.email, `${config.url}/user/activate/${this.tokens.activationToken}`);
    }
    validatePassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
    static hashPassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    }
    generateActivationToken() {
        return jwt.sign({ id: this.id, purpose: tokenPurposes.userActivation }, config.tokenSecret);
    }
    generateResetToken() {
        return jwt.sign({ id: this.id, purpose: tokenPurposes.passwordReset }, config.tokenSecret, { expiresIn: '1d' });
    }
    static async activateUser(token) {
            try {
                let payload = jwt.verify(token, config.tokenSecret);
                let user = await this.findById(payload.id).exec();
                if (!user ||
                    payload.purpose !== tokenPurposes.userActivation ||
                    user.tokens.activationToken !== token) {
                    throw 'Invalid token';
                }
                user.tokens.activationToken = null;
                await user.save();
            } catch (err) {
                console.log(chalk.red(err));
                throw err;
            }
    }
    async changePassword(oldPassowrd, newPassword) {
            try{
                if (!this.validatePassword(oldPassowrd)) {
                    throw 'Old password is not correct';
                }
                this.password = UserClass.hashPassword(newPassword);
                await this.save();
            } catch (err) {
                console.log(chalk.red(err));
                throw err;
            }
    }

    static async generateResetPasswordRequest(email) {
        try {
            let user = await this.findOne({ email }).exec();
            if (!user) {
                throw 'User not found';
            }
            user.tokens.resetToken = user.generateResetToken();
            await user.save();
        } catch (err) {
            console.log(chalk.red(err));
            throw err;
        }
    }
    static async resetPassword(token, oldPassword, newPassword) {
        try {
            let payload = jwt.verify(token, config.tokenSecret);
            let user = await this.findById(payload.id).exec();
            if (!user ||
                payload.purpose !== tokenPurposes.passwordReset ||
                user.tokens.resetToken !== token) {
                throw 'Invalid token';
            }
            if (!user.validatePassword(oldPassword)) {
                throw 'Invalid old password';
            }
            user.password = UserClass.hashPassword(newPassword);
            user.tokens.resetToken = null;
            await user.save();
        } catch (err) {
            console.log(chalk.red(err));
            throw err;
        }
    }
}

userSchema.loadClass(UserClass);

module.exports = mongoose.model('User', userSchema);
