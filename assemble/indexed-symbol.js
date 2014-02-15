module.exports = function (t) {
  if (t.last) this.push("return ")
  this.push(this.state.scopes[0][t.index])
  return this
}