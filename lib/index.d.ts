/// <reference types="mocha" />

type Step = (this:Mocha.Suite) => void

export var given: (stepName: string, fn: (scope:any) => any | Promise<any> | void , ...nexts:Step[]) => Step;
export var when: (stepName: string, fn: (scope:any) => any | Promise<any> | void , ...nexts:Step[]) => Step;
export var and: (stepName: string, fn: (scope:any) => any | Promise<any> | void , ...nexts:Step[]) => Step;
export var then: (stepName: string, fn: (scope:any) => any | Promise<any> | void , ...nexts:Step[]) => Step;
export var step: (stepName: string, fn: (scope:any) => any | Promise<any> | void , ...nexts:Step[]) => Step;
