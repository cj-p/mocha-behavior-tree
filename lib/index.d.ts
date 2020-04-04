/// <reference types="mocha" />


type Step = (this: Mocha.Suite) => void

interface StepDef {
    (stepName: string, fn: (scope: any) => any | Promise<any> | void, ...nexts: Step[]): Step

    (fn: (scope: any) => any | Promise<any> | void, ...nexts: Step[]): Step
}

export var scenario: (title:string, fn: (this: Mocha.Suite) => void) => Mocha.SuiteFunction;
export var given: StepDef;
export var when: StepDef;
export var and: StepDef;
export var then: StepDef;
export var step: StepDef;
