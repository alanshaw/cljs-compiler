module.exports = function (t) {
  var varName = this.state.makeJsSafe(t.name[0].name)

  this.state.addDefinition(varName)

  // Top scope gets appended to namespace
  if (this.state.scopes.length > 1) {
    this.push("var " + varName)
  } else {
    this.push(this.state.namespace + "." + varName)
  }

  this.push(" = ")
  this.assemble(t.val)

  return this
}