import jwt from 'jsonwebtoken';
import passport from 'passport';
import { InternalError, enhance, log } from '@be/core';

import { User } from './user.model';
import { userErrors, userMessages } from './user.messages';
import { userDetails } from './user.mappers';

import { userToken } from '../../config/token';

const { TOKEN_SECRET } = process.env;

class UserController {
  generateTokenFactory({ purpose, expiresIn, dailyLimit }) {
    return async (req, res) => {
      const { user } = res.locals;

      res.locals.token = await user.generateToken(purpose, expiresIn, dailyLimit);
    };
  }

  async generateActivationToken(req, res) {
    return this.generateTokenFactory(userToken.activation)(req, res);
  }

  generatePasswordResetToken(req, res, next) {
    try {
      this.generateTokenFactory(userToken.passwordReset)(req, res, next);
    } catch (error) {
      log.errorObj(error);
      next();
    }
  }

  async populateUser(req, res, id) {
    const user = await User.findById(id);

    if (!user) {
      throw new InternalError(userErrors.notFound);
    }

    res.locals.user = user;
  }

  async createUser(req, res) {
    res.locals.user = await User.add(req.body);
  }

  inactivatedOnly(req, res, next) {
    const { user } = res.locals; console.log(res.locals.user);

    if (user.activated) {
      throw new InternalError(userErrors.alreadyActivated);
    }

    next();
  }

  async activateUser(req, res) {
    const { token } = req.params;
    const { tokenPayload, user } = res.locals;

    const isUserActivated = await user.activateUser(token, tokenPayload);

    if (!isUserActivated) {
      throw new InternalError(userErrors.invalidToken);
    }
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
      res.locals.tokenPayload = {};
      next();
    }
  }

  async validateTokenPayload(req, res) {
    const { token, purpose: expectedPurpose } = req.params;
    const { tokenPayload } = res.locals;
    const { purpose } = tokenPayload;

    const isTokenValid = await User.validateToken(token, tokenPayload);

    res.locals.valid = isTokenValid && purpose === (expectedPurpose || purpose);
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

  getUser(req, res) {
    const { user } = req;

    res.send(userDetails(user));
  }

  createUserSuccess(req, res) {
    res.sendResponse(userMessages.userCreated, { id: res.locals.user._id });
  }

  activateUserSuccess(req, res) {
    res.sendResponse(userMessages.userActivated);
  }

  loginSuccess(req, res) {
    res.sendResponse(userMessages.userLoggedIn, { user: userDetails(req.user) });
  }

  validateTokenPayloadResponse(req, res) {
    const { valid } = res.locals;

    if (valid) {
      res.sendResponse(userMessages.validToken, { valid });
    } else {
      res.sendResponse(userErrors.invalidToken, { valid });
    }
  }

  generateActivationRequestSuccess(req, res) {
    res.sendResponse(userMessages.activationRequest);
  }

  async resetDailyLimits(req, res) { // TODO check if necessary
    const { id, purpose } = res.locals.tokenPayload;

    const user = await User.findById(id);
    user.tokens[purpose] = [];
    user.markModified(`tokens.${purpose}`);

    await user.save();
  }
}

const userController = new (
  enhance([
    'createUser',
    'activateUser',
    'generateActivationToken',
    'validateTokenPayload',
    'resetDailyLimits',
  ])(UserController)
);

export {
  userController,
};
