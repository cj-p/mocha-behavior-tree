const {expect} = require('chai')
const {scenario, step} = require('../lib')

describe('mocha-behavior-tree', () => {
    describe('scenario', () => {
        it('throws error informing the first argument is not a scenario title(string)', () => {
            expect(() => scenario(step(() => {
            }))).to.throws('The first argument [title] must be string.')
        })
    })
})
