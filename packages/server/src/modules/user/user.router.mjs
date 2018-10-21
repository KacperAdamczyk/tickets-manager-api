import express from 'express';
import { isAuthenticated } from '@be/core';

import { userController } from './user.controller';
import { userValidation } from './user.validation';
import { userPopulate } from './user.populate';

const router = express.Router();

router.param(
  'id',
  userPopulate.populate,
);

router.post(
  '/login',
  userController.handleLogin,
  userController.loginSuccess,
);

router.post(
  '/',
  userValidation.createUser,
  userController.createUser,
  userController.generateActivationToken,
  userController.createUserSuccess,
);

router.get(
  '/',
  isAuthenticated,
  userController.getUser,
);

router.put(
  '/activate/request/:email',
  userPopulate.populateFromEmail,
  userController.inactivatedOnly,
  userController.generateActivationToken,
  userController.generateActivationRequestSuccess,
);

router.put(
  '/activate/:token',
  userController.populateTokenPayload,
  userController.validateTokenPayload,
  userPopulate.populateFromToken,
  userController.inactivatedOnly,
  userController.activateUser,
  userController.activateUserSuccess,
);

router.get(
  '/validate-token/:purpose/:token',
  userController.populateTokenPayload,
  userController.validateTokenPayload,
  userController.validateTokenPayloadSuccess,
);

export {
  router as userRouter,
};
