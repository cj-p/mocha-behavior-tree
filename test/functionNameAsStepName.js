import { and, given, then, when } from 'lib'
import $ from './misc/steps'

describe('test TestObject', () => {
    given($['create Obj'],
        when($['add 1'],
            and($['add 1 and return values'],
                then($['result equals to 1-1 and values equals to Obj.values'])),
            and($['add 2'],
                then($['result equals to 1-2']))
        ),
        when($['add 2'],
            and($['add 1 and set a = 1'],
                then($['result equals to 2 and a equals to 1'])),
            and($['add 2'],
                then($['result equals to 2-2'])),
            and($['add 1'],
                then($['result equals to 2-1'])),
        )
    )()
})
