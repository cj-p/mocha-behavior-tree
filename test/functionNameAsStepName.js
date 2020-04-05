const { and, given, then, when, scenario } = require('../lib')
const _ = require('./step/steps')

scenario('test TestObject',
  given(_['create Obj'],
    when(_['add 1'],
      and(_['add 1 and return values'],
        then(_['result equals to 1-1 and values equals to Obj.values'])),
      and(_['add 2'],
        then(_['result equals to 1-2']))
    ),
    when(_['add 2'],
      and(_['add 1 and set a = 1'],
        then(_['result equals to 2 and a equals to 1'])),
      and(_['add 2'],
        then(_['result equals to 2-2'])),
      and(_['add 1'],
        then(_['result equals to 2-1'])),
    )
  )
)
