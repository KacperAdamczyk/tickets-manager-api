import * as mongoose from "mongoose";
import chalk from 'chalk';

export abstract class SchemaOperations<T extends mongoose.Document> {
    protected readonly instance: T;
    constructor(instance: T) {
        this.instance = instance;
    }
    protected static _wrap<T extends mongoose.Document, R>(pr: Promise<T | null>, Wrapper: any, err: string): Promise<R> {
        return pr.then(instance => {
            if (!instance) {
                throw err;
            }
            return new Wrapper(instance);
        });
    }
    protected static _findById<T extends mongoose.Document>(model: mongoose.Model<T>, id: string): Promise<T | null> {
        return model.findById(id).exec();
    }
    protected static _findOne<T extends mongoose.Document>(model: mongoose.Model<T>, query: object): Promise<T | null> {
        return model.findOne(query).exec();
    }
}

export function validator(throwError: boolean = false) {
    return function(constructor: any) {
        let first = true;
        let methodError = (name: string) => `Missing method ${chalk.underline(name)} on class ${chalk.underline(constructor.name)}`;
        let propertyError = (name: string) => `Missing property ${chalk.underline(name)} on class ${chalk.underline(constructor.name)}`;
        if (Object.getPrototypeOf(constructor) !== SchemaOperations) {
            line();
            console.log(chalk.red(`Class ${chalk.underline(constructor.name)} does not inherits from class ${chalk.underline(SchemaOperations.prototype.constructor.name)}`))
        }
        if (!constructor.model) {
            line();
            console.log(chalk.red(propertyError('model')))
        }
        if (!constructor.wrap) {
            line();
            console.log(chalk.red(methodError('wrap')))
        }
        if (!constructor.findById) {
            line();
            console.log(chalk.red(methodError('findById')))
        }
        if (!constructor.findOne) {
            line();
            console.log(chalk.red(methodError('findOne')))
        }
        if(!first) {
            console.log('\n');
           dot(100);
        }
        function line() {
            if (first) {
                first = false;
                console.log('\n');
                dot(100);
                console.log(chalk.blue('Schema class implementation validator\n'));
                if(throwError)
                    throw 'Schema class validation error';
            }
        }
        function dot(n: number) {
            let str ='';
            for (let i = 0; i < n; i++) {
                str += '*';
            }
            console.log(chalk.bgBlue(chalk.red(str)));
        }
    }
}