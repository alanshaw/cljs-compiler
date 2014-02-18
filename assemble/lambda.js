module.exports = function (t) {
  if (t.last) this.push("return ")

  this.push("(function (")

  // Create a new scope where the function parameters will be declared
  this.state.createScope()

  var lastIndex = t.args.length - 1
  t.args.forEach(function (arg, i) {
    this.assemble([arg])
    this.state.addDefinition(arg.name)
    if (i < lastIndex) this.push(", ")
  }, this)

  this.push(") {")
  this.assembleEach(t.body, ";\n")
  this.push("})")

  this.state.destroyScope()

  return this
}