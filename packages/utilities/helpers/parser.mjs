import {
  pipe,
  allPass,
  anyPass,
  compose,
  not,
  map,
  filter,
  project,
  F,
  T,
} from 'ramda';

import { objectify } from './objectify';

const parser = fields => (exclude = [F], include = [T]) => projectFn => data => {
  const transformer = pipe(objectify(fields));
  const filterFn = allPass([
    compose(
      not,
      anyPass(exclude),
    ),
    allPass(include),
  ]);
  const parsed = pipe(
    map(transformer),
    filter(filterFn),
    project(projectFn),
  )(data);

  return parsed;
};

export {
  parser,
};
