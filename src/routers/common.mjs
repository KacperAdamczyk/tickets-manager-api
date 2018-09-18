import chalk from 'chalk';

import { generalMessages, userMessages } from '../messages';

function serverLog(...args) {
    console.log(...args);
}

function getErr(pr) {
    return pr.catch((err) => {
        serverLog(chalk.red(JSON.stringify(err)));
        return Promise.reject(err.success !== undefined ? err : generalMessages.internalError);
    });
}

function isAuthenticated(req, res, next) {
    if (!(req.session && req.session.passport)) {
        res.status(401).send({success: false, message: 'User not authenticated'});
    } else {
        next();
    }
}

function requireFrom(obj, props) {
    const keys = Object.keys(obj);
    return props.every((value) => keys.includes(value));
}

function requireFromBody(props) {
    return (req, res, next) => {
        const requirementsMet = requireFrom(req.body, props);
        if (requirementsMet) {
            next();
        } else {
            res.status(400).send({success: false, message: `Provide ${props} in request body`});
        }
    };
}

function requireSession(req, res, next) {
    const requirementsMet = requireFrom(req, ['session']);
    if (requirementsMet) {
        next();
    } else {
        res.status(400).send(userMessages.userNotAuthenticated);
    }
}

const reqRequire = {
    body: requireFromBody,
    session: requireSession
};

export {
    serverLog,
    getErr,
    isAuthenticated,
    reqRequire,
};
