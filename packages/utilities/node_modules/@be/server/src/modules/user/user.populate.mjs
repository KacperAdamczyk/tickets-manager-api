import {
  InternalError, enhance, asyncSandbox, onlyErrorNextMiddleware,
} from '@be/core';

import { User } from './user.model';
import { userErrors } from './user.messages';

class UserPopulate {
  _populate(query) {
    return asyncSandbox(
      async () => {
        const user = await User.findOne(query);

        if (!user) {
          throw new InternalError(userErrors.notFound);
        }

        return user;
      },
    );
  }

  async populate(req, res, next, id) {
    res.locals.user = await this._populate({ _id: id })(req, res, onlyErrorNextMiddleware(next));
  }

  async populateFromToken(req, res, next) {
    const { tokenPayload: { id } } = res.locals;

    res.locals.user = await this._populate({ _id: id })(req, res, onlyErrorNextMiddleware(next));

    next();
  }

  async populateFromEmail(req, res, next) {
    const { email } = req.params;

    res.locals.user = await this._populate({ email })(req, res, onlyErrorNextMiddleware(next));

    next();
  }

  async populateAll(req, res) {
    res.locals.users = await User.find({
      admin: false,
    });
  }
}

const userPopulate = new (
  enhance([
    'populate',
    'populateAll',
  ])(UserPopulate)
);

export {
  userPopulate,
};
