import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as emailValidator from 'email-validator';
import db from '../database';
import chalk from 'chalk';
import { Typegoose, prop, staticMethod, ModelType, instanceMethod, InstanceType } from 'typegoose';

import { SchemaOperations, validator } from './schema-operations';
import * as mail from '../nodemailer/nodemailer';

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

class Tokens {
    @prop()
    activationToken?: string;
    @prop()
    resetToken?: string;
}

class Details {
    @prop()
    firstName: string;
    @prop()
    lastName: string;
}

class User extends Typegoose {
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
    async add(this: InstanceType<User>, email: string, password: string) {
        if (!this.validateEmail(email)) {
            throw `${email} is not a valid e-mail address`;
        }
        this.email = email;
        this.password = User.hashPassword(password);
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

    @staticMethod
    static hashPassword(password: string): string {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    @instanceMethod
    generateActivationToken(this: InstanceType<User>): string {
        return jwt.sign({ id: this.id, purpose: tokenPurposes.userActivation }, config.tokenSecret, { expiresIn: '1d' });
    }

    @instanceMethod
    generateResetToken(this: InstanceType<User>): string {
        return jwt.sign({ id: this.id, purpose: tokenPurposes.passwordReset }, config.tokenSecret, { expiresIn: '1h' });
    }

    @staticMethod
    static async activateUser(this: ModelType<User>, token: string): Promise<void | string> {
        try {
            const payload: Payload = <Payload>jwt.verify(token, config.tokenSecret);
            const user = await this.findById(payload.id);
            if (!user ||
                payload.purpose !== tokenPurposes.userActivation ||
                user.tokens.activationToken !== token) {
                throw 'Invalid token';
            }
            user.tokens.activationToken = undefined;
            await user.save();
        } catch (err) {
            console.log(chalk.red(err));
            throw err;
        }
    }

    @instanceMethod
    async changePassword(this: InstanceType<User>, oldPassowrd: string, newPassword: string) {
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
    static async generateResetPasswordRequest(this: ModelType<User>, email: string) {
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
    static async resetPassword(this: ModelType<User>, token: string, newPassword: string) {
        try {
            const payload: Payload = <Payload>jwt.verify(token, config.tokenSecret);
            const user = await this.findById(payload.id);
            if (!user ||
                payload.purpose !== tokenPurposes.passwordReset ||
                user.tokens.resetToken !== token) {
                throw 'Invalid token';
            }
            user.password = newPassword;
            user.tokens.resetToken = undefined;
            await user.save();
        } catch (err) {
            console.log(chalk.red(err));
            throw err;
        }
    }
}

export default new User().getModelForClass(User,
    { existingMongoose: db.mongoose,
        existingConnection: db.mongoose.connection,
        //schemaOptions: { collection: 'users' }
    });
