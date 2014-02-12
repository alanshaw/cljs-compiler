module.exports = function (assemble) {
  return function (t, state) {
    var code = ""
    if (t.last) {
      code += "return "
    }
    code += assemble(t.left, state)[0] + " " + t.operator[0].name + " " + assemble(t.right, state)[0]
    return [code]
  }
}