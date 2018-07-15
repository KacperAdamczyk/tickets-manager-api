import * as bcrypt from 'bcryptjs';
import chalk from 'chalk';
import * as emailValidator from 'email-validator';
import * as jwt from 'jsonwebtoken';
import {Document, model, Schema} from 'mongoose';

import config from '../config';
import {userMessages} from '../messages';
import * as mail from '../nodemailer/nodemailer';
import {serverLog} from '../routers/common';

enum tokenPurposes {
    userActivation = 'user-activation',
    passwordReset = 'password-reset',
}

interface IPayload {
    id: string;
    purpose: tokenPurposes;
}

const userSchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    tokens: {
        activationToken: String,
        resetToken: String
    },
    admin: {
        type: Boolean,
        default: false
    },
    details: {
        firstName: String,
        lastName: String,
    }
});

interface IUserSchema extends Document {
    email: string;
    password: string;
    tokens: {
        activationToken?: string,
        resetToken?: string
    };
    admin?: boolean;
    details?: {
        firstName?: string,
        lastName?: string,
    };
    activateUser: (token: string) => Promise<void | string>;
}

const UserModel = model<IUserSchema>('User', userSchema);

class User {
    public static get m() {
        return this.model;
    }

    public get i() {
        return this.instance;
    }

    public static async activateUser(token: string): Promise<void | string> {
        const payload: IPayload = <IPayload> jwt.verify(token, config.ServerConfig.tokenSecret);
        const user = await this.m.findById(payload.id).exec();
        if (!user ||
            !user.tokens ||
            user.tokens.activationToken !== token ||
            payload.purpose !== tokenPurposes.userActivation) {
            return Promise.reject(userMessages.invalidToken);
        }
        user.tokens.activationToken = undefined;
        await user.save();
    }

    public static async generateActivationRequest(email: string) {
        const userInstance = await this.m.findOne({email}).exec();
        if (!userInstance) {
            return Promise.reject(userMessages.userNotFound);
        }
        if (!userInstance.tokens.activationToken) {
            return Promise.reject(userMessages.alreadyActivated);
        }
        userInstance.tokens.activationToken = new User(userInstance).generateActivationToken();
        await userInstance.save();
        mail.sendActivation(userInstance.email,
            `${config.ServerConfig.url}/user/activate/${userInstance.tokens.activationToken}`);
    }

    public static async generateResetPasswordRequest(email: string) {
        const userInstance = await this.m.findOne({email}).exec();
        if (!userInstance) {
            return Promise.reject(userMessages.userNotFound);
        }
        userInstance.tokens.resetToken = new User(userInstance).generateResetToken();
        await userInstance.save();
    }

    public static async resetPassword(token: string, newPassword: string) {
        const payload: IPayload = <IPayload> jwt.verify(token, config.ServerConfig.tokenSecret);
        const userInstance = await this.m.findById(payload.id).exec();
        if (!userInstance ||
            payload.purpose !== tokenPurposes.passwordReset ||
            userInstance.tokens.resetToken !== token) {
            return Promise.reject(userMessages.invalidToken);
        }
        userInstance.password = User.hashPassword(newPassword);
        userInstance.tokens.resetToken = undefined;
        await userInstance.save();
    }

    private static model = UserModel;

    private static hashPassword(password: string): string {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    private static validateEmail(email: string): boolean {
        return emailValidator.validate(email);
    }

    private static async isEmailTaken(email: string): Promise<boolean> {
        const userInstance = await User.m.findOne({email}).exec();
        return !!userInstance;
    }

    private instance: IUserSchema;

    constructor(instance = new UserModel()) {
        this.instance = instance;
    }

    public validatePassword(password: string): boolean {
        return bcrypt.compareSync(password, this.i.password);
    }

    public async add(email: string, password: string) {
        if (!User.validateEmail(email)) {
            return Promise.reject(userMessages.isNotValidEmail(email));
        }
        if (await User.isEmailTaken(email)) {
            return Promise.reject(userMessages.emailAlreadyTaken);
        }
        this.i.email = email;
        this.i.password = User.hashPassword(password);
        serverLog(chalk.blue(`Attempting to create new user: ${this.i.email}`));
        this.i.tokens.activationToken = this.generateActivationToken();
        await this.i.save();
        mail.sendActivation(this.i.email, `${config.ServerConfig.url}/user/activate/${this.i.tokens.activationToken}`);
    }

    public async changePassword(oldPassword: string, newPassword: string) {
        if (!this.validatePassword(oldPassword)) {
            return Promise.reject(userMessages.invalidOldPassword);
        }
        this.i.password = User.hashPassword(newPassword);
        await this.i.save();
    }

    private generateActivationToken(): string {
        return jwt.sign({id: this.i.id, purpose: tokenPurposes.userActivation}, config.ServerConfig.tokenSecret,
            {expiresIn: '1d'});
    }

    private generateResetToken(): string {
        return jwt.sign({id: this.i.id, purpose: tokenPurposes.passwordReset}, config.ServerConfig.tokenSecret,
            {expiresIn: '1h'});
    }
}

export default User;
