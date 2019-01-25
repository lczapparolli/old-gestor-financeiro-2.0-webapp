//Libs
import chai from 'chai';
//Tested module
import { convertToNumber, isNumeric } from '../ConvertToNumber';

const cExpect = chai.expect;

describe('Convert to Number helper', () => {
    describe('IsNumeric function', () => {
        it('is a function', () => {
            cExpect(isNumeric).to.be.a('function');
        });

        it('returns a boolean', () => {
            cExpect(isNumeric()).to.be.a('boolean');
        });

        it('returns true when the value represents a number in brazilian format', () => {
            cExpect(isNumeric()).to.be.false;
            cExpect(isNumeric('')).to.be.false;
            cExpect(isNumeric(false)).to.be.false;
            cExpect(isNumeric(true)).to.be.false;
            cExpect(isNumeric({})).to.be.false;
            cExpect(isNumeric('invalid')).to.be.false;
            cExpect(isNumeric('1.1.1')).to.be.false;
            cExpect(isNumeric('-1.1')).to.be.false;
            cExpect(isNumeric(' ')).to.be.false;

            cExpect(isNumeric(1)).to.be.true;
            cExpect(isNumeric('0')).to.be.true;
            cExpect(isNumeric('01')).to.be.true;
            cExpect(isNumeric('0,1')).to.be.true;
            cExpect(isNumeric('-1')).to.be.true;
            cExpect(isNumeric('-1,1')).to.be.true;
            cExpect(isNumeric('1.000,00')).to.be.true;
            cExpect(isNumeric('-1.000,00')).to.be.true;
        });
    });

    describe('ConvertToNumber function', () => {
        it('is a function', () => {
            cExpect(convertToNumber).to.be.a('function');
        });

        it('expects a numeric string', () => {
            cExpect(() => convertToNumber()).to.throw('Value required');
            cExpect(() => convertToNumber(true)).to.throw('Value must be a string');
            cExpect(() => convertToNumber('invalid')).to.throw('Value must be a numeric string');
            cExpect(() => convertToNumber('0')).to.not.throw();
        });

        it('returns the string converted to a number', () => {
            cExpect(convertToNumber('1')).to.be.equal(1);
            cExpect(convertToNumber('1,0')).to.be.equal(1);
            cExpect(convertToNumber('-1,0')).to.be.equal(-1);
            cExpect(convertToNumber('1000,0')).to.be.equal(1000);
            cExpect(convertToNumber('-1000,0')).to.be.equal(-1000);
            cExpect(convertToNumber('-1.000,0')).to.be.equal(-1000);
            cExpect(convertToNumber('-1.000,01')).to.be.equal(-1000.01);
        });
    });
});
