module.exports = class TestObject {
  values = []

  add = value => new Promise(resolve => setImmediate(() => resolve(this.values = this.values.concat(value))))

  get result () {
    return this.values.join('-')
  }
}
