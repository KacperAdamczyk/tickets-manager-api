import R from 'ramda';

import { objectify } from './objectify';

const parser = fields => (exclude = [R.F], include = [R.T]) => project => data => {
  const transformer = R.pipe(objectify(fields));
  const filter = R.allPass([
    R.compose(
      R.not,
      R.anyPass(exclude),
    ),
    R.allPass(include),
  ]);
  const parsed = R.pipe(
    R.map(transformer),
    R.filter(filter),
    R.project(project),
  )(data);

  return parsed;
};

export {
  parser,
};
