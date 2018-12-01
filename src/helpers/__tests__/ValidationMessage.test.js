//Libs
import chai from 'chai';
//Tested module
import validationMessage from '../ValidationMessage';

const cExpect = chai.expect;

let validity = {
    valid: true,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valueMissing: false
};

describe('ValidationMessage helper', () => {
    it('is a function', () => {
        cExpect(validationMessage).to.be.a('function');
    });

    it('returns a string', () => {
        cExpect(validationMessage()).to.be.a('string');
    });

    it('returns an empty string when no value is provided', () => {
        cExpect(validationMessage()).to.be.equal('');
    });

    it('return an empty string when a valid validity object is provided', () => {
        cExpect(validationMessage(validity)).to.be.equal('');
    });

    it('returns a non empty string when a invalid validty object is provided', () => {
        validity.valid = false;
        validity.patternMismatch = true;
        cExpect(validationMessage(validity)).to.not.be.equal('');
    });
});