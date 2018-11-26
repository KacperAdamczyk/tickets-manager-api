const messages = {
  notAuthenticated: {
    status: 401,
    message: 'User not authenticated.',
  },
  notAuthorized: {
    status: 403,
    message: 'User not authorized.',
  },
  sessionExpired: {
    status: 440,
    message: 'Session has expired.',
  },
};

export {
  messages,
};
