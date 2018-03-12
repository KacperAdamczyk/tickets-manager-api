import * as chai from 'chai';
import 'mocha';
import {Mockgoose} from 'mockgoose';

import server, {db, startServer} from '../../server';
import {userMessages} from '../messages';

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
    before(async () => {
        await mockgoose.prepareStorage();
        await db.connect();
        startServer();
    });

    beforeEach(async () => {
        await mockgoose.helper.reset();
    });

    after((done) => {
        done();
    });

    it('should create new user', async () => {
        const res = await chai.request(server).post('/user').send(newUser);
        expect(res).to.have.status(201);
    });

    it('should not create user with taken email', async () => {
        await chai.request(server).post('/user').send(newUser);
        try {
            await chai.request(server).post('/user').send(newUser);
        } catch (err) {
            expect(err).to.have.status(400);
            expect(err.response.body).to.be.eql(userMessages.emailAlreadyTaken);
        }
    });
});
