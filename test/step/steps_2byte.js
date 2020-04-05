const { expect } = require('chai')
const TestObject = require('../double/TestObject')

module.exports = {
  '객체를 생성한다.': () => ({ obj: new TestObject() }),
  '1을 추가한다.': async ({ obj }) => {
    await obj.add(1)
  },
  '1 추가하고 값을 리턴한다.': ({ obj }) => obj.add(1).then(values => ({ obj, values })),
  '결과는 1-1이고 값은 obj.value와 일치한다.': async ({ obj, values }) => {
    expect(obj.result).to.equal('1-1')
    expect(values).to.equal(obj.values)
  },
  '2를 추가한다.': async ({ obj }) => {
    await obj.add(2)
  },
  '결과는 1-2이다.': async ({ obj }) => {
    expect(obj.result).to.equal('1-2')
  },
  '1을 추가하고 a에 1을 설정한다.': ({ obj }) => {
    obj.add(1)
    return ({ obj, a: 1 })
  },
  '결과는 2이고 a는 1이다.': ({ obj, a }) => {
    expect(obj.result).to.equal('2')
    expect(a).to.equal(1)
  },
  '결과는 2-2이다.': ({ obj }) => {
    expect(obj.result).to.equal('2-2')
  },
  '결과는 2-1이다.': ({ obj }) => {
    expect(obj.result).to.equal('2-1')
  }
}
