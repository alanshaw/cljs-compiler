module.exports = function (t) {
  if (t.last && t.body.length) {
    t.body[t.body.length - 1].last = true
  }

  this.state.createScope()
  this.assembleEach(t.body, ";\n")
  this.state.destroyScope()

  return this
}