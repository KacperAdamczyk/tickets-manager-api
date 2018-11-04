const objectify = keys => values => (
  keys.reduce((obj, key, i) => ({ ...obj, [key]: values[i] }), {})
);

export {
  objectify,
};
