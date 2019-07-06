//Libs
import chai from 'chai';
//Tested module
import { isDate, convertToDate } from '../ConvertToDate';

const cExpect = chai.expect;

describe('Convert to date helper', () => {
    describe('IsDate function', () => {
        it('is a function', () => {
            cExpect(isDate).to.be.a('function');
        });

        it('returns a boolean', () => {
            cExpect(isDate()).to.be.a('boolean');
        });

        it('returns true when "value" is a Date object', () => {
            cExpect(isDate(new Date())).to.be.true;
        });

        it('returns true when "value" is a number', () => {
            cExpect(isDate(Date.now())).to.be.true;
            cExpect(isDate(0)).to.be.true;
            cExpect(isDate(1.5)).to.be.true;
            cExpect(isDate(-1.5)).to.be.true;
            cExpect(isDate('0')).to.be.true;
            cExpect(isDate('1,5')).to.be.true;
            cExpect(isDate('-1,5')).to.be.true;
        });

        it('returns true when "value" is a string in dd/mm/yyyy format', () => {
            cExpect(isDate('01/01/2019')).to.be.true;
            cExpect(isDate('28/02/2019')).to.be.true;
            cExpect(isDate('29/02/2020')).to.be.true;
            //Function will validate just the format
            cExpect(isDate('01/30/2019')).to.be.true;
            cExpect(isDate('01/13/2019')).to.be.true;

            cExpect(isDate('1/2/2019')).to.be.true;
            cExpect(isDate('0/0/0')).to.be.true;
            cExpect(isDate('01/02/001')).to.be.true;
            cExpect(isDate('01/02/999')).to.be.true;
        });

        it('returns true when "value" is a string in yyyy-mm-dd format', () => {
            cExpect(isDate('2019-01-01')).to.be.true;
            cExpect(isDate('2019-02-28')).to.be.true;
            cExpect(isDate('2020-02-29')).to.be.true;
            //Function will validate just the format
            cExpect(isDate('2019-30-01')).to.be.true;
            cExpect(isDate('2019-01-32')).to.be.true;

            cExpect(isDate('2019-1-1')).to.be.true;
            cExpect(isDate('0-0-0')).to.be.true;
            cExpect(isDate('01-02-1')).to.be.true;
            cExpect(isDate('999-1-1')).to.be.true;
        });

        it('retuns false when "value" is a string in another format or another type of object', () => {
            cExpect(isDate('text')).to.be.false;
            cExpect(isDate('//')).to.be.false;
            cExpect(isDate('a1/2/2019')).to.be.false;
            cExpect(isDate('--')).to.be.false;
            cExpect(isDate('2019-01-a')).to.be.false;
            cExpect(isDate(false)).to.be.false;
            cExpect(isDate(true)).to.be.false;
            cExpect(isDate()).to.be.false;
            cExpect(isDate({})).to.be.false;
        });
    });

    describe('ConvertToDate function', () => {
        it('is a function', () => {
            cExpect(convertToDate).to.be.a('function');
        });

        it('expects a string or a number', () => {
            cExpect(() => convertToDate()).to.throw('Value is required');
            cExpect(() => convertToDate(null)).to.throw('Value is required');
            cExpect(() => convertToDate(false)).to.throw('Value must be a string, a number or a date');
            cExpect(() => convertToDate({})).to.throw('Value must be a string, a number or a date');
            cExpect(() => convertToDate('')).to.throw('Value is not a value date');
            
            cExpect(() => convertToDate('01/02/2019')).to.not.throw();
            cExpect(() => convertToDate('2019-01-01')).to.not.throw();
            cExpect(() => convertToDate(1)).to.not.throw();
            cExpect(() => convertToDate(new Date())).to.not.throw();
        });

        it('returns a Date object based on parameter', () => {
            cExpect(convertToDate('01/01/2019')).to.be.a('Date');
            cExpect(convertToDate('01/01/2019').getTime()).to.be.equal(new Date(2019, 0, 1).getTime());
            cExpect(convertToDate('29/02/2020').getTime()).to.be.equal(new Date(2020, 1, 29).getTime());
            cExpect(convertToDate('32/01/2020').getTime()).to.be.equal(new Date(2020, 0, 32).getTime());
            cExpect(convertToDate('1/1/1').getTime()).to.be.equal(new Date(1, 0, 1).getTime());

            cExpect(convertToDate('2019-01-01')).to.be.a('Date');
            cExpect(convertToDate('2019-01-01').getTime()).to.be.equal(new Date(2019, 0, 1).getTime());
            cExpect(convertToDate('2020-02-29').getTime()).to.be.equal(new Date(2020, 1, 29).getTime());
            cExpect(convertToDate('2020-01-32').getTime()).to.be.equal(new Date(2020, 0, 32).getTime());
            cExpect(convertToDate('1-1-1').getTime()).to.be.equal(new Date(1, 0, 1).getTime());
        });
    });
});