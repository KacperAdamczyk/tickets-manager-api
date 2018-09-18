import { User } from './user.model';
import { InternalError } from '../../helpers/InternalError';
import { userErrors } from './user.messages';
import { bindAllProps } from '../../helpers/enhancers';
import { asyncSandbox } from '../../helpers/sandbox';

class UserPopulate {
    async _populate(query) {
        return await asyncSandbox(
            async () => {
                const [user] = await User.find(query).limit(1);

                if (!user) {
                    throw new InternalError(userErrors.notFound);
                }

                return user;
            }
        );
    }

    async populate(req, res, id) {
        res.locals.user = await this._populate({ _id: id});
    }

    async populateFromToken(req, res, next) {
        const { tokenPayload: { id } } = res.locals;

        res.locals.user = await this._populate({ _id: id});

        next();
    }

    async populateFromEmail(req, res, next) {
        const { email } = req.params;

        res.locals.user = await this._populate({ email }); console.log(res.locals.user)
        next();
    }
}

const userPopulate = bindAllProps(new UserPopulate());

export {
    userPopulate,
}
