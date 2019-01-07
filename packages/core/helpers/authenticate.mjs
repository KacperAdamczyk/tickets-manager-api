import { InternalError } from './InternalError';
import { messages } from '../shared/messages';

const { SESSION_MAX_AGE } = process.env;
const maxDifference = 2;

const isSessionNewlyCreated = age => age >= +SESSION_MAX_AGE - maxDifference;

const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    const newlyCreated = isSessionNewlyCreated(req.session.cookie.maxAge);

    if (newlyCreated) {
      throw new InternalError(messages.sessionExpired);
    }

    throw new InternalError(messages.notAuthenticated);
  }

  next();
};

const isAdmin = (req, res, next) => {
  if (!req.isAdmin()) {
    throw new InternalError(messages.notAuthorized);
  }

  next();
};

export {
  isAuthenticated,
  isAdmin,
};
