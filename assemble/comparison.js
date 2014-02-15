module.exports = function (t) {
  if (t.last) this.push("return ")

  this.push("(")
  this.assemble(t.left)
  this.push(" " + t.type[0].name + " ")
  this.assemble(t.right)
  this.push(")")

  return this
}