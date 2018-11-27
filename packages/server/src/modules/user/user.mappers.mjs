import { pick } from 'ramda';

const userDetails = pick([
  '_id',
  'admin',
  'email',
  'firstName',
  'lastName',
]);

export {
  userDetails,
};
