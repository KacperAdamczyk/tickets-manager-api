import express from 'express';

import { userRouter } from '../modules/user/user.router';

const mainRouter = express.Router();
const subRouter = express.Router();

mainRouter.use('/api', subRouter);

subRouter.use('/users', userRouter);

export {
  mainRouter as router,
};
