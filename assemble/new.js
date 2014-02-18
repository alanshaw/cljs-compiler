module.exports = function (t) {
  if (t.last) this.push("return ")

  this.push("new ")
  this.assemble(t.name)
  this.push("(")
  this.assembleEach(t.args, ", ")
  this.push(")")

  return this
}