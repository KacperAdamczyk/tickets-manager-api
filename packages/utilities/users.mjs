import { connect } from '@be/server/src/config/database';
import { User } from '@be/server/src/modules/user/user.model';

const Users = [
  {
    email: 'admin@be.dd',
    password: '$2b$10$5L1EDoM1qltrsJQ1lIS64OS4mB7uKWOboiRWwCyv4ufPeQJsajGZ6', // 123
    admin: true,
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    email: 'user@be.dd',
    password: '$2b$10$5L1EDoM1qltrsJQ1lIS64OS4mB7uKWOboiRWwCyv4ufPeQJsajGZ6', // 123
    admin: false,
    firstName: 'Johnny',
    lastName: 'Doe',
  },
  {
    email: 'user2@be.dd',
    password: '$2b$10$5L1EDoM1qltrsJQ1lIS64OS4mB7uKWOboiRWwCyv4ufPeQJsajGZ6', // 123
    admin: false,
    firstName: 'Johnny2',
    lastName: 'Doe',
  },
];

const insertToDb = async ([users]) => {
  try {
    await User.collection.drop();
  } catch (error) {
    if (error.code === 26) console.log('Users collection does not exist');
  }
  try {
    await User.bulkWrite(
      users.map(user => ({
        insertOne: {
          document: user,
        },
      })),
    );
  } catch (error) {
    console.log(error);
  }
};

const load = async () => Promise.all([
  Promise.resolve(Users),
  connect(),
]).then(insertToDb);

export {
  load,
};
