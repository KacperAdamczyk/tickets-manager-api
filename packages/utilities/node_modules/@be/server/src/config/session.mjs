import mongoose from 'mongoose';

const { SESSION_SECRET, SESSION_MAX_AGE } = process.env;

const sessionConfig = MongoStore => ({
  resave: true,
  saveUninitialized: false,
  secret: SESSION_SECRET,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {
    maxAge: +SESSION_MAX_AGE,
  },
});

export {
  sessionConfig,
};
