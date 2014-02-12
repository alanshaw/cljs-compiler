module.exports = function (assemble) {
  return function (t, state) {
    var code = ""

    if (t.last) {
      code += "return "
    }

    code += "(function ("

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
    code += "})"

    state.destroyScope()

    return [code]
  }
}