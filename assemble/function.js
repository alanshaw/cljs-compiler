module.exports = function (assemble) {
  return function (t, state) {
    if (!state.namespace) throw new Error("No namespace declared")

    state.scopeNames = false
    var functionName = assemble(t.name, state)[0]
    state.scopeNames = true

    // Add the function to the current scope
    state.addDefinition(functionName)

    var code = assemble(t.name, state)[0] + " = function " + functionName + " ("

    // Create a new scope where the function parameters will be declared
    state.createScope()

    state.scopeNames = false
    code += t.args.map(function (arg) {
      var name = assemble([arg], state)[0]
      state.addDefinition(name)
      return name
    }).join(", ")
    state.scopeNames = true

    code += ") {"
    code += assemble(t.body, state).join(";\n")
    code += "}"

    state.destroyScope()

    return [code]
  }
}

