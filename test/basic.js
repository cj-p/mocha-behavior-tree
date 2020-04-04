const { expect } = require('chai')
const { and, given, then, when, scenario } = require('../lib')
const TestObject = require('./misc/TestObject')

describe('mocha-behavior-tree', () =>
  scenario('test TestObject',
    given('create Obj',
      () => ({ obj: new TestObject() }),
      when('add 1',
        async ({ obj }) => {
          await obj.add(1)
        },
        and('add 1',
          ({ obj }) => obj.add(1).then(values => ({ obj, values })),
          then('result equals to 1-1',
            async ({ obj, values }) => {
              expect(obj.result).to.equal('1-1')
              expect(values).to.equal(obj.values)
            })),
        and('add 2',
          async ({ obj }) => {
            await obj.add(2)
          },
          then('result equals to 1-2',
            async ({ obj }) => {
              expect(obj.result).to.equal('1-2')
            }))
      ),
      when('add 2',
        async ({ obj }) => {
          await obj.add(2)
        },
        and('add 1',
          ({ obj }) => {
            obj.add(1)
            return ({ obj, a: 1 })
          },
          then('result equals to 2-1',
            ({ obj, a }) => {
              expect(obj.result).to.equal('2')
              expect(a).to.equal(1)
            })),
        and('add 2',
          async ({ obj }) => {
            await obj.add(2)
          },
          then('result equals to 2-2',
            ({ obj }) => {
              expect(obj.result).to.equal('2-2')
            }))
      )
    ))
)
