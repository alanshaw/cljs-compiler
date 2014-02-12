module.exports = function (assemble) {
  return function (t, state) {
    var code = ""

    if (t.last) {
      code += "return "
    }

    code += "["

    code += t.vals.map(function (val) {
      return assemble([val], state)[0]
    }).join(", ")

    code += "]"

    return [code]
  }
}