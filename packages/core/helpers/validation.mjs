import Joi from 'joi';

class Validator {
    constructor() {
        this._projectors = [];
    }

    _combineProjectors(req, res) {
        return this._projectors.reduce(
            (acc, projector) => ({ ...acc, ...projector(req, res) }),
            {}
        );
    }

    project(projector) {
        this._projectors.push(projector);

        return this;
    }

    schema(schema) {
        return (req, res, next) => (
            Joi.validate(
                this._combineProjectors(req, res),
                schema,
            )
                .then(() => next(), next)
        );
    }

    get body() {
        this.project(req => req.body);

        return this;
    }
}

export {
    Validator,
};
