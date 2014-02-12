module.exports = function (assemble) {
  return function (t, state) {
    state.scopeNames = false
    var v = assemble(t.name, state)[0]
    state.scopeNames = true

    state.addDefinition(v)

    // Top scope gets appended to namespace
    if (state.scopes.length > 1) {
      v = "var " + v
    } else {
      v = state.namespace + "." + v
    }

    return [v + " = " + assemble(t.val, state)[0]]
  }
}