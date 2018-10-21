import { applyMiddlewareToResponse } from './applyMiddleware';

const sendResponse = (
  (req, res, { status, message }, body = {}) => res.status(status).send({ message, ...body })
);

const sendResponseObject = applyMiddlewareToResponse('sendResponse', sendResponse);

export {
  sendResponseObject,
};
