class InternalError extends Error {
  constructor({ message, status }) {
    super(message);

    this.name = Object.getPrototypeOf(this).constructor.name;
    this.status = status;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InternalError);
    }
  }
}

export {
  InternalError,
};
