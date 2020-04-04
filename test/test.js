import chai from 'chai'
import { and, given, then, when } from 'lib'

const expect = chai.expect

class MyObj {
    constructor () {
        this.values = []
    }

    do1 () {
        return new Promise(reolve => {
            setImmediate(() => {
                this.values.push(1)
                reolve(this.values)
            })
        })
    }

    do2 () {
        return new Promise(reolve => {
            setImmediate(() => {
                this.values.push(2)
                reolve(this.values)
            })
        })
    }

    get result () {
        return this.values.join('-')
    }
}

describe('common functions',
    given('create Obj', () => ({ obj: new MyObj() }),
        when('do 1', async ({ obj }) => {
                await obj.do1()
            },
            and('do 1-1', ({ obj }) => {
                    return obj.do1().then(values => ({
                        obj,
                        values
                    }))
                },
                then('result equals to 1-1', async ({ obj, values }) => {
                    expect(obj.result).to.equal('1-1')
                    expect(values).to.equal(obj.values)
                })),
            and('do 1-2', async ({ obj }) => {
                    await obj.do2()
                },
                then('result equals to 1-2', async ({ obj }) => {
                    expect(obj.result).to.equal('1-2')
                }))
        ),
        when('do 2', async ({ obj }) => {
                await obj.do2()
            },
            and('do 2-1', ({ obj }) => {
                    obj.do1()
                    return ({
                        obj, a: 1
                    })
                },
                then('result equals to 2-1', async ({ obj, a }) => {
                    // expect(obj.result).to.equal('2-1')
                    expect(a).to.equal(1)
                })),
            and('do 2-2', async ({ obj }) => {
                    await obj.do2()
                },
                then('result equals to 2-2', async ({ obj }) => {
                    expect(obj.result).to.equal('2-2')
                }))
        )
    ))
