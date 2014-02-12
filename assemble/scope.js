module.exports = function (assemble) {
  return function (t, state) {
    if (t.last && t.body.length) {
      t.body[t.body.length - 1].last = true
    }

    state.createScope()
    var code = assemble(t.body, state).join(";\n")
    state.destroyScope()

    return [code]
  }
}