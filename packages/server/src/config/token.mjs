const userToken = {
    activation: {
        purpose: 'activation',
        expiresIn: null,
        dailyLimit: Infinity,
    },
    passwordReset: {
        purpose: 'passwordReset',
        expiresIn: '1d',
        dailyLimit: 3,
    },
};

export {
    userToken,
};
