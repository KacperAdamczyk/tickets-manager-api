import R from 'ramda';

const userDetails = R.pick([
  '_id',
  'admin',
  'email',
]);

export {
  userDetails,
};
