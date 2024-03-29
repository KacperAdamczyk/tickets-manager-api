import { log } from '../helpers/log';

const normalizeErrorCode = code => code < 600 ? code : 404;

const errorHandler = () => (err, req, res, next) => {
  const { stack, ...details } = err;

  log.errorObj(err);
  log.error(`${stack}\n`);

  res.status(normalizeErrorCode(err.status))
    .send({
      type: err.name,
      message: err.message,
      details,
    });

  next();
};

export {
  errorHandler,
};
