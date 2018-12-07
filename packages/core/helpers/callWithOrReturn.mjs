const callWithOrReturn = (maybeFunction, data) => (
  maybeFunction instanceof Function ? maybeFunction(data) : maybeFunction
);

export {
  callWithOrReturn,
};
