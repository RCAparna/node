
const isAuthenticated = require('../authentication-middleware/isAuthenticated');

const jasonWebToken = require('jsonwebtoken');
const sinon = require('sinon');
const expect = require('chai').expect;

describe('Testing authorization middleware', function () {
    it('should fail if no auth-headers present', function () {
        const req = {
            get: function () {
                return null;
            }
        };
        expect(isAuthenticated.bind(this, req, {}, () => { })).to.throw(
            'Authentication Failed'
        );
    });

    it('should fail if only 1 string received', function () {
        const req = {
            get: function () {
                return 'nodetesing';
            }
        };
        expect(isAuthenticated.bind(this, req, {}, () => { })).to.throw();
    });

    it('should append userid to req after token decoding', function () {
        const req = {
            get: () => {
                return 'Bearer nodetokentesting';
            }
        };
        sinon.stub(jasonWebToken, 'verify');
        jasonWebToken.verify.returns({ userId: 'nodetest' });
        isAuthenticated(req, {}, () => { });
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'nodetest');
        expect(jasonWebToken.verify.called).to.be.true;
        jasonWebToken.verify.restore();
    });

    it('should fail if token not verified', function () {
        const req = {
            get: function () {
                return 'Bearer nodetokentesting';
            }
        };
        expect(isAuthenticated.bind(this, req, {}, () => { })).to.throw();
    });
});
