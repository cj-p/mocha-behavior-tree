const context = global

const stepDef = (prefix, stepName, fn, ...nexts) => {
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

module.exports.scenario = (title, fn) => context.describe('Scenario: ' + title, fn)
module.exports.given = (stepName, fn, ...nexts) => stepDef('Given: ', stepName, fn, ...nexts)
module.exports.when = (stepName, fn, ...nexts) => stepDef('When: ', stepName, fn, ...nexts)
module.exports.and = (stepName, fn, ...nexts) => stepDef('And: ', stepName, fn, ...nexts)
module.exports.then = (stepName, fn, ...nexts) => stepDef('Then: ', stepName, fn, ...nexts)
module.exports.step = (stepName, fn, ...nexts) => stepDef('', stepName, fn, ...nexts)
