module.exports = function (assemble) {
  return function (t, state) {
    var code = ""
    if (t.last) {
      code += "return "
    }
    code += "(" + assemble(t.left, state) + " " + t.type[0].name + " " + assemble(t.right, state) + ")"
    return [code]
  }
}