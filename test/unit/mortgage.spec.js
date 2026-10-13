const expect = require('chai').expect;
const Mortgage = require('../../src/js/lib/mortgage');

describe('Mortgage Calculator', () => {
    let mortgage = null;

    beforeEach(() => { // beforeEach(...) is a Mocha hook that runs before every single it()
        mortgage = new Mortgage(200000, 5, 30, 12);
    });

    it('should create a Mortgage instance', () => {
        expect(mortgage).to.exist;
    });

    it('should have a monthlyPayment function', () => {
        expect(mortgage.monthlyPayment()).to.exist;
    });    

    it('should return a value when monthlyPayment is called with valid inputs', () => {
        const payment = mortgage.monthlyPayment();
        expect(payment).to.exist;
        expect(parseFloat(payment)).to.be.a('number');
        expect(parseFloat(payment)).to.be.above(0);    
    });

    it('should calculate the correct monthly payment for known values', () => {
        expect(mortgage.monthlyPayment()).to.equal('1073.64');
    });    
});