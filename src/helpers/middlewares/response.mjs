import { applyMiddlewareToResponse } from './applyMiddleware';

const sendResponse = (
    (req, res, { code, message }, body = {}) => res.status(code).send({ ...body, message })
);

const sendResponseObject = applyMiddlewareToResponse('sendResponse', sendResponse);

export {
    sendResponseObject,
};
