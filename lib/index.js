const context = global

export const stepDef = (prefix, stepName, fn, ...nexts) => {
    if (typeof stepName === 'function') {
        return stepDef(prefix, stepName.name, stepName, ...[fn].concat(nexts).filter(a => typeof a === 'function'))
    }

    return (scopeHolder = { scope: undefined }) => {
        if (nexts.length === 0) {
            context.it(prefix + stepName, () => fn(scopeHolder.scope))
            return
        }

        context.describe(prefix + stepName, () => {
            context.beforeEach(() => Promise.resolve(fn(scopeHolder.scope))
                .then(resolved => {
                    if (resolved !== undefined) {
                        scopeHolder.scope = resolved
                    }
                }))

            nexts.forEach(next => next(scopeHolder))
        })
    }
}

export const given = (stepName, fn, ...nexts) => {
    console.log(stepName)
    return stepDef('Given: ', stepName, fn, ...nexts)
}
export const when = (stepName, fn, ...nexts) => stepDef('When: ',stepName, fn, ...nexts)
export const and = (stepName, fn, ...nexts) => stepDef('And: ',stepName, fn, ...nexts)
export const then = (stepName, fn, ...nexts) => stepDef('Then: ',stepName, fn, ...nexts)
export const step = (stepName, fn, ...nexts) => stepDef('Then: ',stepName, fn, ...nexts)
