const userErrors = {
  notFound: {
    status: 400,
    message: 'User not found.',
  },
  emailAlreadyTaken: {
    status: 400,
    message: 'Email address is already taken.',
  },
  dailyLimitReached: {
    status: 400,
    message: 'Daily limit has been reached.',
  },
  invalidEmailAndOrPassword: {
    status: 401,
    message: 'Invalid email and/or password.',
  },
  notActivated: {
    status: 400,
    message: 'User is not activated.',
  },
  alreadyActivated: {
    status: 400,
    message: 'User has been already activated.',
  },
  invalidToken: {
    status: 400,
    message: 'Provided token is invalid.',
  },
};

const userMessages = {
  userCreated: {
    status: 201,
    message: 'User has been created.',
  },
  userActivated: {
    status: 200,
    message: 'User has been activated.',
  },
  userLoggedIn: {
    status: 200,
    message: 'User successfully authenticated.',
  },
  userLoggedOut: {
    status: 200,
    message: 'User successfully logged out.',
  },
  validToken: {
    status: 200,
    message: 'Provided token has been successfully validated.',
  },
  activationRequest: {
    status: 200,
    message: 'Activation request has been sent to provided email address.',
  },
};

export {
  userErrors,
  userMessages,
};
