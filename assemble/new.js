module.exports = function (assemble) {
  return function (t, state) {
    var code = ""

    if (t.last) {
      code += "return "
    }

    code += "new " + assemble(t.name, state).join("") + "("

    if (t.args.length) {
      code += t.args.map(function (arg) {
        return assemble([arg], state)[0]
      }).join(", ")
    }

    code += ")"

    return [code]
  }
}