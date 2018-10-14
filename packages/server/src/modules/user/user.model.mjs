import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import R from 'ramda';
import { appendToSize, canGenerateNewToken, InternalError } from '@be/core';

import { userSchema } from './user.model.schema';
import { userErrors } from './user.messages';

import { userToken } from '../../config/token';

const { TOKEN_SECRET } = process.env;

class User extends mongoose.Model {
    static hashPassword(password) {
        return bcrypt.hash(password, bcrypt.genSaltSync(10));
    }

    comparePassword(password) {
        return bcrypt.compare(password, this.password);
    }

    static async add(email, password) {
        const hashedPassword = await this.hashPassword(password);

        return this.create({ email, password: hashedPassword });
    }

    async generateToken(purpose, expiresIn, dailyLimit) {
        const tokenPayload = { id: this._id, purpose };
        const tokenOptions = expiresIn ? { expiresIn } : {};
        const previousTokens = this.tokens[purpose];
        const isLimitReached = !canGenerateNewToken(previousTokens, dailyLimit);

        if (isLimitReached) {
            throw new InternalError(userErrors.dailyLimitReached);
        }

        const token = jwt.sign(tokenPayload, TOKEN_SECRET, tokenOptions);

        this.tokens[purpose] = appendToSize(previousTokens, token, dailyLimit);
        this.markModified(`tokens.${purpose}`);

        await this.save();

        return token;
    }

    isActivated() {
        return !this.tokens.activation.length;
    }

    async activateUser(token, { id, purpose }) {
        const activationPurpose = userToken.activation.purpose;
        const activationToken = R.last(this.tokens[activationPurpose]);

        if (token !== activationToken && purpose !== activationPurpose) {
            return false;
        }

        this.tokens[activationPurpose] = [];
        this.markModified(`tokens.${activationPurpose}`);

        await this.save();

        return true;
    }

    static async validateToken(token, { id, purpose }) {
        const user = await this.findById(id);

        return !!user && R.last(user.tokens[purpose]) === token;
    }
}

const UserModel = mongoose.model(User, userSchema);

export {
    UserModel as User,
};
