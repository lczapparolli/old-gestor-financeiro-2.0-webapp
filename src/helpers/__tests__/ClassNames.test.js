//Libs
import chai from 'chai';
//Tested module
import classNames from '../ClassNames';

const cExpect = chai.expect;

describe('ClassNames Helper', () => {
    it('is a function', () => {
        cExpect(classNames).to.be.a('function');
    });

    it('returns a string', () => {
        cExpect(classNames()).to.be.a('string');
    });

    it('returns a string containing the items of an array', () => {
        const classes = ['red', 'blue', 'green'];
        const result = classNames(classes);

        cExpect(result).to.contain(classes[0]);
        cExpect(result).to.contain(classes[1]);
        cExpect(result).to.contain(classes[2]);
    });

    it('returns a string containing the properties of an object wich value is no `false` equivalent', () => {
        const classes = {
            'red': true,
            'blue': 1,
            'green': false,
            'orange': 0
        };
        const result = classNames(classes);

        cExpect(result).to.contain('red');
        cExpect(result).to.contain('blue');
        cExpect(result).to.not.contain('green');
        cExpect(result).to.not.contain('orange');
    });

    it('returns the items separated by spaces', () => {
        const classes = ['red', 'blue', 'green'];
        const result = classNames(classes);

        cExpect(result.split(' ')).to.be.deep.eq(classes);
    });
});