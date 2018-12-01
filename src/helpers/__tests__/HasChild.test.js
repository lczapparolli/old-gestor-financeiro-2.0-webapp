//Libs
import React from 'react';
import chai from 'chai';
//Tested module
import hasChild from '../HasChild';

const cExpect = chai.expect;
class TestComponent extends React.Component {
    render() {
        return (
            <div>Test</div>
        );
    }
}

function TestComponent2() {
    return (
        <div>Test</div>
    );
}

describe('HasChild helper', () => {
    it('is a function', () => {
        cExpect(hasChild).to.be.a('function');
    });

    it('returns a boolean', () => {
        cExpect(hasChild()).to.be.a('boolean');
    });

    it('returns true when one of the children is of specified type', () => {
        const node = (
            <div>
                <p>Teste</p>
                <span>Teste</span>
            </div>
        );

        cExpect(hasChild(node.props.children, 'span')).to.be.equal(true);
    });

    it('return false when none of the children is of specified type', () => {
        const node = (
            <div>
                <p>Teste</p>
                <p>Teste</p>
            </div>
        );

        cExpect(hasChild(node.props.children, 'span')).to.be.equal(false);
    });

    it('works with string and type', () => {
        const node = (
            <div>
                <p>Teste</p>
                <p>Teste</p>
                <TestComponent />
                <TestComponent2 />
            </div>
        );

        cExpect(hasChild(node.props.children, 'TestComponent')).to.be.equal(true);
        cExpect(hasChild(node.props.children, 'TestComponent2')).to.be.equal(true);
        cExpect(hasChild(node.props.children, TestComponent)).to.be.equal(true);
        cExpect(hasChild(node.props.children, TestComponent2)).to.be.equal(true);
    });
});