const { and: 먼저, given: 만약, then: 그러면, when: 그리고, } = require('../lib')
const $ = require('./step/steps_2byte')

const 시나리오 = describe

시나리오('TestObject 테스트',
  먼저($['객체를 생성한다.'],
    만약($['1을 추가한다.'],
      그리고($['1 추가하고 값을 리턴한다.'],
        그러면($['결과는 1-1이고 값은 obj.value와 일치한다.'])),
      그리고($['2를 추가한다.'],
        그러면($['결과는 1-2이다.']))
    ),
    만약($['2를 추가한다.'],
      그리고($['1을 추가하고 a에 1을 설정한다.'],
        그러면($['결과는 2이고 a는 1이다.'])),
      그리고($['2를 추가한다.'],
        그러면($['결과는 2-2이다.'])),
      그리고($['1을 추가한다.'],
        그러면($['결과는 2-1이다.']))
    )
  )
)
