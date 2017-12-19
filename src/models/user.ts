import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as emailValidator from 'email-validator';
import chalk from 'chalk';
import { Typegoose, prop, staticMethod, ModelType, instanceMethod, InstanceType } from 'typegoose';

import { SchemaOperations, validator } from './schema-operations';
import * as mail from '../nodemailer-config';

import config from '../config';

enum tokenPurposes {
    userActivation = 'user-activation',
    passwordReset = 'password-reset'
};

interface Payload {
    id: string;
    purpose: tokenPurposes;
}
/* Class */

class Tokens extends Typegoose {
    activationToken: string | null;
    resetToken: string | null;
}

class Details extends Typegoose {
    firstName: string;
    lastName: string;
}

class UserClass extends Typegoose {
    @prop({ unique: true, required: true })
    email: string;
    @prop()
    password: string;
    @prop({ default: false })
    admin: boolean;
    @prop()
    tokens: Tokens;
    @prop()
    details: Details;

    @instanceMethod
    async add(this: InstanceType<UserClass>, email: string, password: string) {
        if (!this.validateEmail(email)) {
            throw `${email} is not a valid e-mail address`;
        }
        this.email = email;
        this.password = password;
        console.log(chalk.blue(`Attempting to create new user: ${this.email}`));
        this.tokens.activationToken = this.generateActivationToken();
        try {
            await this.save();
        } catch (err) {
            console.log(chalk.red(err.message));
            throw err.message;
        }
        console.log(chalk.green('Success'));
        mail.sendActivation(this.email, `${config.url}/user/activate/${this.tokens.activationToken}`);
    }

    @instanceMethod
    validateEmail(email: string) {
        return emailValidator.validate(email);
    }

    @instanceMethod
    validatePassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }

    @instanceMethod
    static hashPassword(password: string): string {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    @instanceMethod
    generateActivationToken(this: InstanceType<UserClass>): string {
        return jwt.sign({ id: this.id, purpose: tokenPurposes.userActivation }, config.tokenSecret, { expiresIn: '1d' });
    }

    @instanceMethod
    generateResetToken(this: InstanceType<UserClass>): string {
        return jwt.sign({ id: this.id, purpose: tokenPurposes.passwordReset }, config.tokenSecret, { expiresIn: '1h' });
    }

    @staticMethod
    static async activateUser(this: ModelType<UserClass>, token: string): Promise<void | string> {
            try {
                const payload: Payload = <Payload>jwt.verify(token, config.tokenSecret);
                const user = await this.findById(payload.id);
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

    @instanceMethod
    async changePassword(this: InstanceType<UserClass>, oldPassowrd: string, newPassword: string) {
            try{
                if (!this.validatePassword(oldPassowrd)) {
                    throw 'Old password is not correct';
                }
                this.password = newPassword;
                await this.save();
            } catch (err) {
                console.log(chalk.red(err));
                throw err;
            }
    }

    @staticMethod
    static async generateResetPasswordRequest(this: ModelType<UserClass>, email: string) {
        try {
            const user = await this.findOne({ email });
            if (!user)
                throw 'User not found';
            user.tokens.resetToken = user.generateResetToken();
            await user.save();
        } catch (err) {
            console.log(chalk.red(err));
            throw err;
        }
    }

    @staticMethod
    static async resetPassword(this: ModelType<UserClass>, token: string, newPassword: string) {
        try {
            const payload: Payload = <Payload>jwt.verify(token, config.tokenSecret);
            const user = await this.findById(payload.id);
            if (!user ||
                payload.purpose !== tokenPurposes.passwordReset ||
                user.tokens.resetToken !== token) {
                throw 'Invalid token';
            }
            user.password = newPassword;
            user.tokens.resetToken = null;
            await user.save();
        } catch (err) {
            console.log(chalk.red(err));
            throw err;
        }
    }
}

export const User = new UserClass().getModelForClass(UserClass);




