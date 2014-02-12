module.exports = function (assemble) {
  return function (t, state) {
    var code = "while (true) {"

    if (t.last && t.body.length) {
      t.body[t.body.length - 1].last = true
    }

    code += assemble(t.body, state).join(";\n")
    code += "break}"

    return [code]
  }
}