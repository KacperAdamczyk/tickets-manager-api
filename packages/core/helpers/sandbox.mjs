import R from 'ramda';

const asyncSandbox = func => async (req, res, next, ...params) => {
  try {
    const value = await func(req, res, ...params);

    next && next();

    return value;
  } catch (error) {
    next && next(error);
  }
};

const onlyErrorNextMiddleware = R.curry(
  (next, error) => error && next(error),
);

export {
  asyncSandbox,
  onlyErrorNextMiddleware,
};
