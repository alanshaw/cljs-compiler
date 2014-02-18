module.exports = function (t) {
  if (!this.state.namespace) throw new Error("No namespace declared")

  // Add the function to the current scope
  this.state.addDefinition(t.name.name)

  this.assemble(t.name)
  this.push(" = function " + t.name.name + " (")

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
  this.push("}")

  this.state.destroyScope()

  return this
}

