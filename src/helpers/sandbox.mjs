const asyncSandbox = func => async (req, res, next, ...params) => {
    try {
        const value = await func(req, res, ...params);

        next();

        return value;
    } catch (error) {
        next(error);
    }
};

export {
    asyncSandbox,
};
