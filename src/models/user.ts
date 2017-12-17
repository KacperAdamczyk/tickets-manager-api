import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as emailValidator from 'email-validator';
import chalk from 'chalk';
import * as mail from '../nodemailer-config';

import config from '../config';

enum tokenPurposes {
    userActivation,
    passwordReset
};

interface Payload {
    id: string;
    purpose: tokenPurposes;
}

interface ITokens {
    activationToken?: string;
    resetToken?: string;
}

interface IDetails {
    firstName: string;
    lastName: string;
}

interface IUserClass {
    email: string;
    password: string;
    admin: boolean;
    tokens: ITokens;
    details?: IDetails;
}

interface IUser extends IUserClass, mongoose.Document {}

/* Schema */
const userSchema: mongoose.Schema = new mongoose.Schema({
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

/* Validators */
userSchema.path('email').validate((email: string) => emailValidator.validate(email), '{VALUE} is not a valid e-mail address.');

const UserModel: mongoose.Model<IUser> = mongoose.model<IUser>('User', userSchema);

/* Class */

abstract class MongooseOperations {
    static findById<T extends mongoose.Document>(model: mongoose.Model<T>, id: string): Promise<T | null> {
        return model.findById(id).exec();
    }
    static findOne<T extends mongoose.Document>(model: mongoose.Model<T>, query: object): Promise<T | null> {
        return model.findOne(query).exec();
    }
}


export class User implements IUserClass {
    static readonly model = UserModel;
    readonly instance: IUser;
    get id() { return this.instance.id; };
    get email() { return this.instance.email; };
    set email(v: string) { this.instance.email = v; }
    get password(): string { return this.instance.password; };
    set password(v: string) { this.instance.password = User.hashPassword(v); };
    get admin() { return this.instance.admin; }
    set admin(v: boolean) { this.instance.admin = v; }
    get tokens(): ITokens { return this.instance.tokens };
    set tokens(v: ITokens) { this.instance.tokens = v; }


    constructor(instance: IUser = new User.model()) {
        this.instance = instance;
    }

    private static wrap(pr: Promise<IUser | null>): Promise<User> {
        return pr.then(user => {
            if (!user) {
                throw 'User not found';
            }
            return new User(user);
        });
    }

    static findById(id: string): Promise<User> {
        return User.wrap(MongooseOperations.findById(this.model, id));
    }

    static findOne(query: object): Promise<User> {
        return User.wrap(MongooseOperations.findOne(this.model, query));
    }

    async add(email: string, password: string) {
        this.email = email;
        this.password = password;
        this.tokens = {};
        console.log(chalk.blue(`Attempting to create new user: ${this.email}`));
        this.tokens.activationToken = this.generateActivationToken();
        try {
            await this.instance.save();
        } catch (err) {
            console.log(chalk.red(err.message));
            throw err.message;
        }
        console.log(chalk.green('Success'));
        mail.sendActivation(this.email, `${config.url}/user/activate/${this.tokens.activationToken}`);
    }
    validatePassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }
    static hashPassword(password: string): string {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }
    generateActivationToken(): string {
        return jwt.sign({ id: this.id, purpose: tokenPurposes.userActivation }, config.tokenSecret, { expiresIn: '1d' });
    }
    generateResetToken(): string {
        return jwt.sign({ id: this.id, purpose: tokenPurposes.passwordReset }, config.tokenSecret, { expiresIn: '1h' });
    }
    static async activateUser(token: string): Promise<void | string> {
            try {
                const payload: Payload = <Payload>jwt.verify(token, config.tokenSecret);
                const user = await this.findById(payload.id);
                if (payload.purpose !== tokenPurposes.userActivation ||
                    user.tokens.activationToken !== token) {
                    throw 'Invalid token';
                }
                user.tokens.activationToken = undefined;
                await user.instance.save();
            } catch (err) {
                console.log(chalk.red(err));
                throw err;
            }
    }
    async changePassword(oldPassowrd: string, newPassword: string) {
            try{
                if (!this.validatePassword(oldPassowrd)) {
                    throw 'Old password is not correct';
                }
                this.password = newPassword;
                await this.instance.save();
            } catch (err) {
                console.log(chalk.red(err));
                throw err;
            }
    }

    static async generateResetPasswordRequest(email: string) {
        try {
            const user = await this.findOne({ email });
            user.tokens.resetToken = user.generateResetToken();
            await user.instance.save();
        } catch (err) {
            console.log(chalk.red(err));
            throw err;
        }
    }
    static async resetPassword(token: string, newPassword: string) {
        try {
            const payload: Payload = <Payload>jwt.verify(token, config.tokenSecret);
            const user = await this.findById(payload.id);
            if (payload.purpose !== tokenPurposes.passwordReset ||
                user.tokens.resetToken !== token) {
                throw 'Invalid token';
            }
            user.password = newPassword;
            user.tokens.resetToken = undefined;
            await user.instance.save();
        } catch (err) {
            console.log(chalk.red(err));
            throw err;
        }
    }
}



