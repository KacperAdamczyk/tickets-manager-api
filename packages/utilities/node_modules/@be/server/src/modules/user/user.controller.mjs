import jwt from 'jsonwebtoken';
import passport from 'passport';
import { InternalError, bindAllProps, log } from '@be/core';

import { User } from './user.model';
import { userErrors, userMessages } from './user.messages';
import { userDetails } from './user.mappers';
import { userTemplate } from './user.template';
import { userToken } from '../../config/token';
import { sendEmail } from '../../nodemailer/nodemailer';

const { TOKEN_SECRET, APP_URL } = process.env;

class UserController {
  generateTokenFactory({ purpose, expiresIn, dailyLimit }) {
    return async (req, res) => {
      const { user } = res.locals;

      res.locals.token = await user.generateToken(purpose, expiresIn, dailyLimit);
    };
  }

  async generateActivationToken(req, res, next) {
    await this.generateTokenFactory(userToken.activation)(req, res);

    next();
  }

  async generatePasswordResetToken(req, res, next) {
    try {
      await this.generateTokenFactory(userToken.passwordReset)(req, res);
    } catch (error) {
      log.errorObj(error);

      next();
    }
  }

  async createUser(req, res, next) {
    res.locals.user = await User.add(req.body);

    next();
  }

  inactivatedOnly(req, res, next) {
    const { user } = res.locals;

    if (user.activated) {
      throw new InternalError(userErrors.alreadyActivated);
    }

    next();
  }

  async activateUser(req, res, next) {
    const { token } = req.params;
    const { tokenPayload, user } = res.locals;

    const isUserActivated = await user.activateUser(token, tokenPayload);

    if (!isUserActivated) {
      throw new InternalError(userErrors.invalidToken);
    }

    next();
  }

  async changePassword(req, res, next) {
    const { user, body: { oldPassword, password } } = req;

    await user.changePassword(oldPassword, password);

    next();
  }

  populateTokenPayload(req, res, next) {
    const { token } = req.params;

    res.locals.tokenPayload = jwt.verify(token, TOKEN_SECRET);

    next();
  }

  populateTokenPayloadSafe(req, res, next) {
    try {
      this.populateTokenPayload(req, res, next);
    } catch (error) {
      log.errorObj(error);

      res.locals.tokenPayload = {};
    }

    next();
  }

  async validateTokenPayload(req, res, next) {
    const { token, purpose: expectedPurpose } = req.params;
    const { tokenPayload } = res.locals;
    const { purpose } = tokenPayload;

    const isTokenValid = await User.validateToken(token, tokenPayload);

    res.locals.valid = isTokenValid && purpose === (expectedPurpose || purpose);

    next();
  }

  async sendActivationEmail(req, res, next) {
    const { user, token } = res.locals;
    const link = `${APP_URL}/activate/${token}`;

    await sendEmail(user.email, userTemplate.activation, { link });

    next();
  }

  handleLogin(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (info) {
        return res.sendResponse(info);
      }

      req.login(user, loginError => {
        if (loginError) {
          return next(loginError);
        }

        return next();
      });
    })(req, res, next);
  }

  logout(req, res, next) {
    req.logout();

    next();
  }

  getUser(req, res) {
    const { user } = req;

    res.send(userDetails(user));
  }

  getUsers(req, res) {
    const { users } = res.locals;

    res.send(users.map(userDetails));
  }

  createUserSuccess(req, res) {
    res.sendResponse(userMessages.userCreated, { id: res.locals.user._id });
  }

  activateUserSuccess(req, res) {
    res.sendResponse(userMessages.userActivated);
  }

  changePasswordSuccess(req, res) {
    res.sendResponse(userMessages.passwordChanged);
  }

  loginSuccess(req, res) {
    res.sendResponse(userMessages.userLoggedIn, { user: userDetails(req.user) });
  }

  logoutSuccess(req, res) {
    res.sendResponse(userMessages.userLoggedOut);
  }

  validateTokenPayloadResponse(req, res) {
    const { valid } = res.locals;

    res.sendResponse(valid ? userMessages.validToken : userErrors.invalidToken, { valid });
  }

  generateActivationRequestSuccess(req, res) {
    res.sendResponse(userMessages.activationRequest);
  }

  async resetDailyLimits(req, res, next) { // TODO check if necessary
    const { id, purpose } = res.locals.tokenPayload;

    const user = await User.findById(id);
    user.tokens[purpose] = [];
    user.markModified(`tokens.${purpose}`);

    await user.save();

    next();
  }
}

const userController = bindAllProps(new UserController);

export {
  userController,
};
