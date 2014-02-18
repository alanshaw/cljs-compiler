module.exports = function (t) {
  if (t.last) this.push("return ")

  this.assemble(t.name)
  this.push(" = ")
  this.assemble(t.val)

  return this
}