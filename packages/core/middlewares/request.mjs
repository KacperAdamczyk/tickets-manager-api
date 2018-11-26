import { applyMiddlewareToRequest } from './applyMiddleware';

const isAdmin = req => req.user && req.user.admin;

const isAdminMiddleware = applyMiddlewareToRequest('isAdmin', isAdmin);

export {
  isAdminMiddleware,
};
