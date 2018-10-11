class InternalError extends Error {
    constructor({ message, code }) {
        super(message);

        this.name = Object.getPrototypeOf(this).constructor.name;
        this.code = code;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InternalError);
        }
    }
}

export {
    InternalError,
};
