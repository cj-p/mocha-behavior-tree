const context = global

export const step = (stepName, fn, ...nexts) => (scopeHolder = {scope: undefined}) => {
    if (nexts.length === 0) {
        context.it(stepName, () => fn(scopeHolder.scope))
        return
    }

    context.describe(stepName, () => {
        context.beforeEach(() => Promise.resolve(fn(scopeHolder.scope))
            .then(resolved => {
                if (resolved !== undefined) {
                    scopeHolder.scope = resolved
                }
            }))

        nexts.forEach(next => next(scopeHolder))
    })
}

export const given = (stepName, fn, ...nexts) => step('Given: ' + stepName, fn, ...nexts)
export const when = (stepName, fn, ...nexts) => step('When: ' + stepName, fn, ...nexts)
export const and = (stepName, fn, ...nexts) => step('And: ' + stepName, fn, ...nexts)
export const then = (stepName, fn, ...nexts) => step('Then: ' + stepName, fn, ...nexts)
