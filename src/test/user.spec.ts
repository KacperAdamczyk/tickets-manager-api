process.env.NODE_ENV = 'test';

import * as chai from 'chai';
import 'mocha';
import {Mockgoose} from 'mockgoose';

import server, {db, startServer} from '../../server';

const mockgoose = new Mockgoose(db.mongoose);

// noinspection TsLint
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const newUser = {
    email: 'test@user.com',
    password: 'email123'
};

const expect = chai.expect;

describe('User API', () => {
    before((done) => {
        mockgoose.prepareStorage().then(() => {
            db.connect().then(() => {
                startServer();
                done();
            });
        });
    });

    it('should create new user', () => {
        chai.request(server)
            .post('/user')
            .send(newUser)
            .then((res) => {
                expect(res).to.have.status(201);
            });
    });
});
