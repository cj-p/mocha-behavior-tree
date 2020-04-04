import chai from 'chai'
import { TestObject } from 'test/misc/TestObject'

const expect = chai.expect
export default {
    'create Obj': () => ({ obj: new TestObject() }),
    'add 1': async ({ obj }) => {
        await obj.add(1)
    },
    'add 1 and return values': ({ obj }) => obj.add(1).then(values => ({ obj, values })),
    'result equals to 1-1': async ({ obj, values }) => {
        expect(obj.result).to.equal('1-1')
    },
    'result equals to 1-1 and values equals to Obj.values': async ({ obj, values }) => {
        expect(obj.result).to.equal('1-1')
        expect(values).to.equal(obj.values)
    },
    'add 2': async ({ obj }) => {
        await obj.add(2)
    },
    'result equals to 1-2': async ({ obj }) => {
        expect(obj.result).to.equal('1-2')
    },
    'add 1 and set a = 1': ({ obj }) => {
        obj.add(1)
        return ({ obj, a: 1 })
    },
    'result equals to 2-1': ({ obj }) => {
        expect(obj.result).to.equal('2-1')
    },
    'result equals to 2 and a equals to 1': ({ obj, a }) => {
        expect(obj.result).to.equal('2')
        expect(a).to.equal(1)
    },
    'result equals to 2-2': ({ obj }) => {
        expect(obj.result).to.equal('2-2')
    }
}
