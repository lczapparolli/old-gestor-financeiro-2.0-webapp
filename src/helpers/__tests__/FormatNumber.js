//Libs
import chai from 'chai';
//Tested component
import formatNumber from '../FormatNumber';

const cExpect = chai.expect;

describe('Number format helper', () => {
    it('is a function', () => {
        cExpect(formatNumber).to.be.a('function');
    });

    it('expects a number and a format destination', () => {
        cExpect(() => formatNumber()).to.throw('value required');
        cExpect(() => formatNumber('abc')).to.throw('value must be numeric');
        cExpect(() => formatNumber(123)).to.not.throw();
        cExpect(() => formatNumber('123')).to.not.throw();
    });

    it('returns a formated string with 2 decimal places and thousands separator', () => {
        //Zero
        cExpect(formatNumber(0)).to.be.equal('0,00');
        //Positive numbers
        cExpect(formatNumber(1)).to.be.equal('1,00');
        cExpect(formatNumber(1.1)).to.be.equal('1,10');
        cExpect(formatNumber(0.1)).to.be.equal('0,10');
        //Negative numbers
        cExpect(formatNumber(-1)).to.be.equal('-1,00');
        cExpect(formatNumber(-1.1)).to.be.equal('-1,10');
        cExpect(formatNumber(-0.1)).to.be.equal('-0,10');
        //Thousands
        cExpect(formatNumber(1000)).to.be.equal('1.000,00');
        cExpect(formatNumber(-1000)).to.be.equal('-1.000,00');
        //Milion
        cExpect(formatNumber(1000000)).to.be.equal('1.000.000,00');
        cExpect(formatNumber(-1000000)).to.be.equal('-1.000.000,00');
        //More decimal places
        cExpect(formatNumber(1.111)).to.be.equal('1,11');
        cExpect(formatNumber(-1.111)).to.be.equal('-1,11');
    });

    it('can include a currency symbol', () => {
        //Thousands
        cExpect(formatNumber(1000, 'R$')).to.be.equal('R$ 1.000,00');
        cExpect(formatNumber(-1000, 'R$')).to.be.equal('-R$ 1.000,00');
    });
});