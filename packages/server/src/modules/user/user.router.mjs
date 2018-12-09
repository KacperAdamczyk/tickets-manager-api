import express from 'express';
import { isAuthenticated, isAdmin } from '@be/core';

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

router.get(
  '/logout',
  userController.logout,
  userController.logoutSuccess,
);

router.post(
  '/',
  userValidation.createUser,
  userController.createUser,
  userController.generateActivationToken,
  userController.sendActivationEmail,
  userController.createUserSuccess,
);

router.get(
  '/',
  isAuthenticated,
  userController.getUser,
);

router.get(
  '/all',
  isAuthenticated,
  isAdmin,
  userPopulate.populateAll,
  userController.getUsers,
);

router.patch(
  '/password',
  isAuthenticated,
  userValidation.changePassword,
  userController.changePassword,
  userController.changePasswordSuccess,
);

router.patch(
  '/activate/request/:email',
  userPopulate.populateFromEmail,
  userController.inactivatedOnly,
  userController.generateActivationToken,
  userController.sendActivationEmail,
  userController.generateActivationRequestSuccess,
);

router.patch(
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
  userController.populateTokenPayloadSafe,
  userController.validateTokenPayload,
  userController.validateTokenPayloadResponse,
);

export {
  router as userRouter,
};
