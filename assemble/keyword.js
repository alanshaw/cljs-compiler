module.exports = function (t) {
  this.push(this.state.makeJsSafe(t.name))
  return this
}