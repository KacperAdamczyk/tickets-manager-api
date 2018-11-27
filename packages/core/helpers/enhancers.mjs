/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { curry, difference, compose } from 'ramda';
import { arrayify } from './array';
import { asyncSandbox } from './sandbox';

const bindAllProps = obj => (
  Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
    .reduce((o, prop) => (o[prop] = o[prop].bind(o), o), obj));

const bindSandboxToProps = curry(
  (props, obj) => {
    const objectProps = Object.getOwnPropertyNames(Object.getPrototypeOf(obj));
    const propsDifference = difference(arrayify(props), objectProps);

    if (propsDifference.length) {
      throw new Error(`Binding sandbox: "${propsDifference.join(', ')}" `
      + `does not exist on "${obj.constructor.name}" controller.`);
    }

    return props.reduce((o, prop) => (o[prop] = asyncSandbox(o[prop]), o), obj);
  },
);

const enhance = (sandboxedProps = []) => controller => (
  new Proxy(controller, {
    construct(Target) {
      return compose(
        bindSandboxToProps(sandboxedProps),
        bindAllProps,
      )(new Target());
    },
  })
);

export {
  bindAllProps,
  enhance,
};
