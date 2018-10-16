const userErrors = {
    notFound: {
        code: 400,
        message: 'User not found.',
    },
    dailyLimitReached: {
        code: 400,
        message: 'Daily limit has been reached.',
    },
    invalidEmailAndOrPassword: {
        code: 400,
        message: 'Invalid email and/or password.',
    },
    notActivated: {
        code: 400,
        message: 'User is not activated.'
    },
    alreadyActivated: {
        code: 400,
        message: 'User has been already activated.'
    },
    invalidToken: {
        code: 400,
        message: 'Provided token is invalid.'
    }
};

const userMessages = {
    userCreated: {
        code: 201,
        message: 'User has been successfully created.',
    },
    userActivated: {
        code: 200,
        message: 'User has been successfully activated.',
    },
    userLoggedIn: {
        code: 200,
        message: 'User successfully authenticated.',
    },
    validToken: {
        code: 200,
        message: 'Provided token has been successfully validated.',
    },
    activationRequest: {
        code: 200,
        message: 'Activation request has been sent to provided email address.',
    }
};

export {
    userErrors,
    userMessages,
};
