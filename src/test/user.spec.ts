import * as chai from 'chai';
import 'mocha';
import {Mockgoose} from 'mockgoose';
import {userMessages} from '../messages';

import server, {db, serverInstance, startServer} from '../../server';

process.env.NODE_ENV = 'test';

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

    after((done) => {
        serverInstance.close();
        done();
    });

    it('should create new user', (done) => {
        chai.request(server)
            .post('/user')
            .send(newUser)
            .then(res => {
                expect(res).to.have.status(201);
                done();
            });
    });

    it('should not create user with taken email', (done) => {
        chai.request(server)
            .post('/user')
            .send(newUser)
            .catch(res => {
                expect(res).to.have.status(400);
                expect(res.response.body).to.be.eql(userMessages.emailAlreadyTaken);
                done();
            });
    });
});
