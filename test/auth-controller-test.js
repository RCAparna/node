const mongoose = require('mongoose');
const expect = require('chai').expect;
const sinon = require('sinon');
const jasonWebToken = require('jsonwebtoken');
const SERVER_MESSAGES = require('../constants/server.constants')
const User = require('../models/user');
const authController = require('../controllers/authentication-controller');
const atlastURITest = 'mongodb+srv://aparna-node-poc:mongopassword@cluster0.hdtif.mongodb.net/nodeDBTest'
describe('Testing authentication Controller', function () {
    before(function (done) {
        mongoose
            .connect(atlastURITest, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            }
            )
            .then(res => {
                const user = new User({
                    username: 'tester',
                    password: 'nodetest',
                    email: 'Testing@test.com',
                    transactions: [],
                    _id: '60ac9e319cba5d038811d2e2'
                });
                return user.save();
            })
            .then(() => {
                done();
            });
    });

    beforeEach(function () { });
    afterEach(function () { });

    it('should fail if DB not accessible', function (done) {
        sinon.stub(User, 'findOne');
        User.findOne.throws();
        const req = {
            body: {
                email: 'Testing@test.com',
                password: 'nodetest'
            }
        };
        authController.login(req, {}, () => { }).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
        });

        authController.register(req, {}, () => { }).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            done();
        })
        User.findOne.restore();
    });

    it('should fail if user exists', function () {
        const req = { userId: '60ac9e319cba5d038811d2e2' };
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                this.userStatus = data.status;
            }
        };

    });

    it('should register new user successfully', function () {
        const req = {
            body: {
                username: 'tester',
                password: 'nodetest',
                email: 'Testing@test.com'
            }
        };

        authController.register(req, {}, () => { }).then(result => {
            expect(result).to.have.property('email');
            expect(result.transactions).to.have.length(1);
            done();
        });


    });


    it('should return successfull user login ', function () {
        let user = {
            _id: '60ac9e319cba5d038811d2e2',
            email: 'Testing@test.com'
        };
        const req = {
            body: {
                password: 'nodetest',
                email: 'Testing@test.com'
            }
        };
        let loadedUser = user;
        expect(loadedUser).to.be.equal(user);
        authController.login(req, {}, () => { }).then(result => {
            expect(result).not.to.be.an('error');
            expect(result).to.have.property('statusCode', 200);
        });
    });

  

    after(function (done) {
        User.deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            });
    });
});




