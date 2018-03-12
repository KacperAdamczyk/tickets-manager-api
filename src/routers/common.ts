import chalk from 'chalk';
import * as express from 'express';

import {generalMessages, userMessages} from '../messages';

function getErr(pr: Promise<any>): Promise<any> {
    return pr.catch((err) => {
        console.log(chalk.red(JSON.stringify(err)));
        return Promise.reject(err.success !== undefined ? err : generalMessages.internalError);
    });
}

function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!(req.session && req.session.passport)) {
        res.status(401).send({success: false, message: 'User not authenticated'});
    } else {
        next();
    }
}

function requireFrom(obj: object, props: string[]) {
    const keys = Object.keys(obj);
    return props.every((value) => keys.includes(value));
}

function requireFromBody(props: string[]) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const requirementsMet = requireFrom(req.body, props);
        if (requirementsMet) {
            next();
        } else {
            res.status(400).send({succes: false, message: `Provide ${props} in request body`});
        }
    };
}

function requireSession(req: express.Request, res: express.Response, next: express.NextFunction) {
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

interface IReqWithSession extends express.Request {
    session: any;
}

export {
    getErr,
    isAuthenticated,
    reqRequire,
    IReqWithSession
};
