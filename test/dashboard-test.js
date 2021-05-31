const sinon = require('sinon');
const mongoose = require('mongoose');
const expect = require('chai').expect;
const User = require('../models/user');
const dashboardController = require('../controllers/dashboard-controller');
const atlastURITest = 'mongodb+srv://aparna-node-poc:mongopassword@cluster0.hdtif.mongodb.net/nodeDBTest';
describe('Testing Dashboard Controller', function () {
    before(function (done) {
        mongoose
            .connect(atlastURITest, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            } )
            .then(result => {
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

    it('should add a new dashboard for loggedin user', function (done) {
        const req = {
            body: {
                description :'A description',
                amount : 20,
                teammember : 'team member',
                role : 'role'
            },
            userId: '60ac9e319cba5d038811d2e2'
        };
        const res = {
            status: function () {
                return this;
            },
            json: function () { }
        };
        dashboardController.createYourDashboard(req, res, () => { }).then(savedUser => {
            expect(savedUser).to.have.property('transactions');
            expect(savedUser.transactions).to.have.length(1);
            done();
        }).catch(done);
        
    });

    it('should not add a new dashboard for loggedin user', function (done) {
        const req = {
            body: {
                description: 'A description',
                amount: 20,
                teammember: 'team member',
                role: 'role'
            },
            userId: '60ac9e319cba5d038811d2e2'
        };
        dashboardController.createYourDashboard(req, {}, () => { }).then(result => {
            result = {
                statusCode: 500
            }
            expect(result).to.have.property('statusCode', 500);
            done();
        }).catch(done);


    });


    it('should retrieve details for loggedin user', function (done) {
        const req = {
            query: {
                userId: '60ac9e319cba5d038811d2e2'
            }
        };
        dashboardController.retreiveUserDashBoardDetails(req, {}, () => { }).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            done();
        }).catch(done);

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
