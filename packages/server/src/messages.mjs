const generalMessages = {
    success: {
        success: true,
    },
    fail: {
        success: false,
    },
    internalError: {
        success: false,
        message: 'Internal server error',
        code: 0,
    },
};

const userMessages = {
    userNotAuthenticated: {
        success: false,
        message: 'User not authenticated',
        code: 1,
    },
    userNotFound: {
        success: false,
        message: 'User not found',
        code: 2,
    },
    invalidEmailAndOrPassword: {
        success: false,
        message: 'Invalid e-mail address and/or password',
        code: 3,
    },
    invalidOldAndOrNewPassword: {
        success: false,
        message: 'Invalid old password and/or new password',
        code: 4,
    },
    invalidTokenAndOrOldPassword: {
        success: false,
        message: 'Invalid token and/or old password',
        code: 5,
    },
    invalidToken: {
        success: false,
        message: 'Invalid token',
        code: 6,
    },
    isNotValidEmail(email) {
        return {
            success: false,
            message: `${email} is not valid e-mail address`,
            code: 7,
        };
    },
    invalidOldPassword: {
        success: false,
        message: 'Invalid old password',
        code: 8,
    },
    alreadyActivated: {
        success: false,
        message: 'User already activated',
        code: 9,
    },
    emailAlreadyTaken: {
        success: false,
        message: 'Email address already taken',
        code: 10
    }
};

export {
    generalMessages,
    userMessages
};
