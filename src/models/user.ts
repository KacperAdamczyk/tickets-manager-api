import * as bcrypt from 'bcryptjs';
import chalk from 'chalk';
import * as emailValidator from 'email-validator';
import * as jwt from 'jsonwebtoken';
import { instanceMethod, InstanceType, ModelType, prop, staticMethod, Typegoose } from 'typegoose';
import db from '../database';
import { messages } from '../routers/user-router';

import * as mail from '../nodemailer/nodemailer';

import config from '../config';

enum tokenPurposes {
    userActivation = 'user-activation',
    passwordReset = 'password-reset',
}

interface IPayload {
    id: string;
    purpose: tokenPurposes;
}

// noinspection TsLint
class Tokens {
    @prop()
    public activationToken?: string;
    @prop()
    public resetToken?: string;
}

// noinspection TsLint
class Details {
    @prop()
    public firstName: string;
    @prop()
    public lastName: string;
}

// noinspection TsLint
class User extends Typegoose {
    @staticMethod
    public static async activateUser(this: ModelType<User>, token: string): Promise<void | string> {
        const payload: IPayload = <IPayload> jwt.verify(token, config.tokenSecret);
        const user = await this.findById(payload.id).exec();
        if (!user ||
            payload.purpose !== tokenPurposes.userActivation ||
            user.tokens.activationToken !== token) {
            return Promise.reject(messages.invalidToken);
        }
        user.tokens.activationToken = undefined;
        await user.save();
    }

    @staticMethod
    public static async generateActivationRequest(this: ModelType<User>, email: string) {
        const user = await this.findOne({ email }).exec();
        if (!user) {
            return Promise.reject(messages.userNotFound);
        }
        if (!user.tokens.activationToken) {
            return Promise.reject(messages.alreadyActivated);
        }
        user.tokens.activationToken = user.generateActivationToken();
        await user.save();
        mail.sendActivation(user.email, `${config.url}/user/activate/${user.tokens.activationToken}`);
    }

    @staticMethod
    public static async generateResetPasswordRequest(this: ModelType<User>, email: string) {
        const user = await this.findOne({ email }).exec();
        if (!user) {
            return Promise.reject(messages.userNotFound);
        }
        user.tokens.resetToken = user.generateResetToken();
        await user.save();
    }

    @staticMethod
    public static async resetPassword(this: ModelType<User>, token: string, newPassword: string) {
        const payload: IPayload = <IPayload> jwt.verify(token, config.tokenSecret);
        const user = await this.findById(payload.id).exec();
        if (!user ||
            payload.purpose !== tokenPurposes.passwordReset ||
            user.tokens.resetToken !== token) {
            return Promise.reject(messages.invalidToken);
        }
        user.password = User.hashPassword(newPassword);
        user.tokens.resetToken = undefined;
        await user.save();
    }

    @staticMethod
    private static hashPassword(password: string): string {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    @prop()
    public readonly tokens: Tokens;
    @prop({ unique: true, required: true })
    private email: string;
    @prop()
    private password: string;
    @prop({ default: false })
    private admin: boolean;
    @prop()
    private details: Details;

    @instanceMethod
    public async add(this: InstanceType<User>, email: string, password: string) {
        if (!this.validateEmail(email)) {
            Promise.reject(messages.isNotValidEmail(email));
        }
        this.email = email;
        this.password = User.hashPassword(password);
        console.log(chalk.blue(`Attempting to create new user: ${this.email}`));
        this.tokens.activationToken = this.generateActivationToken();
        await this.save();
        mail.sendActivation(this.email, `${config.url}/user/activate/${this.tokens.activationToken}`);
    }

    @instanceMethod
    public async changePassword(this: InstanceType<User>, oldPassowrd: string, newPassword: string) {
            if (!this.validatePassword(oldPassowrd)) {
                return Promise.reject(messages.invalidOldPassword);
            }
            this.password = User.hashPassword(newPassword);
            await this.save();
    }

    @instanceMethod
    public validatePassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }

    @instanceMethod
    private validateEmail(email: string) {
        return emailValidator.validate(email);
    }

    @instanceMethod
    private generateActivationToken(this: InstanceType<User>): string {
        return jwt.sign({ id: this.id, purpose: tokenPurposes.userActivation }, config.tokenSecret,
            { expiresIn: '1d' });
    }

    @instanceMethod
    private generateResetToken(this: InstanceType<User>): string {
        return jwt.sign({ id: this.id, purpose: tokenPurposes.passwordReset }, config.tokenSecret,
            { expiresIn: '1h' });
    }
}

export default new User().getModelForClass(User,
    { existingMongoose: db.mongoose,
        existingConnection: db.mongoose.connection,
        // schemaOptions: { collection: 'users' }
    });
