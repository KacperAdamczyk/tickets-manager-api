import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { last } from 'ramda';
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

  static async isEmailAvailable(email) {
    return !(await this.find({ email })).length;
  }

  static async add({ password, ...user }) {
    const hashedPassword = await this.hashPassword(password);

    if (!(await this.isEmailAvailable(user.email))) {
      throw new InternalError(userErrors.emailAlreadyTaken);
    }

    return this.create({ ...user, password: hashedPassword });
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

  get activated() {
    return !this.tokens.activation.length;
  }

  async activateUser(token, { purpose }) {
    const activationPurpose = userToken.activation.purpose;
    const activationToken = last(this.tokens[activationPurpose]);

    if (token !== activationToken && purpose !== activationPurpose) {
      return false;
    }

    this.tokens[activationPurpose] = [];
    this.markModified(`tokens.${activationPurpose}`);

    await this.save();

    return true;
  }

  async changePassword(oldPassword, newPassword) {
    if (!await this.comparePassword(oldPassword)) {
      throw new InternalError(userErrors.oldPasswordDoesNotMatch);
    }

    this.password = await User.hashPassword(newPassword);

    await this.save();
  }

  async resetPassword(token, purpose, newPassword) {
    const passwordResetPurpose = userToken.passwordReset.purpose;
    const passwordResetToken = last(this.tokens[passwordResetPurpose]);

    if (token !== passwordResetToken && purpose !== passwordResetPurpose) {
      return false;
    }

    this.tokens[passwordResetPurpose] = [];
    this.markModified(`tokens.${passwordResetPurpose}`);

    this.password = await User.hashPassword(newPassword);

    await this.save();
  }

  static async validateToken(token, { id, purpose }) {
    const user = await this.findById(id);

    return !!user && last(user.tokens[purpose]) === token;
  }
}

const UserModel = mongoose.model(User, userSchema);

export {
  UserModel as User,
};
