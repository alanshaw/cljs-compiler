module.exports = function (t) {
  if (t.last) this.push("return ")
  this.push(this.state.scopedName(t.name))
  return this
}