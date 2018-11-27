const applyMiddleware = projector => (name, func) => () => (req, res, next) => {
  const obj = projector(req, res, next);

  obj[name] = func.bind(obj, req, res);

  next();
};

const applyMiddlewareToRequest = applyMiddleware(req => req);
const applyMiddlewareToResponse = applyMiddleware((req, res) => res);

export {
  applyMiddlewareToRequest,
  applyMiddlewareToResponse,
};
