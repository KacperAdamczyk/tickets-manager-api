import {
  InternalError, bindAllProps,
} from '@be/core';

import { User } from './user.model';
import { userErrors } from './user.messages';

class UserPopulate {
  async _populate(query) {
    const user = await User.findOne(query);

    if (!user) {
      throw new InternalError(userErrors.notFound);
    }

    return user;
  }

  async populate(req, res, next, id) {
    res.locals.user = await this._populate({ _id: id });

    next();
  }

  async populateFromToken(req, res, next) {
    const { tokenPayload: { id } } = res.locals;

    res.locals.user = await this._populate({ _id: id });

    next();
  }

  async populateFromEmail(req, res, next) {
    const { email } = req.params;

    res.locals.user = await this._populate({ email });

    next();
  }

  async populateAll(req, res, next) {
    res.locals.users = await User.find({
      admin: false,
    });

    next();
  }
}

const userPopulate = bindAllProps(new UserPopulate);

export {
  userPopulate,
};
