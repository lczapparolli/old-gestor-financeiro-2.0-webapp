//Libs
import chai from 'chai';
//Tested component
import formatPeriod from '../FormatPeriod';

const cExpect = chai.expect;

describe('Period format helper', () => {
    it('is a function', () => {
        cExpect(formatPeriod).to.be.a('function');
    });

    it('expects a month and a year as parameters', () => {
        cExpect(() => formatPeriod()).to.throw('month required');
        cExpect(() => formatPeriod('text')).to.throw('month must be a number');
        cExpect(() => formatPeriod(13)).to.throw('month must be between 1 and 12');
        
        cExpect(() => formatPeriod(1)).to.throw('year required');
        cExpect(() => formatPeriod(1, 'test')).to.throw('year must be a number');
        
        cExpect(() => formatPeriod(1, 2019)).to.not.throw();
    });

    it('should return a number with the two values concatenated', () => {
        cExpect(formatPeriod(1, 2019)).to.be.equal(201901);
        cExpect(formatPeriod(12, 2019)).to.be.equal(201912);
        cExpect(formatPeriod(3, 1)).to.be.equal(103);
    });
});