//Libs
import chai from 'chai';
//Tested component
import formatDate, { FORMATS } from '../FormatDate';

const cExpect = chai.expect;

describe('Date format helper', () => {
    it('is a function', () => {
        cExpect(formatDate).to.be.a('function');
    });

    it('expects a date or a number as a format', () => {
        cExpect(() => formatDate()).to.throw('date required');
        cExpect(() => formatDate('abc')).to.throw('value must be a date');
        cExpect(() => formatDate(false)).to.throw('value must be a date');
        cExpect(() => formatDate({})).to.throw('value must be a date');
        cExpect(() => formatDate('19-05-01')).to.throw('value must be a date');
        cExpect(() => formatDate('2019-12-32')).to.throw('value must be a date');
        
        cExpect(() => formatDate(Date.now())).to.not.throw();
        cExpect(() => formatDate(1)).to.not.throw();
        //YYYY-MM-DD format
        cExpect(() => formatDate('2019-05-01')).to.not.throw();
        cExpect(() => formatDate('2019-02-29')).to.not.throw();
    });

    it('returns the date accordding the format informed', () => {
        //DD/MM/YYYY format
        cExpect(formatDate('2019-05-01', FORMATS.DDMMYYYY_FORMAT)).to.be.equal('01/05/2019'); 
        cExpect(formatDate(new Date(1556668800000), FORMATS.DDMMYYYY_FORMAT)).to.be.equal('01/05/2019');
        cExpect(formatDate(1556668800000, FORMATS.DDMMYYYY_FORMAT)).to.be.equal('01/05/2019'); 
        cExpect(formatDate('2020-02-29', FORMATS.DDMMYYYY_FORMAT)).to.be.equal('29/02/2020');
        //Date is invalid but is converted to next valid day
        cExpect(formatDate('2019-02-29', FORMATS.DDMMYYYY_FORMAT)).to.be.equal('01/03/2019');

        //YYYY-MM-DD format
        cExpect(formatDate('2019-05-01', FORMATS.YYYYMMDD_FORMAT)).to.be.equal('2019-05-01'); 
        cExpect(formatDate(new Date(1556668800000), FORMATS.YYYYMMDD_FORMAT)).to.be.equal('2019-05-01');
        cExpect(formatDate(1556668800000, FORMATS.YYYYMMDD_FORMAT)).to.be.equal('2019-05-01'); 
        cExpect(formatDate('2020-02-29', FORMATS.YYYYMMDD_FORMAT)).to.be.equal('2020-02-29');
        //Date is invalid but is converted to next valid day
        cExpect(formatDate('2019-02-29', FORMATS.YYYYMMDD_FORMAT)).to.be.equal('2019-03-01');
    });

    it('returns the date in format DD/MM/YYYY by default', () => {
        cExpect(formatDate('2019-05-01')).to.be.equal('01/05/2019'); 
    });
});