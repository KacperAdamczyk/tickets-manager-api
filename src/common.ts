import chalk from 'chalk';
import * as express from 'express';
import { messages } from './routers/user-router';

const defaultMessages = {
    success: {
        success: true,
    },
    fail: {
        success: false,
    },
    internalError: {
        success: false,
        message: 'Internal server error',
        code: 0,
    },
}

function getErr(pr: Promise<any>): Promise<any> {
    return pr.catch((err) => {
        console.log(chalk.red(JSON.stringify(err)));
        if (err.errmsg) {
            err = parseMongooseError(err);
            console.log('\n', chalk.red(JSON.stringify(err)));
        }
        return Promise.reject(err);
    });
}

function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.session || !req.session.passport) {
        res.status(401).send({ success: false, message: 'User not authenticated' });
    } else {
        next();
    }
}

function parseMongooseError(err: any) {
    switch (err.code) {
        case 11000:
            return {
                success: false,
                message: 'E-mail address already taken',
                code: err.code,
            };
        default:
            return messages.fail;
    }
}

export { getErr, isAuthenticated };
