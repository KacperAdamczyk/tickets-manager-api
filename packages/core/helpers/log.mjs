import chalk from 'chalk';

import { arrayify } from './array';

const logFactory = (
  (...params) => (
    (...args) => (
      console.log(
        args.reduce(
          (acc, arg, i) => (
            acc + (i ? ' ' : '') + chalk`{${arrayify(params[i]).join('.')} ${arg}}`
          ),
          '',
        ),
      )
    )
  )
);

const log = {
  ok: logFactory('green'),
  warn: logFactory('yellow'),
  error: logFactory('red'),
  ERROR: logFactory(['red', 'bold']),
  ERROR_: logFactory(['red', 'bold', 'underline'], ['red', 'bold']),
  errorObj(err) {
    this.ERROR_(`\n${err.name}:`, `${err.message}\n`);
  },
  info: logFactory('blue'),
  custom: logFactory,
};

export {
  log,
};
