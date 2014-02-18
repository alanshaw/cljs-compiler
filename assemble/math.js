module.exports = function (t) {
  if (t.last) this.push("return ")
  this.assemble(t.left)
  this.push(" " + t.operator[0].name + " ")
  this.assemble(t.right)
  return this
}