module.exports = function (assemble) {
  return function (t, state) {
    var code = ""

    if (t.last) {
      code += "return "
    }

    code += assemble(t.name, state)[0] + " = " + assemble(t.val, state)[0]

    return [code]
  }
}