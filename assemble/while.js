module.exports = function (assemble) {
  return function (t, state) {
    var code = "while (" + assemble(t.condition, state).join(",") + ") {"

    if (t.last && t.body.length) {
      t.body[t.body.length - 1].last = true
    }

    code += assemble(t.body, state).join(";\n")
    code += "}"

    return [code]
  }
}