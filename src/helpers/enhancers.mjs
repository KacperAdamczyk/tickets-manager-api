import R from 'ramda';
import { arrayify } from './array';
import { asyncSandbox } from './sandbox';

const bindAllProps = obj => (
    Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
        .reduce((o, prop) => (o[prop] = o[prop].bind(o), o), obj)
);

const bindSandboxToProps = R.curry(
    (props, obj) => {
        const objectProps = Object.getOwnPropertyNames(Object.getPrototypeOf(obj));
        const propsDifference = R.difference(arrayify(props), objectProps);

        if (propsDifference.length) {
            throw new Error(`Binding sandbox: "${propsDifference.join(', ')}" ` +
                `does not exist on "${obj.constructor.name}" controller.`);
        }

        return props.reduce((o, prop) => (o[prop] = asyncSandbox(o[prop]), o), obj);
    }
);

const enhance = (sandboxedProps = []) => controller => {
    return new Proxy(controller, {
        construct(target) {
            return R.compose(
                bindSandboxToProps(sandboxedProps),
                bindAllProps
            )(new target());
        }
    });
};

export {
    bindAllProps,
    enhance,
};
