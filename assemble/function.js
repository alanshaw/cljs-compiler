module.exports = function (t) {
  if (!this.state.namespace) throw new Error("No namespace declared")

  var fnName = this.state.makeJsSafe(t.name[0].name)

  // Add the function to the current scope
  this.state.addDefinition(fnName)

  this.assemble(t.name)
  this.push(" = function " + fnName + " (")

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

